
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { add } from 'date-fns';

export async function GET() {
  const invoices = await prisma.invoice.findMany({ 
    include: { 
      party: true, 
      items: { 
        include: { 
          fish: true 
        } 
      } 
    } 
  });
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { partyId, items, charges, ...invoiceData } = body;

  const subtotal = items.reduce((acc: number, item: any) => {
    return acc + (item.weight || 0) * (item.pricePerKilo || 0);
  }, 0);

  const totalCharges = charges?.reduce((acc: number, charge: any) => {
     if (charge.type === 'fixed') {
        return acc + (charge.value || 0);
    }
    if (charge.type === 'percentage') {
        return acc + (subtotal * (charge.value || 0) / 100);
    }
    return acc;
  }, 0) || 0;
  
  const totalAmount = subtotal - totalCharges;

  const currentDate = new Date();
  
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  let newInvoiceNumber = 'INV-1';
  if (lastInvoice && lastInvoice.invoiceNumber) {
    const lastInvoiceNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
    newInvoiceNumber = `INV-${lastInvoiceNumber + 1}`;
  }

  const newInvoice = await prisma.invoice.create({
    data: {
      ...invoiceData,
      invoiceNumber: newInvoiceNumber,
      date: currentDate,
      dueDate: add(currentDate, { days: 30 }),
      totalAmount,
      status: 'Unpaid',
      party: {
        connect: { id: partyId }
      },
      items: {
        create: items.map((item: any) => ({
          weight: item.weight,
          pricePerKilo: item.pricePerKilo,
          length: item.length,
          fish: {
            connect: { id: item.fishId }
          }
        }))
      }
    }
  });

  return NextResponse.json(newInvoice, { status: 201 });
}

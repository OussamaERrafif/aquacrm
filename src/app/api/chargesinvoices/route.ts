
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { add } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const include_collaborator = searchParams.get('include_collaborator') === 'true'
  const include_charges = searchParams.get('include_charges') === 'true'

  const chargesInvoices = await prisma.chargesInvoice.findMany({ 
    include: { 
      collaborator: include_collaborator,
      charges: include_charges,
    },
    orderBy: {
        date: 'desc',
    }
  });
  return NextResponse.json(chargesInvoices);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { collaboratorId, charges, ...chargesInvoiceData } = body;

  const totalAmount = charges.reduce((acc: number, charge: any) => {
    return acc + (charge.price || 0);
  }, 0);

  const currentDate = new Date();
  
  const lastChargesInvoice = await prisma.chargesInvoice.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  let newInvoiceNumber = 'INV-1';
  if (lastChargesInvoice && lastChargesInvoice.invoiceNumber) {
    const lastInvoiceNumber = parseInt(lastChargesInvoice.invoiceNumber.split('-')[1]);
    newInvoiceNumber = `INV-${lastInvoiceNumber + 1}`;
  }

  const newChargesInvoice = await prisma.chargesInvoice.create({
    data: {
      ...chargesInvoiceData,
      invoiceNumber: newInvoiceNumber,
      date: currentDate,
      totalAmount,
      status: 'Unpaid',
      collaborator: {
        connect: { id: collaboratorId }
      },
      charges: {
        create: charges.map((charge: any) => ({
          title: charge.title,
          price: charge.price,
        }))
      }
    }
  });

  return NextResponse.json(newChargesInvoice, { status: 201 });
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  const { partyId, items, ...invoiceData } = body;
  
  const newInvoice = await prisma.invoice.create({
    data: {
      ...invoiceData,
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

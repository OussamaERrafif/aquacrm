
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({ 
      where: { id: params.id }, 
      include: { 
          party: true, 
          items: { 
              include: { 
                  fish: true 
                } 
            } 
        } 
    });
  if (!invoice) return new Response('Not Found', { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { partyId, items, ...invoiceData } = body;

  await prisma.invoiceItem.deleteMany({
    where: { invoiceId: params.id }
  });

  const updatedInvoice = await prisma.invoice.update({
    where: { id: params.id },
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

  return NextResponse.json(updatedInvoice);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.invoice.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

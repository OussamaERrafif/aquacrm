
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const chargesInvoice = await prisma.chargesInvoice.findUnique({ 
      where: { id: params.id }, 
      include: { 
          collaborator: true, 
          charges: true,
        } 
    });
  if (!chargesInvoice) return new Response('Not Found', { status: 404 });
  return NextResponse.json(chargesInvoice);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { collaboratorId, charges, ...chargesInvoiceData } = body;

  await prisma.charge.deleteMany({
    where: { chargesInvoiceId: params.id }
  });

  const updatedChargesInvoice = await prisma.chargesInvoice.update({
    where: { id: params.id },
    data: {
        ...chargesInvoiceData,
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

  return NextResponse.json(updatedChargesInvoice);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.chargesInvoice.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

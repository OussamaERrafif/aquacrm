
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // const invoice = await prisma.invoice.findUnique({ where: { id: params.id }, include: { party: true, items: { include: { fish: true } } } });
  // if (!invoice) return new Response('Not Found', { status: 404 });
  // return NextResponse.json(invoice);
  return NextResponse.json({ id: params.id, invoiceNumber: 'INV-MOCK-001' });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  // const updatedInvoice = await prisma.invoice.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ id: params.id, ...body });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // await prisma.invoice.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

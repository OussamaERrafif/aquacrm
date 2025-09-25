
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.fish.findUnique({ where: { id: params.id } });
  if (!product) return new Response('Not Found', { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updatedProduct = await prisma.fish.update({ where: { id: params.id }, data: body });
  return NextResponse.json(updatedProduct);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Remove dependent invoice items first to satisfy foreign key constraints
  await prisma.invoiceItem.deleteMany({ where: { fishId: params.id } });

  // Then delete the fish record
  try {
    await prisma.fish.delete({ where: { id: params.id } });
    return new Response(null, { status: 204 });
  } catch (err: any) {
    // If fish not found, return 404
    if (err?.code === 'P2025') {
      return new Response('Not Found', { status: 404 });
    }
    throw err;
  }
}

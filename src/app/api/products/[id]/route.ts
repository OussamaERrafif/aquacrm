
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
  await prisma.fish.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

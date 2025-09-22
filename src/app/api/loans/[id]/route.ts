
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // const loan = await prisma.loan.findUnique({ where: { id: params.id }, include: { fisher: true } });
  // if (!loan) return new Response('Not Found', { status: 404 });
  // return NextResponse.json(loan);
  return NextResponse.json({ id: params.id, loanId: 'LN-MOCK-001' });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  // const updatedLoan = await prisma.loan.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ id: params.id, ...body });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // await prisma.loan.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

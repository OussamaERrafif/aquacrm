
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const loan = await prisma.loan.findUnique({ where: { id: params.id }, include: { fisher: true } });
  if (!loan) return new Response('Not Found', { status: 404 });
  return NextResponse.json(loan);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { fisherId, ...loanData } = body;
  const updatedLoan = await prisma.loan.update({ 
    where: { id: params.id }, 
    data: {
      ...loanData,
      fisher: {
        connect: { id: fisherId }
      }
    }
   });
  return NextResponse.json(updatedLoan);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.loan.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

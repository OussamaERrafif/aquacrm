
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const loans = await prisma.loan.findMany({ include: { fisher: true } });
  return NextResponse.json(loans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { fisherId, ...loanData } = body;
  const newLoan = await prisma.loan.create({ 
    data: {
      ...loanData,
      loanId: `LOAN-${Date.now()}`,
      fisher: {
        connect: { id: fisherId }
      },
      // When creating a new loan, the outstanding balance is the same as the amount
      outstandingBalance: loanData.amount,
      status: 'Active'
    }
  });
  return NextResponse.json(newLoan, { status: 201 });
}

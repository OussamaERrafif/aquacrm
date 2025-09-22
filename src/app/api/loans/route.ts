
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // const loans = await prisma.loan.findMany({ include: { fisher: true } });
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();
  // const newLoan = await prisma.loan.create({ data: body });
  return NextResponse.json(body, { status: 201 });
}

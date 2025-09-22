
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // const invoices = await prisma.invoice.findMany({ include: { party: true, items: { include: { fish: true } } } });
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();
  // const newInvoice = await prisma.invoice.create({ data: body });
  return NextResponse.json(body, { status: 201 });
}

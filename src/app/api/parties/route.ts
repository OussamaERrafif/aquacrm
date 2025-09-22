
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextApiRequest } from 'next';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const include_invoices = searchParams.get('include_invoices')

  const parties = await prisma.party.findMany({
    include: {
        invoices: include_invoices === 'true'
    }
  });
  return NextResponse.json(parties);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newParty = await prisma.party.create({ data: body });
  return NextResponse.json(newParty, { status: 201 });
}

    

import { NextResponse } from 'next/server';
import { getParties } from '@/lib/data';
import { prisma } from '@/lib/prisma';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const include_invoices = searchParams.get('include_invoices') === 'true'

  const parties = await getParties(include_invoices);
  return NextResponse.json(parties);
}

export async function POST(request: Request) {
  const body = await request.json();
  // basic validation could be added here
  const newParty = await prisma.party.create({ data: body });
  return NextResponse.json(newParty, { status: 201 });
}

    
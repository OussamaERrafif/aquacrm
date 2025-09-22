
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const parties = await prisma.party.findMany();
  return NextResponse.json(parties);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newParty = await prisma.party.create({ data: body });
  return NextResponse.json(newParty, { status: 201 });
}

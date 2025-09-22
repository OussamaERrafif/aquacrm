
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // In a real app, you'd fetch from the database
  // const parties = await prisma.party.findMany();
  // For now, return empty array
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();
  // In a real app, you'd create a new party in the database
  // const newParty = await prisma.party.create({ data: body });
  // For now, return the created data
  return NextResponse.json(body, { status: 201 });
}

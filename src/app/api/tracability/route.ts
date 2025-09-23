
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tracabilityEntries = await prisma.tracability.findMany();
  return NextResponse.json(tracabilityEntries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { codeMareyeur, nomMareyeur, poidsAchete, poidsVendu, tracabilityDate } = body;

  const data = {
    codeMareyeur,
    nomMareyeur,
    poidsAchete,
    poidsVendu,
    ...(tracabilityDate ? { tracabilityDate: new Date(tracabilityDate) } : {}),
  } as const;

  const newTracabilityEntry = await prisma.tracability.create({ data });

  return NextResponse.json(newTracabilityEntry, { status: 201 });
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tracabilityEntries = await prisma.tracability.findMany();
  return NextResponse.json(tracabilityEntries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { codeMareyeur, nomMareyeur, poidsAchete, poidsVendu } = body;

  const newTracabilityEntry = await prisma.tracability.create({
    data: {
      codeMareyeur,
      nomMareyeur,
      poidsAchete,
      poidsVendu,
    },
  });

  return NextResponse.json(newTracabilityEntry, { status: 201 });
}

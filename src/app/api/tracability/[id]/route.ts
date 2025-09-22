import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const tracabilityEntry = await prisma.tracability.findUnique({
    where: { id: params.id },
  });
  if (!tracabilityEntry) return new Response('Not Found', { status: 404 });
  return NextResponse.json(tracabilityEntry);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { codeMareyeur, nomMareyeur, poidsAchete, poidsVendu } = body;

  const updatedTracabilityEntry = await prisma.tracability.update({
    where: { id: params.id },
    data: {
      codeMareyeur,
      nomMareyeur,
      poidsAchete,
      poidsVendu,
    },
  });

  return NextResponse.json(updatedTracabilityEntry);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.tracability.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}

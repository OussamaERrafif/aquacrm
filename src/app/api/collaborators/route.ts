
import { NextResponse } from 'next/server';
import { getCollaborators } from '@/lib/data';
import { prisma } from '@/lib/prisma';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const include_charges_invoices = searchParams.get('include_charges_invoices') === 'true'

  const collaborators = await getCollaborators(include_charges_invoices);
  return NextResponse.json(collaborators);
}

export async function POST(request: Request) {
  const body = await request.json();
  // basic validation could be added here
  const newCollaborator = await prisma.collaborator.create({ data: body });
  return NextResponse.json(newCollaborator, { status: 201 });
}

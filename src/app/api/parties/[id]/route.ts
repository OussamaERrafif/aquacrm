
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const party = await prisma.party.findUnique({ 
    where: { id: params.id },
    include: {
      invoices: {
        orderBy: {
          date: 'desc'
        }
      },
      loans: {
        orderBy: {
            disbursementDate: 'desc'
        }
      },
    }
  });
  if (!party) return new Response('Not Found', { status: 404 });
  return NextResponse.json(party);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updatedParty = await prisma.party.update({ where: { id: params.id }, data: body });
  return NextResponse.json(updatedParty);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // In a real app, you might need to handle related records first
        // For example, deleting or unlinking invoices and loans.
        // Prisma's default behavior on delete with relations might need configuration
        // in the schema (e.g., onDelete: Cascade)
        await prisma.party.delete({ where: { id: params.id } });
        return new Response(null, { status: 204 });
    } catch (error) {
        // console.error(error);
        // This can fail if there are related records (invoices, loans) and
        // the database schema enforces foreign key constraints.
        return new Response('Error deleting party, check for related records.', { status: 409 });
    }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params as { id: string };
  const collaborator = await prisma.collaborator.findUnique({ 
    where: { id },
    include: {
      chargesInvoices: {
        include: {
            charges: true,
        },
        orderBy: {
            date: 'desc'
        }
      },
    }
  });
  if (!collaborator) return new Response('Not Found', { status: 404 });
  return NextResponse.json(collaborator);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params as { id: string };
  const body = await request.json();
  const updatedCollaborator = await prisma.collaborator.update({ where: { id }, data: body });
  return NextResponse.json(updatedCollaborator);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params as { id: string };
  try {
    await prisma.collaborator.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Error deleting collaborator, check for related records.', { status: 409 });
  }
}

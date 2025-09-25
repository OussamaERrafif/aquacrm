import { NextResponse } from 'next/server';
import { getCollaborators } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const include_charges_invoices = searchParams.get('include_charges_invoices') === 'true';
  const collaborators = await getCollaborators(include_charges_invoices);
  return NextResponse.json(collaborators);
}

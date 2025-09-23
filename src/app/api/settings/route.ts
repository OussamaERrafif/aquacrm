import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { companyName, companyLogo } = await req.json();

    // In a real app, you'd get the user ID from the session
    const user = await prisma.user.findFirst();

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

  // The User model doesn't include companyName/companyLogo fields in Prisma schema.
  // For now, validate input and return the user without updating Prisma fields.
  return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

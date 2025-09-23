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

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        companyName,
        companyLogo,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

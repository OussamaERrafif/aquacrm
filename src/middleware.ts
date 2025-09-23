

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const config = {
  matcher: ['/api/invoices/:path*', '/api/loans/:path*'],
};

export const runtime = 'experimental-edge';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')?.[1];

  if (!token) {
    return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
  }

  const decodedToken = await verifyToken(token);
  console.log('Decoded token:', decodedToken);

  if (!decodedToken) {
    return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', decodedToken.id);
  requestHeaders.set('x-user-email', decodedToken.email);
  requestHeaders.set('x-user-name', decodedToken.username);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

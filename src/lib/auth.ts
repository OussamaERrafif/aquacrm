
import { jwtVerify, SignJWT, importJWK, JWK, errors as JoseErrors } from 'jose';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;

// We'll derive a symmetric JWK from the secret for use with jose.
function getJwk(): JWK {
  // For HS256, use a octet key with the raw secret as 'k'
  return { kty: 'oct', k: Buffer.from(JWT_SECRET).toString('base64') } as JWK;
}

export async function signToken(user: Pick<User, 'id' | 'email' | 'username'>): Promise<string> {
  const jwk = getJwk();
  const alg = 'HS256';
  const now = Math.floor(Date.now() / 1000);

  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg })
    .setIssuedAt(now)
    .setExpirationTime('1h')
    .sign(await importJWK(jwk, alg));
}

export async function verifyToken(token: string): Promise<(Pick<User, 'id' | 'email' | 'username'> & { iat: number; exp: number }) | null> {
  try {
    const jwk = getJwk();
    const alg = 'HS256';
    const key = await importJWK(jwk, alg);
    // Allow a small clock skew tolerance to avoid intermittent expiry issues (in seconds)
    const clockTolerance = 60; // 60 seconds
    const { payload } = await jwtVerify(token, key, { algorithms: [alg], clockTolerance });
    return payload as (Pick<User, 'id' | 'email' | 'username'> & { iat: number; exp: number });
  } catch (error: any) {
    const code = error?.code ?? error?.name ?? '';
    if (code === 'ERR_JWT_EXPIRED' || code === 'JWTExpired') {
      console.warn('JWT expired:', error?.payload ?? 'unknown');
      return null;
    }
    console.error('Error verifying token:', error);
    return null;
  }
}

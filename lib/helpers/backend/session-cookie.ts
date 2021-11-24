import cookie from 'cookie';

export const SESSION_TOKEN_COOKIE = 'session-token';

export function createSessionCookie(sessionToken: string, expirationDate: Date): string {
  // Remove port from URL (e.g. localhost:4000 -> localhost)
  if (!process.env.VERCEL_URL) {
    throw new Error('process.env.VERCEL_URL must be set.');
  }
  const { hostname } = new URL('https://' + process.env.VERCEL_URL);

  return cookie.serialize(SESSION_TOKEN_COOKIE, sessionToken, {
    domain: hostname,
    expires: expirationDate,
    secure: true,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  });
}
export function createDeleteSessionCookie(): string {
  return createSessionCookie('deleted', new Date(0));
}

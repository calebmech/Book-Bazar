import { getSessionWithUser } from '@lib/services/session';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { SESSION_TOKEN_COOKIE, createSessionCookie } from './session-cookie';

export async function getCurrentUser(req: NextApiRequest, res: NextApiResponse): Promise<User | null> {
  const sessionToken = req.cookies[SESSION_TOKEN_COOKIE];

  if (!sessionToken) {
    return null;
  }

  const session = await getSessionWithUser(sessionToken);

  if (!session) {
    return null;
  }

  res.setHeader('Set-Cookie', createSessionCookie(sessionToken, session.expirationDate));

  return session.user;
}

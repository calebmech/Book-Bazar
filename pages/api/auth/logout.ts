import { createDeleteSessionCookie, SESSION_TOKEN_COOKIE } from '@lib/helpers/backend/session-cookie';
import { HttpMethod } from '@lib/http-method';
import { deleteSession } from '@lib/services/session';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.POST:
      return logout(req, res);
    default:
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies[SESSION_TOKEN_COOKIE];

  await deleteSession(token);

  res.setHeader('Set-Cookie', createDeleteSessionCookie());
  res.redirect('/');
}

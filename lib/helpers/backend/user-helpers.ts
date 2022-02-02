import { getSessionWithUser } from "@lib/services/session";
import { User } from "@prisma/client";
import { ServerResponse } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { createSessionCookie, SESSION_TOKEN_COOKIE } from "./session-cookie";

export async function isAuthenticated(
  req: { cookies: NextApiRequestCookies },
  res: ServerResponse
): Promise<boolean> {
  const user = await getCurrentUser(req, res);

  return Boolean(user);
}

export async function getCurrentUser(
  req: { cookies: NextApiRequestCookies },
  res: ServerResponse
): Promise<User | null> {
  const sessionToken = req.cookies[SESSION_TOKEN_COOKIE];

  if (!sessionToken) {
    return null;
  }

  const session = await getSessionWithUser(sessionToken);

  if (!session) {
    return null;
  }

  res.setHeader(
    "Set-Cookie",
    createSessionCookie(sessionToken, session.expirationDate)
  );

  return session.user;
}

export function isUserProfileCompleted(user: User): boolean {
  return Boolean(user.name);
}

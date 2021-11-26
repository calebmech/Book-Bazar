import { prisma } from "./db";
import { hashToken } from "../helpers/backend/tokens";

function getSessionRenewalDate(): Date {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 1); // ~1 months from now
}

function getSessionExpirationDate(): Date {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6); // ~6 months from now
}

export async function getSessionWithUser(sessionToken: string) {
  const hashedSessionToken = hashToken(sessionToken);

  // Get session
  let session = await prisma.session.findUnique({
    where: { hashedToken: hashedSessionToken },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Delete session if expired
  if (session.expirationDate < new Date()) {
    await prisma.session.delete({ where: { hashedToken: hashedSessionToken } });
    return null;
  }

  // Extend session if it is set to expire before earliest renewal date
  if (session.expirationDate < getSessionRenewalDate()) {
    session = await prisma.session.update({
      where: { hashedToken: hashedSessionToken },
      data: { expirationDate: getSessionExpirationDate() },
      include: { user: true },
    });
  }

  return session;
}

export async function createSession(sessionToken: string, userId: string) {
  const hashedSessionToken = hashToken(sessionToken);

  return await prisma.session.create({
    data: {
      userId,
      hashedToken: hashedSessionToken,
      expirationDate: getSessionExpirationDate(),
    },
  });
}

export async function deleteSession(sessionToken: string) {
  await prisma.session.delete({
    where: { hashedToken: hashToken(sessionToken) },
  });
}

import {
  BASE_URL,
  IS_E2E,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL_FROM,
} from "@lib/helpers/backend/env";
import sgMail from "@sendgrid/mail";
import { createToken, hashToken } from "../helpers/backend/tokens";
import { prisma } from "./db";
import { createSession } from "./session";
import { findOrCreateUser } from "./user";

if (process.env.RUNNING_E2E === "true") {
  require("../../mocks/server");
}

function getMagicLinkExpirationDate(): Date {
  return new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
}

export async function sendMagicLink(email: string): Promise<void> {
  const token = createToken();
  const hashedToken = hashToken(token);

  console.log({ token, hashedToken });
  await prisma.verificationEmail.create({
    data: {
      email,
      hashedToken,
      expirationDate: getMagicLinkExpirationDate(),
    },
  });

  const magicLink = `https://${BASE_URL}/magic?token=${encodeURIComponent(
    token
  )}`;

  sgMail.setApiKey(SENDGRID_API_KEY);

  await sgMail.send({
    from: SENDGRID_EMAIL_FROM,
    to: email,
    subject: "Login to Book Bazar",
    html: `<a href="${magicLink}">Click here</a> to login`,
    mailSettings: {
      sandboxMode: { enable: IS_E2E },
    },
  });
}

export interface TokenWithExpiration {
  token: string;
  expirationDate: Date;
}

export async function consumeMagicLink(
  verificationToken: string
): Promise<TokenWithExpiration | null> {
  // Only allow verification email to be used once
  const verificationEmail = await prisma.verificationEmail.delete({
    where: { hashedToken: hashToken(verificationToken) },
  });

  if (!verificationEmail || verificationEmail.expirationDate < new Date()) {
    return null;
  }

  const user = await findOrCreateUser(verificationEmail.email);

  const sessionToken = createToken();
  const session = await createSession(sessionToken, user.id);

  return {
    token: sessionToken,
    expirationDate: session.expirationDate,
  };
}

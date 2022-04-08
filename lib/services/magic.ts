import {
  BASE_URL,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL_FROM,
  SENDGRID_TEMPLATE_ID,
} from "@lib/helpers/backend/env";
import { ALLOW_UNVERIFIED_EXPO_EMAIL, IS_E2E } from "@lib/helpers/env";
import sgMail from "@sendgrid/mail";
import { createToken, hashToken } from "../helpers/backend/tokens";
import { prisma } from "./db";
import { createSession } from "./session";
import { findOrCreateUser } from "./user";

function getMagicLinkExpirationDate(): Date {
  return new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
}

export async function sendMagicLink(
  email: string,
  redirectUrl?: string
): Promise<string | void> {
  const token = createToken();
  const hashedToken = hashToken(token);

  const isNewAccount = !(await prisma.user.findUnique({ where: { email } }));

  await prisma.verificationEmail.create({
    data: {
      email,
      hashedToken,
      expirationDate: getMagicLinkExpirationDate(),
    },
  });

  const searchParams = new URLSearchParams();
  searchParams.set("token", token);
  if (redirectUrl) {
    searchParams.set("redirectUrl", redirectUrl);
  }

  const magicLink = `https://${BASE_URL}/magic?${searchParams.toString()}`;

  // Allow expo users to login to public account without email verification
  if (ALLOW_UNVERIFIED_EXPO_EMAIL && email === "expo@mcmaster.ca") {
    return magicLink;
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  await sgMail.send({
    from: {
      name: "Book Bazar",
      email: SENDGRID_EMAIL_FROM,
    },
    to: email,
    templateId: SENDGRID_TEMPLATE_ID,
    dynamicTemplateData: {
      magicLink,
      newAccount: isNewAccount,
    },
    mailSettings: {
      sandboxMode: {
        enable: IS_E2E,
      },
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
  let verificationEmail = null;
  try {
    verificationEmail = await prisma.verificationEmail.delete({
      where: { hashedToken: hashToken(verificationToken) },
    });
  } catch (error) {
    console.warn(error);
  }

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

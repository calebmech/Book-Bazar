import sgMail from '@sendgrid/mail';
import { createToken, hashToken } from '../helpers/backend/tokens';
import { prisma } from './db';
import { createSession } from './session';
import { findOrCreateUser } from './user';

function getMagicLinkExpirationDate(): Date {
  return new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
}

export async function sendMagicLink(email: string): Promise<void> {
  const token = createToken();
  const hashedToken = hashToken(token);

  await prisma.verificationEmail.create({
    data: {
      email,
      hashedToken,
      expirationDate: getMagicLinkExpirationDate(),
    },
  });

  if (!process.env.BASE_URL) {
    throw new Error('process.env.BASE_URL must be set.');
  }
  const magicLink = 'https://' + process.env.BASE_URL + '/magic?token=' + encodeURIComponent(token);

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    throw new Error('process.env.SENDGRID_API_KEY must be set.');
  }

  if (!process.env.SENDGRID_EMAIL_FROM) {
    throw new Error('process.env.SENDGRID_EMAIL_FROM must be set.');
  }
  await sgMail.send({
    from: process.env.SENDGRID_EMAIL_FROM,
    to: email,
    subject: 'Login to Book Bazar',
    html: `<a href="${magicLink}">Click here</a> to login`,
  });
}

export interface TokenWithExpiration {
  token: string;
  expirationDate: Date;
}

export async function consumeMagicLink(verificationToken: string): Promise<TokenWithExpiration | null> {
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

import crypto from 'crypto';

export function createToken(): string {
  return crypto.randomUUID();
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

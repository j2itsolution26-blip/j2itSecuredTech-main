import { headers } from 'next/headers';

/**
 * Resolves the originating client IP behind Vercel's proxy layer.
 * Only the first hop of `x-forwarded-for` is trusted.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();

  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    if (first?.trim()) return first.trim();
  }

  return headerList.get('x-real-ip') ?? headerList.get('cf-connecting-ip') ?? 'unknown';
}

export async function getUserAgent(): Promise<string> {
  const headerList = await headers();
  return headerList.get('user-agent')?.slice(0, 400) ?? 'unknown';
}

export async function getRequestContext() {
  const [ipAddress, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);
  return { ipAddress, userAgent };
}

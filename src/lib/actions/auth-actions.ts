'use server';

import { AuthError } from 'next-auth';
import { AuditAction } from '@prisma/client';
import { signIn, signOut } from '@/lib/auth';
import { recordAudit } from '@/lib/audit';
import { getRequestContext } from '@/lib/request-context';
import { rateLimit } from '@/lib/security/rate-limit';
import { loginSchema } from '@/lib/validations/auth';
import { failure, fromZodError, type ActionState } from '@/lib/action-result';

/** Five attempts per IP every fifteen minutes blunts credential stuffing. */
const LOGIN_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function authenticate(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) return fromZodError(parsed.error);

  const { ipAddress } = await getRequestContext();
  const limit = rateLimit(`login:${ipAddress}`, LOGIN_LIMIT);

  if (!limit.success) {
    return failure(
      `Too many sign-in attempts. Please wait ${Math.ceil(limit.retryAfterSeconds / 60)} minutes before trying again.`,
    );
  }

  const callbackUrl = (formData.get('callbackUrl') as string) || '/admin';
  // Only same-origin paths are honoured, blocking open-redirect attempts.
  const safeCallbackUrl = callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : '/admin';

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeCallbackUrl,
    });

    // `signIn` throws a redirect on success, so this is effectively unreachable.
    return { status: 'idle' };
  } catch (error) {
    if (error instanceof AuthError) {
      await recordAudit({
        action: AuditAction.LOGIN_FAILED,
        entity: 'User',
        summary: `Failed sign-in attempt for ${parsed.data.email}`,
        actor: { email: parsed.data.email },
      });

      return failure('Invalid email or password.');
    }

    // Redirect signals must bubble up to Next.js untouched.
    throw error;
  }
}

export async function signOutAction() {
  await recordAudit({
    action: AuditAction.LOGOUT,
    entity: 'User',
    summary: 'Administrator signed out',
  });

  await signOut({ redirectTo: '/admin/login' });
}

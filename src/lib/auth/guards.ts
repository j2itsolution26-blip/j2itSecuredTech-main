import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import { UserRole } from '@prisma/client';
import { auth } from '@/lib/auth';
import { AuthorizationError } from '@/lib/errors';

export { AuthorizationError };

/** Role hierarchy — higher number grants everything below it. */
const ROLE_WEIGHT: Record<UserRole, number> = {
  [UserRole.VIEWER]: 1,
  [UserRole.EDITOR]: 2,
  [UserRole.ADMIN]: 3,
};

export function hasRole(role: UserRole | undefined, required: UserRole): boolean {
  if (!role) return false;
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[required];
}

/** Redirects to the sign-in screen when no session is present. */
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return session;
}

/** Redirects when the signed-in user lacks the required role. */
export async function requireRole(required: UserRole): Promise<Session> {
  const session = await requireSession();
  if (!hasRole(session.user.role, required)) redirect('/admin?denied=1');
  return session;
}

/**
 * Server Action guard. Unlike `requireRole` this throws instead of redirecting
 * so the calling action can return a typed error state to the form.
 */
export async function authorizeAction(required: UserRole = UserRole.EDITOR): Promise<Session> {
  const session = await auth();
  if (!session?.user) throw new AuthorizationError('Your session has expired. Please sign in again.');
  if (!hasRole(session.user.role, required)) throw new AuthorizationError();
  return session;
}

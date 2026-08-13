import 'server-only';
import type { Session } from 'next-auth';
import { AuditAction, UserRole } from '@prisma/client';
import { authorizeAction } from '@/lib/auth/guards';
import { recordAudit } from '@/lib/audit';
import { revalidateContent, type CacheTag } from '@/lib/cache';
import { getClientIp } from '@/lib/request-context';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';
import { failure, success, toActionError, type ActionState } from '@/lib/action-result';

type MutationOutcome = {
  message: string;
  entityId?: string | null;
  summary: string;
};

type MutationOptions = {
  entity: string;
  action: AuditAction;
  role?: UserRole;
  tag?: CacheTag;
};

/**
 * Shared pipeline for every admin write: authorise → rate limit → execute →
 * audit → invalidate cache. Keeping it in one place means a new entity cannot
 * accidentally ship without authorisation or an audit trail.
 */
export async function runMutation(
  options: MutationOptions,
  execute: (session: Session) => Promise<MutationOutcome>,
): Promise<ActionState> {
  try {
    const session = await authorizeAction(options.role ?? UserRole.EDITOR);

    const ip = await getClientIp();
    const limit = rateLimit(`admin:${session.user.id}:${ip}`, RATE_LIMITS.adminMutation);
    if (!limit.success) {
      return failure('Too many changes in a short period. Please slow down and retry.');
    }

    const outcome = await execute(session);

    await recordAudit({
      action: options.action,
      entity: options.entity,
      entityId: outcome.entityId ?? null,
      summary: outcome.summary,
    });

    if (options.tag) revalidateContent(options.tag);

    return success(outcome.message);
  } catch (error) {
    return toActionError(error);
  }
}

/** Parses an optional `<input type="date">` value into a Date. */
export function toOptionalDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Normalises optional text fields to `null` rather than empty strings. */
export function toNullable(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

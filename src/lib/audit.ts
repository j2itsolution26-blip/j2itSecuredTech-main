import type { AuditAction, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getRequestContext } from '@/lib/request-context';

type AuditInput = {
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  summary: string;
  metadata?: Prisma.InputJsonValue;
  /** Supplied for unauthenticated events such as failed sign-ins. */
  actor?: { id?: string | null; email?: string | null };
};

/**
 * Writes an immutable audit trail entry.
 *
 * Auditing must never break the operation it is recording, so failures are
 * logged and swallowed rather than propagated to the caller.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    const [session, context] = await Promise.all([
      input.actor ? Promise.resolve(null) : auth(),
      getRequestContext(),
    ]);

    await prisma.auditLog.create({
      data: {
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        summary: input.summary,
        metadata: input.metadata,
        userId: input.actor?.id ?? session?.user?.id ?? null,
        userEmail: input.actor?.email ?? session?.user?.email ?? null,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });
  } catch (error) {
    console.error('[audit] failed to record entry', error);
  }
}

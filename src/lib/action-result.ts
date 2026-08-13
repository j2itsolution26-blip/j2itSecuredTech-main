import { z } from 'zod';
import { AuthorizationError } from '@/lib/errors';

/**
 * Discriminated result returned by every Server Action. Client components
 * consume it through `useActionState`, so it must stay serialisable.
 */
export type ActionState =
  | { status: 'idle' }
  | { status: 'success'; message: string; data?: Record<string, string> }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };

export const IDLE_STATE: ActionState = { status: 'idle' };

export function success(message: string, data?: Record<string, string>): ActionState {
  return { status: 'success', message, data };
}

export function failure(message: string, fieldErrors?: Record<string, string[]>): ActionState {
  return { status: 'error', message, fieldErrors };
}

export function fromZodError(error: z.ZodError): ActionState {
  const flattened = error.flatten();
  return {
    status: 'error',
    message: 'Please correct the highlighted fields and try again.',
    fieldErrors: flattened.fieldErrors as Record<string, string[]>,
  };
}

/** Known Postgres/Prisma failures mapped to messages that are safe to surface. */
export function toActionError(error: unknown): ActionState {
  if (error instanceof z.ZodError) return fromZodError(error);
  if (error instanceof AuthorizationError) return failure(error.message);

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: string }).code;
    if (code === 'P2002') return failure('A record with that unique value already exists.');
    if (code === 'P2025') return failure('That record no longer exists.');
    if (code === 'P2003') return failure('This record is referenced elsewhere and cannot be removed.');
  }

  console.error('[action] unhandled error', error);
  return failure('Something went wrong on our end. Please try again shortly.');
}

/** Reads a form field as a trimmed string. */
export function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/** Reads an HTML checkbox as a boolean. */
export function checkboxField(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === 'on' || value === 'true';
}

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';
import { authenticate } from '@/lib/actions/auth-actions';
import { IDLE_STATE } from '@/lib/action-result';
import { Button } from '@/components/ui/button';
import { FieldError, Input, Label } from '@/components/ui/input';
import { Alert } from '@/components/ui/feedback';

export function LoginForm() {
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl') ?? '/admin';

  // Only relative, single-slash paths are forwarded; the action re-checks this.
  const callbackUrl =
    rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/admin';

  const [state, formAction, isPending] = React.useActionState(authenticate, IDLE_STATE);
  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === 'error' && !fieldErrors ? (
        <Alert tone="error">{state.message}</Alert>
      ) : null}

      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" required>
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          aria-invalid={Boolean(fieldErrors?.email)}
        />
        <FieldError messages={fieldErrors?.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(fieldErrors?.password)}
        />
        <FieldError messages={fieldErrors?.password} />
      </div>

      <Button type="submit" size="lg" block disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="size-4" aria-hidden="true" />
            Sign in
          </>
        )}
      </Button>

      <p className="text-center text-xs text-subtle">
        Sessions expire after 8 hours of inactivity.
      </p>
    </form>
  );
}

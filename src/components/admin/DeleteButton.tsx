'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { IDLE_STATE, type ActionState } from '@/lib/action-result';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert } from '@/components/ui/feedback';

/**
 * Destructive action guarded by an explicit confirmation dialog.
 * The record name is shown so the operator can verify what they are removing.
 */
export function DeleteButton({
  id,
  label,
  action,
  entityLabel = 'record',
  redirectTo,
  size = 'sm',
}: {
  id: string;
  label: string;
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
  entityLabel?: string;
  redirectTo?: string;
  size?: 'sm' | 'md' | 'icon';
}) {
  const [requestedOpen, setRequestedOpen] = React.useState(false);
  const [state, formAction, isPending] = React.useActionState(action, IDLE_STATE);
  const router = useRouter();

  // Derived rather than stored: a successful delete always closes the dialog,
  // so there is no state to synchronise from the effect below.
  const open = requestedOpen && state.status !== 'success';

  React.useEffect(() => {
    if (state.status !== 'success') return;
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }, [state, redirectTo, router]);

  return (
    <Dialog open={open} onOpenChange={setRequestedOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={size} className="text-muted hover:text-danger">
          <Trash2 className="size-4" aria-hidden="true" />
          {size === 'icon' ? <span className="sr-only">Delete {label}</span> : 'Delete'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this {entityLabel}?</DialogTitle>
          <DialogDescription>
            “{label}” will be permanently removed. This cannot be undone, and the action is written to
            the audit log.
          </DialogDescription>
        </DialogHeader>

        {state.status === 'error' ? <Alert tone="error">{state.message}</Alert> : null}

        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="danger" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import * as React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActionState } from '@/lib/action-result';

const TONES = {
  success: { icon: CheckCircle2, className: 'border-success/30 bg-success/10 text-success' },
  error: { icon: XCircle, className: 'border-danger/30 bg-danger/10 text-danger' },
  warning: { icon: AlertTriangle, className: 'border-warning/30 bg-warning/10 text-warning' },
  info: { icon: Info, className: 'border-info/30 bg-info/10 text-info' },
} as const;

export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: keyof typeof TONES;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: toneClass } = TONES[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-sm', toneClass, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-current/90">{children}</div> : null}
      </div>
    </div>
  );
}

/** Renders the outcome of a Server Action in a consistent, accessible way. */
export function ActionFeedback({ state, className }: { state: ActionState; className?: string }) {
  if (state.status === 'idle') return null;

  return (
    <Alert tone={state.status === 'success' ? 'success' : 'error'} className={className}>
      {state.message}
      {state.status === 'success' && state.data?.reference ? (
        <span className="mt-1 block font-mono text-xs">
          Reference: <strong>{state.data.reference}</strong>
        </span>
      ) : null}
    </Alert>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/5', className)}
      aria-hidden="true"
    />
  );
}

export function EmptyState({
  icon: Icon = Info,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="rounded-xl bg-white/5 p-3 text-muted">
        <Icon className="size-6" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      {description ? <p className="max-w-md text-sm text-muted">{description}</p> : null}
      {action}
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { IDLE_STATE, type ActionState } from '@/lib/action-result';
import { Button } from '@/components/ui/button';
import { ActionFeedback } from '@/components/ui/feedback';
import { Checkbox, FieldError, FieldHint, Input, Label, Select, Textarea } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FieldErrors = Record<string, string[]> | undefined;

const FieldErrorContext = React.createContext<FieldErrors>(undefined);

function useFieldError(name: string): string[] | undefined {
  return React.useContext(FieldErrorContext)?.[name];
}

/**
 * Admin form shell.
 *
 * Uses `useActionState` so the form still submits without client JavaScript,
 * and distributes server-side field errors to the matching inputs through
 * context rather than prop drilling.
 */
export function AdminForm({
  action,
  children,
  submitLabel = 'Save changes',
  redirectOnSuccess,
  footer,
}: {
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  redirectOnSuccess?: string;
  footer?: React.ReactNode;
}) {
  const [state, formAction, isPending] = React.useActionState(action, IDLE_STATE);
  const router = useRouter();

  React.useEffect(() => {
    if (state.status !== 'success' || !redirectOnSuccess) return;
    router.push(redirectOnSuccess);
    router.refresh();
  }, [state, redirectOnSuccess, router]);

  return (
    <FieldErrorContext.Provider value={state.status === 'error' ? state.fieldErrors : undefined}>
      <form action={formAction} className="flex flex-col gap-6">
        <ActionFeedback state={state} />

        {children}

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                {submitLabel}
              </>
            )}
          </Button>
          {footer}
        </div>
      </form>
    </FieldErrorContext.Provider>
  );
}

/** Groups related fields with a heading, matching the admin layout rhythm. */
export function FormSection({
  title,
  description,
  children,
  columns = 1,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-6">
      <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}

      <div className={cn('mt-6 grid gap-5', columns === 2 && 'sm:grid-cols-2')}>{children}</div>
    </section>
  );
}

type BaseFieldProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

function FieldFrame({
  name,
  label,
  hint,
  required,
  className,
  children,
}: BaseFieldProps & { children: React.ReactNode }) {
  const errors = useFieldError(name);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      {children}
      {hint ? <FieldHint>{hint}</FieldHint> : null}
      <FieldError messages={errors} />
    </div>
  );
}

export function TextField({
  type = 'text',
  defaultValue,
  placeholder,
  ...frame
}: BaseFieldProps & { type?: string; defaultValue?: string | number | null; placeholder?: string }) {
  const errors = useFieldError(frame.name);

  return (
    <FieldFrame {...frame}>
      <Input
        id={frame.name}
        name={frame.name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        aria-invalid={Boolean(errors)}
      />
    </FieldFrame>
  );
}

export function TextareaField({
  defaultValue,
  rows = 5,
  placeholder,
  ...frame
}: BaseFieldProps & { defaultValue?: string | null; rows?: number; placeholder?: string }) {
  const errors = useFieldError(frame.name);

  return (
    <FieldFrame {...frame}>
      <Textarea
        id={frame.name}
        name={frame.name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        aria-invalid={Boolean(errors)}
      />
    </FieldFrame>
  );
}

/** Multi-value input: one entry per line, stored as a Postgres text[]. */
export function ListField({
  defaultValue = [],
  rows = 5,
  ...frame
}: BaseFieldProps & { defaultValue?: string[]; rows?: number }) {
  return (
    <TextareaField
      {...frame}
      rows={rows}
      defaultValue={defaultValue.join('\n')}
      hint={frame.hint ?? 'One entry per line.'}
    />
  );
}

export function SelectField({
  options,
  defaultValue,
  placeholder,
  ...frame
}: BaseFieldProps & {
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const errors = useFieldError(frame.name);

  return (
    <FieldFrame {...frame}>
      <Select
        id={frame.name}
        name={frame.name}
        defaultValue={defaultValue ?? ''}
        aria-invalid={Boolean(errors)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FieldFrame>
  );
}

export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-4">
      <Checkbox id={name} name={name} defaultChecked={defaultChecked} />
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={name} className="font-normal">
          {label}
        </Label>
        {hint ? <FieldHint>{hint}</FieldHint> : null}
      </div>
    </div>
  );
}

/** Renders the record id so update actions can target the right row. */
export function HiddenId({ value }: { value?: string }) {
  if (!value) return null;
  return <input type="hidden" name="id" value={value} />;
}

import * as React from 'react';
import { cn } from '@/lib/utils';

const fieldStyles =
  'w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-secondary/60 focus:bg-surface disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger/70';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldStyles, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 5, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cn(fieldStyles, 'resize-y', className)} {...props} />
));
Textarea.displayName = 'Textarea';

/**
 * Native select styled to match the field system. A native control keeps the
 * form usable without JavaScript and is the most accessible default on mobile.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(fieldStyles, 'select-chevron', className)} {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-medium text-slate-200', className)}
    {...props}
  >
    {children}
    {required ? (
      <span className="ml-1 text-danger" aria-hidden="true">
        *
      </span>
    ) : null}
  </label>
));
Label.displayName = 'Label';

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="text-xs font-medium text-danger" role="alert">
      {messages[0]}
    </p>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-subtle">{children}</p>;
}

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border bg-surface text-primary accent-[#0057FF]',
      className,
    )}
    {...props}
  />
));
Checkbox.displayName = 'Checkbox';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** Wrapper keeps wide tables scrollable instead of breaking the page layout. */
export function TableWrapper({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-border bg-card/60', className)}>
      {children}
    </div>
  );
}

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn('w-full min-w-[720px] text-left text-sm', className)} {...props} />
  ),
);
Table.displayName = 'Table';

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-subtle', className)}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('divide-y divide-border/70', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('transition-colors hover:bg-white/[0.03]', className)} {...props} />
));
TableRow.displayName = 'TableRow';

export const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} scope="col" className={cn('px-4 py-3 font-semibold', className)} {...props} />
));
TableHeaderCell.displayName = 'TableHeaderCell';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 align-middle text-slate-300', className)} {...props} />
));
TableCell.displayName = 'TableCell';

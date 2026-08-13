import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-secondary/35 hover:brightness-110',
        secondary:
          'bg-card text-foreground border border-border hover:border-secondary/40 hover:bg-elevated',
        outline:
          'border border-white/15 bg-white/5 text-foreground backdrop-blur hover:bg-white/10 hover:border-secondary/40',
        ghost: 'text-muted hover:bg-white/5 hover:text-foreground',
        danger: 'bg-danger/90 text-white hover:bg-danger shadow-lg shadow-danger/20',
        success: 'bg-success/90 text-white hover:bg-success shadow-lg shadow-success/20',
        link: 'text-secondary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-base',
        icon: 'h-10 w-10',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders the child element instead of a `<button>` — used for links. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, block }), className)}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/shared/Reveal';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  titleClassName,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
  titleClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-3xl text-center items-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{eyebrow}</span>
      ) : null}

      <Tag
        className={cn(
          'font-heading font-bold text-foreground text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]',
          titleClassName,
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p className="text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}

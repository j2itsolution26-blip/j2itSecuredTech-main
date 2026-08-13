import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '@prisma/client';
import { cn, initialsOf } from '@/lib/utils';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card-hover flex h-full flex-col rounded-2xl border border-border bg-card/70 p-7">
      <Quote className="size-8 text-primary/45" aria-hidden="true" />

      <div className="mt-4 flex items-center gap-0.5" aria-label={`Rated ${testimonial.rating} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'size-4',
              index < testimonial.rating ? 'fill-warning text-warning' : 'text-border',
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-slate-300">
        “{testimonial.content}”
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
        {testimonial.image ? (
          <Image
            src={testimonial.image}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
            {initialsOf(testimonial.name)}
          </span>
        )}

        <span className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{testimonial.name}</span>
          <span className="text-xs text-muted">
            {testimonial.role}, {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

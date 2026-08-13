'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP-driven number counter that runs once when scrolled into view.
 * Falls back to the final value immediately for reduced-motion visitors.
 */
export function Counter({
  value,
  suffix = '',
  decimals = 0,
  className,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const elementRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const format = (input: number) =>
      `${input.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (prefersReducedMotion) {
      element.textContent = format(value);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const counter = { current: 0 };
    const context = gsap.context(() => {
      gsap.to(counter, {
        current: value,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        onUpdate: () => {
          element.textContent = format(counter.current);
        },
      });
    }, element);

    return () => context.revert();
  }, [value, suffix, decimals]);

  return (
    <span ref={elementRef} className={className}>
      {`0${suffix}`}
    </span>
  );
}

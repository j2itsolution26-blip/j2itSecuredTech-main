'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Headset, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/constants';

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'Security by default',
    description: 'Hardened networks, encrypted transport and full audit trails',
  },
  {
    icon: Zap,
    title: 'Delivered on schedule',
    description: 'Fixed milestones with staging access from week one',
  },
  {
    icon: Headset,
    title: '24/7 managed support',
    description: 'Four-hour response under every maintenance contract',
  },
];

export function HeroSection() {
  const containerRef = React.useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Slow parallax drift on the background orbs — purely decorative.
  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.to('[data-orb="primary"]', {
        y: 60,
        x: -40,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('[data-orb="secondary"]', {
        y: -50,
        x: 30,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-grid-pattern pb-24 pt-20"
    >
      <div data-orb="primary" className="gradient-glow left-1/2 top-1/4 h-[620px] w-[620px] -translate-x-1/2 bg-primary/45" />
      <div data-orb="secondary" className="gradient-glow right-4 top-1/3 h-[420px] w-[420px] bg-secondary/30" />
      <div className="gradient-glow bottom-8 left-4 h-[340px] w-[340px] bg-accent/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card mb-8 inline-flex items-center gap-2 rounded-full border-secondary/25 px-4 py-2 text-xs font-semibold text-secondary"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Enterprise IT solutions, infrastructure and managed support
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto max-w-5xl font-heading text-4xl font-bold leading-[1.08] text-white sm:text-6xl lg:text-7xl"
        >
          Enterprise Technology Solutions for{' '}
          <span className="gradient-text">Modern Businesses</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-300"
        >
          {COMPANY_INFO.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/request-quote">
              Request Quote
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/services">
              Explore Services
              <Zap className="size-4 text-secondary" aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mx-auto mt-16 grid max-w-4xl gap-4 border-t border-white/10 pt-10 text-left sm:grid-cols-3"
        >
          {HIGHLIGHTS.map(({ icon: HighlightIcon, title, description }) => (
            <li key={title} className="glass-card flex items-start gap-3 rounded-xl p-4">
              <span className="rounded-lg bg-primary/20 p-2.5 text-secondary">
                <HighlightIcon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="font-heading text-sm font-semibold text-white">{title}</span>
                <span className="mt-0.5 text-xs text-muted">{description}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

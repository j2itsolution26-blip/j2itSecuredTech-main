import Link from 'next/link';
import { ArrowLeft, Compass, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

const SUGGESTIONS = [
  { label: 'Services', href: '/services', description: 'Software, security, networking and cloud' },
  { label: 'Portfolio', href: '/portfolio', description: 'Case studies from live deployments' },
  { label: 'Blog', href: '/blog', description: 'Engineering insights and guidance' },
  { label: 'Contact', href: '/contact', description: 'Talk to our solutions team' },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid-pattern px-4 py-24">
      <div className="gradient-glow left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 bg-primary/35" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-heading text-[7rem] font-bold leading-none text-white/10 sm:text-[10rem]">404</p>

        <h1 className="-mt-8 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          We could not find that page
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          The link may be outdated, or the page may have been moved. Everything below is still exactly
          where you would expect it.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <Mail className="size-4" aria-hidden="true" />
              Report a broken link
            </Link>
          </Button>
        </div>

        <nav aria-label="Suggested pages" className="mt-14">
          <h2 className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
            <Compass className="size-3.5" aria-hidden="true" />
            Popular destinations
          </h2>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="card-hover flex flex-col rounded-xl border border-border bg-card/60 p-4 text-left"
                >
                  <span className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                    <ArrowLeft className="size-3.5 rotate-180 text-secondary" aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="mt-1 text-xs text-muted">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-12 text-xs text-subtle">
          Need immediate assistance? Call {COMPANY_INFO.phone}
        </p>
      </div>
    </main>
  );
}

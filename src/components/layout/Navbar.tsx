'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Phone, Shield, X } from 'lucide-react';
import { NAV_LINKS, COMPANY_INFO } from '@/lib/constants';
import { cn, telHref } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/ui/button';

/** Scroll position is external state, so it is read through a store subscription. */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

export function Navbar({ phone = COMPANY_INFO.phone }: { phone?: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const pathname = usePathname();

  const scrolled = React.useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 16,
    () => false, // server snapshot — the header starts transparent
  );

  /** Menus must not stay open across a navigation. */
  const closeMenus = React.useCallback(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, []);

  // Prevent background scrolling while the mobile drawer is open.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileOpen(false);
      setOpenDropdown(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass-nav py-2.5 shadow-elevated' : 'border-b border-transparent bg-transparent py-4',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${COMPANY_INFO.name} home`}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-glow transition-transform group-hover:scale-105">
            <Shield className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              J2 <span className="text-secondary">SecureTech</span>
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-subtle">
              {COMPANY_INFO.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  aria-expanded={openDropdown === link.label}
                  aria-haspopup="true"
                  onFocus={() => setOpenDropdown(link.label)}
                  onClick={closeMenus}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-white/5 text-secondary'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  )}
                >
                  {link.label}
                  <ChevronDown
                    className={cn('size-4 opacity-70 transition-transform', openDropdown === link.label && 'rotate-180')}
                    aria-hidden="true"
                  />
                </Link>

                <AnimatePresence>
                  {openDropdown === link.label ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full w-[38rem] pt-3"
                    >
                      <div className="glass-card grid grid-cols-2 gap-1 rounded-2xl p-2 shadow-elevated">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeMenus}
                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/10"
                          >
                            <span className="mt-0.5 rounded-lg bg-primary/15 p-2 text-secondary">
                              <Icon name={child.icon} className="size-4" />
                            </span>
                            <span className="flex flex-col">
                              <span className="text-sm font-semibold text-white">{child.label}</span>
                              <span className="text-xs text-muted">{child.description}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={closeMenus}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-white/5 text-secondary'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                )}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={telHref(phone)}
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-white"
          >
            <Phone className="size-3.5 text-secondary" aria-hidden="true" />
            {phone}
          </a>

          <Button asChild size="sm" className="h-10 px-5">
            <Link href="/request-quote">
              Request Quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto border-t border-white/10 bg-background/97 px-4 py-6 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="border-b border-white/5 py-1">
                  <Link
                    href={link.href}
                    onClick={closeMenus}
                    className={cn(
                      'block rounded-lg px-2 py-3 text-base font-medium transition-colors',
                      isActive(link.href) ? 'text-secondary' : 'text-slate-200 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>

                  {link.children ? (
                    <div className="mb-2 flex flex-col gap-1 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:text-white"
                        >
                          <Icon name={child.icon} className="size-4 text-secondary" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <Button asChild block size="lg">
                <Link href="/request-quote" onClick={closeMenus}>
                  Request Quote
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" block size="lg">
                <a href={telHref(phone)}>
                  <Phone className="size-4" aria-hidden="true" />
                  {phone}
                </a>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@prisma/client';
import { ExternalLink, LogOut, Menu, Shield, X } from 'lucide-react';
import { ADMIN_NAV } from '@/components/admin/admin-nav';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/lib/actions/auth-actions';
import { cn, humanizeEnum, initialsOf } from '@/lib/utils';

type AdminUser = { name: string; email: string; role: UserRole };

const ROLE_WEIGHT: Record<UserRole, number> = { VIEWER: 1, EDITOR: 2, ADMIN: 3 };

/**
 * Admin chrome: fixed sidebar on desktop, slide-over drawer on mobile.
 * Navigation is filtered by role, mirroring the server-side action guards.
 */
export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const pathname = usePathname();

  const groups = ADMIN_NAV.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.role || ROLE_WEIGHT[user.role] >= ROLE_WEIGHT[item.role],
    ),
  })).filter((group) => group.items.length > 0);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const navigation = (
    <nav className="flex flex-1 flex-col gap-7 overflow-y-auto px-3 py-6" aria-label="Admin sections">
      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
            {group.title}
          </h2>
          <ul className="mt-2.5 flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href, item.exact)
                      ? 'bg-primary/15 text-secondary'
                      : 'text-muted hover:bg-white/5 hover:text-foreground',
                  )}
                >
                  <AdminIcon name={item.icon} className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  const sidebarFooter = (
    <div className="border-t border-border p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
          {initialsOf(user.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs text-subtle">{humanizeEnum(user.role)}</p>
        </div>
      </div>

      <form action={signOutAction} className="mt-3">
        <Button type="submit" variant="secondary" size="sm" block>
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface/60 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 border-b border-border px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white">
            <Shield className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-sm font-bold text-white">J2 SecureTech</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-subtle">Console</span>
          </span>
        </Link>

        {navigation}
        {sidebarFooter}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-heading text-sm font-bold text-white">J2 SecureTech</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-white/5 hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>
            {navigation}
            {sidebarFooter}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noopener noreferrer">
                View site
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Shield } from 'lucide-react';
import { LoginForm } from '@/components/admin/LoginForm';
import { Skeleton } from '@/components/ui/feedback';
import { COMPANY_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Administrator Sign In',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid-pattern px-4 py-16">
      <div className="gradient-glow left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 bg-primary/35" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-glow">
            <Shield className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">
            {COMPANY_INFO.name} Console
          </h1>
          <p className="mt-2 text-sm text-muted">
            Authorised personnel only. Access attempts are logged.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-7 backdrop-blur">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-secondary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Return to the website
          </Link>
        </p>
      </div>
    </main>
  );
}

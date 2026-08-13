import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireSession } from '@/lib/auth/guards';

export const metadata: Metadata = {
  title: 'Admin Console',
  robots: { index: false, follow: false },
};

/** Admin pages must always reflect current data, never a cached render. */
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already blocks anonymous access; this is the authoritative
  // server-side check and supplies the session to the shell.
  const session = await requireSession();

  return (
    <AdminShell
      user={{
        name: session.user.name ?? session.user.email ?? 'Administrator',
        email: session.user.email ?? '',
        role: session.user.role,
      }}
    >
      {children}
    </AdminShell>
  );
}

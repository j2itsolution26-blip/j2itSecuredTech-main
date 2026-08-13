import { notFound } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UserForm } from '@/components/admin/forms/SimpleForms';
import { getUserById } from '@/lib/data/admin';
import { requireRole } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function UserEditorPage({ params }: PageProps) {
  await requireRole(UserRole.ADMIN);

  const { id } = await params;
  const isNew = id === 'new';

  const user = isNew ? null : await getUserById(id);
  if (!isNew && !user) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'New user' : `Edit: ${user?.name}`}
        description="Passwords are hashed with bcrypt and are never displayed or recoverable."
        breadcrumbs={[{ name: 'Users', href: '/admin/users' }, { name: isNew ? 'New' : 'Edit' }]}
      />

      <UserForm user={user} />
    </div>
  );
}

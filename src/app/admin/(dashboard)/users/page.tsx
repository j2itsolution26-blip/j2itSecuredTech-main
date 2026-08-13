import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { Plus, SquarePen } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActiveBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/feedback';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from '@/components/ui/table';
import { listUsers } from '@/lib/data/admin';
import { deleteUser } from '@/lib/actions/admin-actions';
import { requireRole } from '@/lib/auth/guards';
import { formatDate, formatRelativeTime, humanizeEnum } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const ROLE_TONE = {
  [UserRole.ADMIN]: 'primary',
  [UserRole.EDITOR]: 'info',
  [UserRole.VIEWER]: 'outline',
} as const;

export default async function AdminUsersPage() {
  const session = await requireRole(UserRole.ADMIN);
  const users = await listUsers();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Users"
        description="Console accounts and their permission levels."
        breadcrumbs={[{ name: 'Users' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/users/new">
              <Plus className="size-4" aria-hidden="true" />
              New user
            </Link>
          </Button>
        }
      />

      <Alert tone="info" title="Role permissions">
        Viewers have read-only access, editors manage content, and administrators additionally manage
        users, settings, SEO and deletions.
      </Alert>

      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Last sign-in</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => {
              const isSelf = user.id === session.user.id;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {user.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">{user.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_TONE[user.role]}>{humanizeEnum(user.role)}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-subtle">
                    {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : 'Never'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-subtle">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <ActiveBadge active={user.isActive} />
                      {isSelf ? <Badge variant="brand">You</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/users/${user.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      {isSelf ? null : (
                        <DeleteButton
                          id={user.id}
                          label={`${user.name} (${user.email})`}
                          entityLabel="user account"
                          action={deleteUser}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableWrapper>
    </div>
  );
}

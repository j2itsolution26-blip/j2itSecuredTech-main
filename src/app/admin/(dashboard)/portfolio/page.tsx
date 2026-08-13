import Link from 'next/link';
import { Plus, SquarePen } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActiveBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/feedback';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from '@/components/ui/table';
import { listProjectsForAdmin } from '@/lib/data/portfolio';
import { deleteProject } from '@/lib/actions/content-actions';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  const projects = await listProjectsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Portfolio"
        description="Case studies published on the public portfolio."
        breadcrumbs={[{ name: 'Portfolio' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/portfolio/new">
              <Plus className="size-4" aria-hidden="true" />
              New project
            </Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Publish your first case study to populate the portfolio."
          action={
            <Button asChild>
              <Link href="/admin/portfolio/new">Create a project</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Project</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Completed</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      href={`/admin/portfolio/${project.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {project.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">/portfolio/{project.slug}</p>
                  </TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.category}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-subtle">
                    {formatDate(project.completedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <ActiveBadge active={project.isActive} />
                      {project.isFeatured ? <Badge variant="brand">Featured</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/portfolio/${project.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        id={project.id}
                        label={project.title}
                        entityLabel="project"
                        action={deleteProject}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}

import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PortfolioForm } from '@/components/admin/forms/PortfolioForm';
import { getProjectById } from '@/lib/data/portfolio';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function PortfolioEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const project = isNew ? null : await getProjectById(id);
  if (!isNew && !project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'New project' : `Edit: ${project?.title}`}
        description="Case studies appear on the portfolio index and generate their own detail page."
        breadcrumbs={[
          { name: 'Portfolio', href: '/admin/portfolio' },
          { name: isNew ? 'New' : 'Edit' },
        ]}
      />

      <PortfolioForm project={project} />
    </div>
  );
}

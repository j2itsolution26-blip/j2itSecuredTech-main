import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { BlogPostForm } from '@/components/admin/forms/BlogPostForm';
import { getPostById } from '@/lib/data/blog';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function BlogEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const post = isNew ? null : await getPostById(id);
  if (!isNew && !post) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'New article' : `Edit: ${post?.title}`}
        description="Reading time is calculated automatically and content is sanitised on save."
        breadcrumbs={[{ name: 'Blog', href: '/admin/blog' }, { name: isNew ? 'New' : 'Edit' }]}
      />

      <BlogPostForm post={post} />
    </div>
  );
}

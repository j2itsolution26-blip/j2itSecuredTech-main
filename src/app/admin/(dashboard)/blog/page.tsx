import Link from 'next/link';
import { Eye, Plus, SquarePen } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PublishedBadge } from '@/components/admin/StatusBadge';
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
import { listPostsForAdmin } from '@/lib/data/blog';
import { deletePost } from '@/lib/actions/content-actions';
import { formatDate, formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await listPostsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Blog"
        description="Articles published to the public insights section."
        breadcrumbs={[{ name: 'Blog' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/blog/new">
              <Plus className="size-4" aria-hidden="true" />
              New article
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          title="No articles yet"
          description="Write your first article to start building organic search traffic."
          action={
            <Button asChild>
              <Link href="/admin/blog/new">Write an article</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Article</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Published</TableHeaderCell>
                <TableHeaderCell>Views</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">
                      {post.authorName} · {post.readingTime} min read
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-subtle">
                    {formatDate(post.publishedAt)}
                  </TableCell>
                  <TableCell className="text-subtle">{formatNumber(post.views)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <PublishedBadge published={post.isPublished} />
                      {post.isFeatured ? <Badge variant="brand">Featured</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {post.isPublished ? (
                        <Button asChild variant="ghost" size="sm">
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="size-4" aria-hidden="true" />
                            <span className="sr-only">Preview {post.title}</span>
                          </a>
                        </Button>
                      ) : null}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/blog/${post.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        id={post.id}
                        label={post.title}
                        entityLabel="article"
                        action={deletePost}
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

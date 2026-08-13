import Link from 'next/link';
import { Search } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { PostCard } from '@/components/cards/PostCard';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getBlogTaxonomy, getPublishedPosts } from '@/lib/data/blog';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { cn, firstParam, parsePage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Insights & Technology Blog',
  description:
    'Practical guidance on enterprise software, network infrastructure, CCTV and biometric security, cloud migration and IT procurement from the J2 SecureTech engineering team.',
  path: '/blog',
});

type PageProps = {
  searchParams: Promise<{
    page?: string | string[];
    category?: string | string[];
    tag?: string | string[];
    search?: string | string[];
  }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const category = firstParam(params.category);
  const tag = firstParam(params.tag);
  const search = firstParam(params.search);

  const [{ posts, page: currentPage, totalPages, total }, taxonomy] = await Promise.all([
    getPublishedPosts({ page, category, tag, search }),
    getBlogTaxonomy(),
  ]);

  const isFiltered = Boolean(category || tag || search);
  const chipClass = 'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors';

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Blog', path: '/blog' }])} />

      <PageHero
        eyebrow="Insights"
        title="Field notes on infrastructure, software and security"
        description="Written by the engineers who specify, install and support these systems — not by a marketing department."
        breadcrumbs={[{ name: 'Blog', path: '/blog' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            {isFiltered ? (
              <p className="mb-8 text-sm text-muted">
                {total} {total === 1 ? 'article' : 'articles'}
                {search ? ` matching “${search}”` : ''}
                {category ? ` in ${category}` : ''}
                {tag ? ` tagged ${tag}` : ''}.{' '}
                <Link href="/blog" className="text-secondary hover:underline">
                  Clear filters
                </Link>
              </p>
            ) : null}

            {posts.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No articles found"
                description={
                  isFiltered
                    ? 'Try a different search term or browse all published articles.'
                    : 'Our first articles are being prepared and will appear here shortly.'
                }
                action={
                  isFiltered ? (
                    <Button asChild variant="outline">
                      <Link href="/blog">View all articles</Link>
                    </Button>
                  ) : null
                }
              />
            ) : (
              <StaggerGroup className="grid gap-6 sm:grid-cols-2">
                {posts.map((post, index) => (
                  <StaggerItem key={post.id} className="h-full">
                    <PostCard post={post} priority={index < 2} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              basePath="/blog"
              searchParams={{ category, tag, search }}
            />
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <section aria-labelledby="search-heading">
              <h2 id="search-heading" className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                Search
              </h2>
              {/* A plain GET form keeps search working without client JavaScript. */}
              <form action="/blog" method="get" className="mt-4 flex flex-col gap-2" role="search">
                <label htmlFor="blog-search" className="sr-only">
                  Search articles
                </label>
                <Input
                  id="blog-search"
                  name="search"
                  type="search"
                  defaultValue={search ?? ''}
                  placeholder="Search articles…"
                />
                <Button type="submit" variant="secondary" size="sm">
                  <Search className="size-4" aria-hidden="true" />
                  Search
                </Button>
              </form>
            </section>

            {taxonomy.categories.length > 0 ? (
              <section aria-labelledby="categories-heading">
                <h2
                  id="categories-heading"
                  className="font-heading text-sm font-semibold uppercase tracking-wider text-white"
                >
                  Categories
                </h2>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {taxonomy.categories.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={`/blog?category=${encodeURIComponent(item.name)}`}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                          category === item.name
                            ? 'bg-primary/15 text-secondary'
                            : 'text-muted hover:bg-white/5 hover:text-foreground',
                        )}
                      >
                        {item.name}
                        <span className="text-xs text-subtle">{item.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {taxonomy.tags.length > 0 ? (
              <section aria-labelledby="tags-heading">
                <h2 id="tags-heading" className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                  Tags
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {taxonomy.tags.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={`/blog?tag=${encodeURIComponent(item.name)}`}
                        className={cn(
                          chipClass,
                          tag === item.name
                            ? 'border-secondary/50 bg-primary/15 text-secondary'
                            : 'border-border text-muted hover:border-secondary/40 hover:text-foreground',
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}

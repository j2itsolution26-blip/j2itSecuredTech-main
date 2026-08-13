import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { CalendarDays, Clock, User } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { PostCard } from '@/components/cards/PostCard';
import { CallToAction } from '@/components/sections/CallToAction';
import { Badge } from '@/components/ui/badge';
import { getPostBySlug, getRelatedPosts, incrementPostViews } from '@/lib/data/blog';
import { getSettings } from '@/lib/data/settings';
import { articleSchema, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { sanitizeHtml } from '@/lib/security/sanitize';
import { formatDate, toIsoString, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: 'Article not found',
      description: 'The requested article could not be found.',
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDesc || truncate(post.excerpt, 155),
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.authorName],
    keywords: post.tags.length ? post.tags : undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [related, settings] = await Promise.all([
    getRelatedPosts(post.category, post.slug, 3),
    getSettings(),
  ]);

  // Counted after the response is streamed so it never delays rendering.
  after(() => incrementPostViews(post.id));

  const breadcrumbs = [
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            image: post.featuredImage,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            author: post.authorName,
          }),
        ]}
      />

      <PageHero eyebrow={post.category} title={post.title} description={post.excerpt} breadcrumbs={breadcrumbs}>
        <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <User className="size-4 text-secondary" aria-hidden="true" />
            {post.authorName}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-secondary" aria-hidden="true" />
            <time dateTime={toIsoString(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-secondary" aria-hidden="true" />
            {post.readingTime} min read
          </span>
        </div>
      </PageHero>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {post.featuredImage ? (
          <Reveal className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </Reveal>
        ) : null}

        {/* Content is sanitised on write and again here as defence in depth. */}
        <div className="prose-article" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />

        {post.tags.length > 0 ? (
          <footer className="mt-14 border-t border-border pt-8">
            <h2 className="text-xs uppercase tracking-wider text-subtle">Tagged</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant="outline" className="hover:border-secondary/40 hover:text-secondary">
                      #{tag}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" aria-labelledby="related-posts">
          <h2 id="related-posts" className="font-heading text-2xl font-bold text-foreground">
            Related reading
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}

      <CallToAction
        title="Need this implemented, not just explained?"
        description="Our engineers can scope the same approach against your environment and return a fixed proposal."
        phone={settings['contact.phone']}
      />
    </>
  );
}

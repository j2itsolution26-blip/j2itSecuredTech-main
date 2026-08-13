import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/lib/cache';

export const POSTS_PER_PAGE = 9;

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  category: true,
  tags: true,
  readingTime: true,
  publishedAt: true,
  authorName: true,
} satisfies Prisma.BlogPostSelect;

export type BlogCard = Prisma.BlogPostGetPayload<{ select: typeof cardSelect }>;

export type BlogQuery = {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
};

function buildWhere({ category, tag, search }: BlogQuery): Prisma.BlogPostWhereInput {
  return {
    isPublished: true,
    publishedAt: { lte: new Date() },
    ...(category ? { category } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { excerpt: { contains: search, mode: 'insensitive' as const } },
            { content: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
}

/**
 * Search results are request-specific and low value to cache, so only the
 * unfiltered listing goes through the cache layer.
 */
export async function getPublishedPosts(query: BlogQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const where = buildWhere(query);

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      select: cardSelect,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
  };
}

export const getLatestPosts = unstable_cache(
  async (limit = 3): Promise<BlogCard[]> =>
    prisma.blogPost.findMany({
      where: { isPublished: true, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: cardSelect,
    }),
  ['blog:latest'],
  { tags: [CACHE_TAGS.blog], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getPostBySlug = unstable_cache(
  async (slug: string) =>
    prisma.blogPost.findFirst({
      where: { slug, isPublished: true, publishedAt: { lte: new Date() } },
    }),
  ['blog:by-slug'],
  { tags: [CACHE_TAGS.blog], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getRelatedPosts = unstable_cache(
  async (category: string, excludeSlug: string, limit = 3): Promise<BlogCard[]> =>
    prisma.blogPost.findMany({
      where: {
        isPublished: true,
        publishedAt: { lte: new Date() },
        category,
        slug: { not: excludeSlug },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: cardSelect,
    }),
  ['blog:related'],
  { tags: [CACHE_TAGS.blog], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getBlogTaxonomy = unstable_cache(
  async () => {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { category: true, tags: true },
    });

    const categories = new Map<string, number>();
    const tags = new Map<string, number>();

    for (const post of posts) {
      categories.set(post.category, (categories.get(post.category) ?? 0) + 1);
      for (const tag of post.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }

    const sortByCount = (entries: Map<string, number>) =>
      [...entries.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { categories: sortByCount(categories), tags: sortByCount(tags).slice(0, 20) };
  },
  ['blog:taxonomy'],
  { tags: [CACHE_TAGS.blog], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getPostSlugs = unstable_cache(
  async () =>
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ['blog:slugs'],
  { tags: [CACHE_TAGS.blog], revalidate: CONTENT_REVALIDATE_SECONDS },
);

/** Fire-and-forget view counter; failures must not break the article render. */
export async function incrementPostViews(id: string) {
  try {
    await prisma.blogPost.update({ where: { id }, data: { views: { increment: 1 } } });
  } catch (error) {
    console.error('[blog] failed to increment views', error);
  }
}

// --- Admin -------------------------------------------------------------------

export function listPostsForAdmin(search?: string) {
  return prisma.blogPost.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export function getPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

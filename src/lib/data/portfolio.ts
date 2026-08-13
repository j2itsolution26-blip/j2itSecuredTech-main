import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/lib/cache';

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  client: true,
  industry: true,
  summary: true,
  technologies: true,
  thumbnail: true,
  completedAt: true,
} satisfies Prisma.PortfolioSelect;

export type PortfolioCard = Prisma.PortfolioGetPayload<{ select: typeof cardSelect }>;

export const getPortfolioProjects = unstable_cache(
  async (): Promise<PortfolioCard[]> =>
    prisma.portfolio.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { completedAt: 'desc' }],
      select: cardSelect,
    }),
  ['portfolio:all'],
  { tags: [CACHE_TAGS.portfolio], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getFeaturedProjects = unstable_cache(
  async (limit = 3): Promise<PortfolioCard[]> =>
    prisma.portfolio.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ order: 'asc' }, { completedAt: 'desc' }],
      take: limit,
      select: cardSelect,
    }),
  ['portfolio:featured'],
  { tags: [CACHE_TAGS.portfolio], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getProjectBySlug = unstable_cache(
  async (slug: string) => prisma.portfolio.findFirst({ where: { slug, isActive: true } }),
  ['portfolio:by-slug'],
  { tags: [CACHE_TAGS.portfolio], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getRelatedProjects = unstable_cache(
  async (category: string, excludeSlug: string, limit = 3): Promise<PortfolioCard[]> =>
    prisma.portfolio.findMany({
      where: { isActive: true, category, slug: { not: excludeSlug } },
      orderBy: { completedAt: 'desc' },
      take: limit,
      select: cardSelect,
    }),
  ['portfolio:related'],
  { tags: [CACHE_TAGS.portfolio], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getPortfolioCategories = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.portfolio.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((row) => row.category);
  },
  ['portfolio:categories'],
  { tags: [CACHE_TAGS.portfolio], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getPortfolioSlugs = unstable_cache(
  async () =>
    prisma.portfolio.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ['portfolio:slugs'],
  { tags: [CACHE_TAGS.portfolio], revalidate: CONTENT_REVALIDATE_SECONDS },
);

// --- Admin -------------------------------------------------------------------

export function listProjectsForAdmin(search?: string) {
  return prisma.portfolio.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { client: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export function getProjectById(id: string) {
  return prisma.portfolio.findUnique({ where: { id } });
}

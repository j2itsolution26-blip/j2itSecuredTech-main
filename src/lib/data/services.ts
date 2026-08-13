import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Prisma, ServiceCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/lib/cache';

const publicSelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  summary: true,
  icon: true,
  features: true,
  image: true,
  isFeatured: true,
} satisfies Prisma.ServiceSelect;

export type ServiceCard = Prisma.ServiceGetPayload<{ select: typeof publicSelect }>;

export const getPublishedServices = unstable_cache(
  async (): Promise<ServiceCard[]> =>
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
      select: publicSelect,
    }),
  ['services:published'],
  { tags: [CACHE_TAGS.services], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getFeaturedServices = unstable_cache(
  async (limit = 6): Promise<ServiceCard[]> =>
    prisma.service.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ order: 'asc' }],
      take: limit,
      select: publicSelect,
    }),
  ['services:featured'],
  { tags: [CACHE_TAGS.services], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getServicesByCategory = unstable_cache(
  async (category: ServiceCategory) =>
    prisma.service.findMany({
      where: { isActive: true, category },
      orderBy: [{ order: 'asc' }],
      select: publicSelect,
    }),
  ['services:by-category'],
  { tags: [CACHE_TAGS.services], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getServiceBySlug = unstable_cache(
  async (slug: string) => prisma.service.findFirst({ where: { slug, isActive: true } }),
  ['services:by-slug'],
  { tags: [CACHE_TAGS.services], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getServiceSlugs = unstable_cache(
  async () =>
    prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ['services:slugs'],
  { tags: [CACHE_TAGS.services], revalidate: CONTENT_REVALIDATE_SECONDS },
);

// --- Admin (uncached, always fresh) ------------------------------------------

export function listServicesForAdmin(search?: string) {
  return prisma.service.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

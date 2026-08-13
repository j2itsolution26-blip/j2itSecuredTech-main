import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/lib/cache';

// --- Testimonials ------------------------------------------------------------

export const getTestimonials = unstable_cache(
  async (limit?: number) =>
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    }),
  ['testimonials:active'],
  { tags: [CACHE_TAGS.testimonials], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getFeaturedTestimonials = unstable_cache(
  async (limit = 3) =>
    prisma.testimonial.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ order: 'asc' }],
      take: limit,
    }),
  ['testimonials:featured'],
  { tags: [CACHE_TAGS.testimonials], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export function listTestimonialsForAdmin() {
  return prisma.testimonial.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
}

export function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

// --- FAQs --------------------------------------------------------------------

export const getFaqs = unstable_cache(
  async (limit?: number) =>
    prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      ...(limit ? { take: limit } : {}),
    }),
  ['faqs:active'],
  { tags: [CACHE_TAGS.faqs], revalidate: CONTENT_REVALIDATE_SECONDS },
);

/** Groups active FAQs by category, preserving the configured ordering. */
export const getGroupedFaqs = unstable_cache(
  async () => {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    const grouped = new Map<string, typeof faqs>();
    for (const faq of faqs) {
      const bucket = grouped.get(faq.category) ?? [];
      bucket.push(faq);
      grouped.set(faq.category, bucket);
    }

    return [...grouped.entries()].map(([category, items]) => ({ category, items }));
  },
  ['faqs:grouped'],
  { tags: [CACHE_TAGS.faqs], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export function listFaqsForAdmin() {
  return prisma.faq.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
}

export function getFaqById(id: string) {
  return prisma.faq.findUnique({ where: { id } });
}

// --- Careers -----------------------------------------------------------------

export const getOpenRoles = unstable_cache(
  async () =>
    prisma.career.findMany({
      where: {
        isActive: true,
        OR: [{ closesAt: null }, { closesAt: { gte: new Date() } }],
      },
      orderBy: [{ department: 'asc' }, { createdAt: 'desc' }],
    }),
  ['careers:open'],
  { tags: [CACHE_TAGS.careers], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getRoleBySlug = unstable_cache(
  async (slug: string) => prisma.career.findFirst({ where: { slug, isActive: true } }),
  ['careers:by-slug'],
  { tags: [CACHE_TAGS.careers], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export function listCareersForAdmin() {
  return prisma.career.findMany({ orderBy: { createdAt: 'desc' } });
}

export function getCareerById(id: string) {
  return prisma.career.findUnique({ where: { id } });
}

// --- Industries --------------------------------------------------------------

export const getIndustries = unstable_cache(
  async () =>
    prisma.industry.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
    }),
  ['industries:active'],
  { tags: [CACHE_TAGS.industries], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getIndustryBySlug = unstable_cache(
  async (slug: string) => prisma.industry.findFirst({ where: { slug, isActive: true } }),
  ['industries:by-slug'],
  { tags: [CACHE_TAGS.industries], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export function listIndustriesForAdmin() {
  return prisma.industry.findMany({ orderBy: [{ order: 'asc' }] });
}

export function getIndustryById(id: string) {
  return prisma.industry.findUnique({ where: { id } });
}

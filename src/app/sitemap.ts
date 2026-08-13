import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';
import { getServiceSlugs } from '@/lib/data/services';
import { getPortfolioSlugs } from '@/lib/data/portfolio';
import { getPostSlugs } from '@/lib/data/blog';
import { getOpenRoles } from '@/lib/data/marketing';

/** Regenerated hourly; content edits also invalidate the underlying caches. */
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/portfolio', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/industries', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { path: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/faqs', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/request-quote', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const base: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const [services, projects, posts, roles] = await Promise.all([
      getServiceSlugs(),
      getPortfolioSlugs(),
      getPostSlugs(),
      getOpenRoles(),
    ]);

    return [
      ...base,
      ...services.map((service) => ({
        url: `${SITE_URL}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      })),
      ...projects.map((project) => ({
        url: `${SITE_URL}/portfolio/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })),
      ...roles.map((role) => ({
        url: `${SITE_URL}/careers/${role.slug}`,
        lastModified: role.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })),
    ];
  } catch (error) {
    // A database outage must not take the sitemap offline entirely.
    console.error('[sitemap] falling back to static routes', error);
    return base;
  }
}

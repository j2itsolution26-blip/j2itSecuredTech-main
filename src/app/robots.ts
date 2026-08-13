import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';
import { getSettings } from '@/lib/data/settings';

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const indexable = settings['seo.robotsIndex'] !== 'false';

  if (!indexable) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

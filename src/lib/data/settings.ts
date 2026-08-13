import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/lib/cache';
import { COMPANY_INFO } from '@/lib/constants';

/**
 * Editable site configuration. Defaults mirror `COMPANY_INFO` so the site
 * renders correctly before an administrator saves anything.
 */
export const SETTING_DEFINITIONS = [
  { key: 'site.name', label: 'Site name', group: 'general', fallback: COMPANY_INFO.name },
  { key: 'site.tagline', label: 'Tagline', group: 'general', fallback: COMPANY_INFO.tagline },
  { key: 'site.description', label: 'Site description', group: 'general', fallback: COMPANY_INFO.description },
  { key: 'contact.email', label: 'Primary email', group: 'contact', fallback: COMPANY_INFO.email },
  { key: 'contact.salesEmail', label: 'Sales email', group: 'contact', fallback: COMPANY_INFO.salesEmail },
  { key: 'contact.supportEmail', label: 'Support email', group: 'contact', fallback: COMPANY_INFO.supportEmail },
  { key: 'contact.phone', label: 'Primary phone', group: 'contact', fallback: COMPANY_INFO.phone },
  { key: 'contact.phoneAlt', label: 'Alternate phone', group: 'contact', fallback: COMPANY_INFO.phoneAlt },
  { key: 'contact.address', label: 'Office address', group: 'contact', fallback: COMPANY_INFO.address },
  { key: 'contact.hours', label: 'Business hours', group: 'contact', fallback: COMPANY_INFO.hours },
  { key: 'contact.mapQuery', label: 'Google Maps search query', group: 'contact', fallback: COMPANY_INFO.mapQuery },
  { key: 'social.facebook', label: 'Facebook URL', group: 'social', fallback: COMPANY_INFO.social.facebook },
  { key: 'social.linkedin', label: 'LinkedIn URL', group: 'social', fallback: COMPANY_INFO.social.linkedin },
  { key: 'social.twitter', label: 'X / Twitter URL', group: 'social', fallback: COMPANY_INFO.social.twitter },
  { key: 'social.github', label: 'GitHub URL', group: 'social', fallback: COMPANY_INFO.social.github },
  { key: 'seo.metaTitle', label: 'Default meta title', group: 'seo', fallback: `${COMPANY_INFO.name} | ${COMPANY_INFO.tagline}` },
  { key: 'seo.metaDescription', label: 'Default meta description', group: 'seo', fallback: COMPANY_INFO.description },
  { key: 'seo.keywords', label: 'Default keywords (comma separated)', group: 'seo', fallback: COMPANY_INFO.keywords.join(', ') },
  { key: 'seo.ogImage', label: 'Default social share image URL', group: 'seo', fallback: '/opengraph-image' },
  { key: 'seo.googleVerification', label: 'Google Search Console token', group: 'seo', fallback: '' },
  { key: 'seo.robotsIndex', label: 'Allow search engine indexing (true/false)', group: 'seo', fallback: 'true' },
] as const;

export type SettingKey = (typeof SETTING_DEFINITIONS)[number]['key'];
export type SettingsMap = Record<SettingKey, string>;

function withDefaults(rows: { key: string; value: string }[]): SettingsMap {
  const stored = new Map(rows.map((row) => [row.key, row.value]));
  return Object.fromEntries(
    SETTING_DEFINITIONS.map((definition) => [
      definition.key,
      stored.get(definition.key) || definition.fallback,
    ]),
  ) as SettingsMap;
}

export const getSettings = unstable_cache(
  async (): Promise<SettingsMap> => {
    try {
      const rows = await prisma.siteSetting.findMany({ select: { key: true, value: true } });
      return withDefaults(rows);
    } catch (error) {
      // The public site must still render if the settings table is unavailable.
      console.error('[settings] falling back to defaults', error);
      return withDefaults([]);
    }
  },
  ['settings:all'],
  { tags: [CACHE_TAGS.settings], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function getSettingsForAdmin() {
  const rows = await prisma.siteSetting.findMany({ select: { key: true, value: true } });
  const values = withDefaults(rows);

  return SETTING_DEFINITIONS.map((definition) => ({
    ...definition,
    value: values[definition.key],
  }));
}

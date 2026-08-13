import type { Metadata } from 'next';
import { COMPANY_INFO } from '@/lib/constants';
import { SITE_URL } from '@/lib/env';
import { toE164, toIsoString } from '@/lib/utils';

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: Date | string | null;
  modifiedTime?: Date | string | null;
  authors?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Builds a complete metadata object — canonical URL, OpenGraph and Twitter
 * cards included — so every page ships consistent SEO without duplication.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? '/opengraph-image';

  return {
    title,
    description,
    keywords: [...(keywords ?? COMPANY_INFO.keywords)],
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: `${title} | ${COMPANY_INFO.name}`,
      description,
      siteName: COMPANY_INFO.name,
      locale: 'en_PH',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ? new Date(publishedTime).toISOString() : undefined,
            modifiedTime: modifiedTime ? new Date(modifiedTime).toISOString() : undefined,
            authors,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${COMPANY_INFO.name}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

// --- Structured data ---------------------------------------------------------

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    url: SITE_URL,
    logo: absoluteUrl('/icon'),
    description: COMPANY_INFO.description,
    foundingDate: String(COMPANY_INFO.founded),
    email: COMPANY_INFO.email,
    // schema.org expects an internationally dialable number.
    telephone: toE164(COMPANY_INFO.phone),
    sameAs: Object.values(COMPANY_INFO.social),
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.addressParts.street,
      addressLocality: COMPANY_INFO.addressParts.locality,
      addressRegion: COMPANY_INFO.addressParts.region,
      postalCode: COMPANY_INFO.addressParts.postalCode,
      addressCountry: COMPANY_INFO.addressParts.country,
    },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': absoluteUrl('/#localbusiness'),
    name: COMPANY_INFO.name,
    image: absoluteUrl('/opengraph-image'),
    url: SITE_URL,
    // schema.org expects an internationally dialable number.
    telephone: toE164(COMPANY_INFO.phone),
    email: COMPANY_INFO.email,
    priceRange: '₱₱₱',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.addressParts.street,
      addressLocality: COMPANY_INFO.addressParts.locality,
      addressRegion: COMPANY_INFO.addressParts.region,
      postalCode: COMPANY_INFO.addressParts.postalCode,
      addressCountry: COMPANY_INFO.addressParts.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_INFO.geo.latitude,
      longitude: COMPANY_INFO.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: SITE_URL,
    name: COMPANY_INFO.name,
    description: COMPANY_INFO.description,
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/blog')}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    serviceType: input.serviceType ?? input.name,
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed: { '@type': 'Country', name: 'Philippines' },
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  // Cached reads yield ISO strings rather than Date instances — see toIsoString.
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? [input.image] : [absoluteUrl('/opengraph-image')],
    datePublished: toIsoString(input.publishedAt),
    dateModified: toIsoString(input.updatedAt ?? input.publishedAt),
    author: { '@type': 'Person', name: input.author },
    publisher: { '@id': absoluteUrl('/#organization') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function jobPostingSchema(input: {
  title: string;
  description: string;
  department: string;
  employmentType: string;
  location: string;
  isRemote: boolean;
  datePosted: Date | string;
  validThrough?: Date | string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: input.title,
    description: input.description,
    employmentType: input.employmentType,
    datePosted: toIsoString(input.datePosted),
    validThrough: toIsoString(input.validThrough),
    hiringOrganization: { '@id': absoluteUrl('/#organization') },
    jobLocationType: input.isRemote ? 'TELECOMMUTE' : undefined,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: input.location,
        addressCountry: 'PH',
      },
    },
  };
}

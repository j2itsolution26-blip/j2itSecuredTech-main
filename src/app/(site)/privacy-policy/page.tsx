import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { LegalDocument, type LegalSection } from '@/components/shared/LegalDocument';
import { COMPANY_INFO } from '@/lib/constants';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How J2 SecureTech collects, uses, stores and protects personal information submitted through this website, in line with the Philippine Data Privacy Act of 2012.',
  path: '/privacy-policy',
});

const LAST_UPDATED = '1 January 2026';

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  const sections: LegalSection[] = [
    {
      heading: 'Introduction',
      paragraphs: [
        `${COMPANY_INFO.legalName} ("J2 SecureTech", "we", "us") operates this website and the services described on it. This policy explains what personal information we collect, why we collect it, how long we keep it and the rights available to you.`,
        'We process personal information in accordance with Republic Act No. 10173 (the Data Privacy Act of 2012) and its implementing rules and regulations.',
      ],
    },
    {
      heading: 'Information we collect',
      paragraphs: ['We only collect information you choose to provide, plus limited technical data required to operate the site securely.'],
      bullets: [
        'Contact details you submit through the contact or quote request forms: name, company, email address, telephone number.',
        'Project information you describe in an enquiry, including budget range and timeline.',
        'Technical data recorded with each submission: IP address and browser user agent, retained for abuse prevention and audit purposes.',
        'Administrative account data for authorised staff who access the content management system.',
      ],
    },
    {
      heading: 'How we use your information',
      bullets: [
        'To respond to your enquiry, prepare a proposal and arrange a technical survey.',
        'To deliver, support and maintain services under an agreed contract.',
        'To maintain security and audit records of changes made to our systems.',
        'To comply with legal, accounting and regulatory obligations.',
      ],
      paragraphs: [
        'We do not sell personal information, and we do not use enquiry data for unrelated marketing without your separate consent.',
      ],
    },
    {
      heading: 'Legal basis for processing',
      paragraphs: [
        'We process enquiry data on the basis of your consent, given when you submit a form, and on the basis of legitimate interest in responding to business enquiries. Where a contract is in place, processing is necessary for the performance of that contract.',
      ],
    },
    {
      heading: 'Data retention',
      paragraphs: [
        'Quote requests and contact messages are retained for up to twenty-four months from the last interaction, after which they are deleted or anonymised. Records relating to signed contracts are retained for the period required by tax and corporate law.',
      ],
    },
    {
      heading: 'Disclosure to third parties',
      paragraphs: [
        'We do not disclose personal information to third parties except where necessary to deliver a service you have requested, or where required by law.',
      ],
      bullets: [
        'Infrastructure providers that host this website and its database under contractual confidentiality obligations.',
        'Manufacturer or distributor partners, where hardware warranty registration requires it, and only with your knowledge.',
        'Government authorities, where disclosure is legally compelled.',
      ],
    },
    {
      heading: 'Security measures',
      paragraphs: [
        'Data submitted through this website is transmitted over encrypted connections and stored in access-controlled databases. Administrative access requires individual credentials, is role-restricted and is recorded in an audit log. Submission endpoints are rate limited and validated on the server.',
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'This website does not use advertising or third-party tracking cookies. A session cookie is set only for authenticated administrators of the content management system, and is required for that system to function.',
      ],
    },
    {
      heading: 'Your rights',
      bullets: [
        'To be informed about how your personal information is processed.',
        'To access the personal information we hold about you.',
        'To correct information that is inaccurate or out of date.',
        'To object to processing, or to request erasure or blocking, subject to legal retention obligations.',
        'To lodge a complaint with the National Privacy Commission.',
      ],
    },
    {
      heading: 'Contact us',
      paragraphs: [
        `To exercise any of these rights or to raise a privacy concern, contact our Data Protection Officer at ${settings['contact.email']} or by post at ${settings['contact.address']}. We respond to verified requests within fifteen working days.`,
      ],
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Privacy Policy', path: '/privacy-policy' }])} />

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect, why we collect it, and the control you retain over your information."
        breadcrumbs={[{ name: 'Privacy Policy', path: '/privacy-policy' }]}
      />

      <LegalDocument sections={sections} lastUpdated={LAST_UPDATED} />
    </>
  );
}

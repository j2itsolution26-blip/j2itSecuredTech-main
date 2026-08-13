import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { LegalDocument, type LegalSection } from '@/components/shared/LegalDocument';
import { COMPANY_INFO } from '@/lib/constants';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description:
    'The terms governing use of the J2 SecureTech website, quotations, project delivery, warranties, maintenance contracts and intellectual property.',
  path: '/terms',
});

const LAST_UPDATED = '1 January 2026';

export default async function TermsPage() {
  const settings = await getSettings();

  const sections: LegalSection[] = [
    {
      heading: 'Acceptance of terms',
      paragraphs: [
        `These terms govern your use of the ${COMPANY_INFO.name} website and any enquiry submitted through it. By using this site you accept these terms. If you do not accept them, please do not use the site.`,
        'Where a signed service agreement exists between you and us, that agreement takes precedence over these terms for the services it covers.',
      ],
    },
    {
      heading: 'Website content',
      paragraphs: [
        'Information published on this site describes our capabilities in general terms and does not constitute a binding offer. Specifications, timelines and prices are confirmed only in a written proposal issued for your specific requirement.',
      ],
    },
    {
      heading: 'Quotations and proposals',
      bullets: [
        'Quotations are valid for thirty calendar days from the date of issue unless stated otherwise.',
        'Quotations for infrastructure and security work assume the site conditions recorded during our technical survey. Material differences discovered on site may require a revised quotation.',
        'Hardware pricing is subject to supplier availability and prevailing exchange rates at the time of order confirmation.',
        'A purchase order or signed acceptance is required before work is scheduled.',
      ],
    },
    {
      heading: 'Project delivery',
      paragraphs: [
        'We deliver against the milestones set out in the accepted proposal. Client-side dependencies — site access, power provisioning, network information, stakeholder sign-off and content — are identified in the project plan, and delays in those dependencies shift the schedule accordingly.',
      ],
    },
    {
      heading: 'Payment terms',
      bullets: [
        'Standard terms are a mobilisation payment on order confirmation, a progress payment at an agreed milestone and the balance on acceptance, unless varied in the proposal.',
        'Invoices are payable within the period stated on the invoice.',
        'Title to supplied hardware passes on full payment; risk passes on delivery to site.',
      ],
    },
    {
      heading: 'Warranties',
      paragraphs: [
        'Hardware carries the manufacturer warranty stated in the proposal, which we administer on your behalf. Workmanship on installation work is warranted for twelve months from acceptance. Custom software is warranted against defects in the delivered functionality for ninety days from acceptance.',
      ],
      bullets: [
        'Warranties exclude damage from misuse, unauthorised modification, power irregularities, force majeure events or third-party interference.',
        'Warranty claims must be raised in writing with reasonable detail of the fault.',
      ],
    },
    {
      heading: 'Maintenance and support',
      paragraphs: [
        'Annual Maintenance Contracts define the covered systems, preventive schedule, response window and escalation path. Support outside a maintenance contract is billed at prevailing rates and scheduled on availability.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'On full payment, you receive ownership of custom application source code developed specifically for you, together with associated documentation. We retain ownership of our pre-existing frameworks, libraries, tooling and know-how, and grant you a perpetual licence to use them as embedded in the delivered solution.',
        'Third-party software and hardware firmware remain subject to their own licences.',
      ],
    },
    {
      heading: 'Confidentiality',
      paragraphs: [
        'Each party will keep the other party’s non-public information confidential and use it only for the purpose of delivering or receiving the services. This obligation survives completion of the engagement.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'To the extent permitted by law, our aggregate liability arising from an engagement is limited to the total fees paid for the specific service giving rise to the claim. We are not liable for indirect or consequential loss, including loss of profit, revenue or data, except where such loss results from our wilful misconduct or gross negligence.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of the Republic of the Philippines. Disputes that cannot be resolved amicably fall under the exclusive jurisdiction of the courts of Metro Manila.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        `Questions about these terms may be directed to ${settings['contact.email']} or ${settings['contact.address']}.`,
      ],
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Terms of Service', path: '/terms' }])} />

      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="The commercial and legal framework that applies to our website, quotations and delivered work."
        breadcrumbs={[{ name: 'Terms of Service', path: '/terms' }]}
      />

      <LegalDocument sections={sections} lastUpdated={LAST_UPDATED} />
    </>
  );
}

import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { CallToAction } from '@/components/sections/CallToAction';
import { EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { getGroupedFaqs } from '@/lib/data/marketing';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers about J2 SecureTech project timelines, maintenance contracts, hardware supply, government procurement, warranties and technical support.',
  path: '/faqs',
});

export default async function FaqsPage() {
  const [groups, settings] = await Promise.all([getGroupedFaqs(), getSettings()]);

  const allFaqs = groups.flatMap((group) => group.items);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: 'FAQs', path: '/faqs' }]),
          ...(allFaqs.length
            ? [faqSchema(allFaqs.map(({ question, answer }) => ({ question, answer })))]
            : []),
        ]}
      />

      <PageHero
        eyebrow="FAQs"
        title="Answers before you commit budget"
        description="The questions procurement teams, IT managers and business owners ask us most often — answered plainly."
        breadcrumbs={[{ name: 'FAQs', path: '/faqs' }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {groups.length === 0 ? (
          <EmptyState
            title="FAQs are being updated"
            description="Contact our team directly and we will answer your question the same business day."
            action={
              <Button asChild variant="outline">
                <Link href="/contact">Contact us</Link>
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-14">
            {groups.map((group) => (
              <section key={group.category} aria-labelledby={`faq-${group.category}`}>
                <h2
                  id={`faq-${group.category}`}
                  className="mb-6 font-heading text-xl font-bold text-foreground"
                >
                  {group.category}
                </h2>
                <FaqAccordion faqs={group.items} />
              </section>
            ))}
          </div>
        )}
      </div>

      <CallToAction
        title="Still have a question?"
        description="Our solutions team answers technical and commercial questions directly — no call centre in between."
        phone={settings['contact.phone']}
      />
    </>
  );
}

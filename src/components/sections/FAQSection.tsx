'use client';

import Link from 'next/link';
import type { Faq } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/button';

export function FAQSection({
  faqs,
  showViewAll = true,
}: {
  faqs: Faq[];
  showViewAll?: boolean;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frequently asked questions"
          title={<span id="faq-heading">Answers before you commit budget</span>}
          description="If your question is not covered here, our solutions team will answer it directly — usually the same business day."
        />

        <Accordion
          type="single"
          collapsible
          defaultValue={faqs[0]?.id}
          className="mt-12 flex flex-col gap-3"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {showViewAll ? (
          <div className="mt-10 flex justify-center">
            <Button asChild variant="ghost">
              <Link href="/faqs">
                See all questions
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

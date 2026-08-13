'use client';

import type { Faq } from '@prisma/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/** Bare accordion list, used where the page supplies its own headings. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-3">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

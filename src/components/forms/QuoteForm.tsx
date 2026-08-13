'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { submitQuoteRequest } from '@/lib/actions/lead-actions';
import { BUDGET_RANGES, quoteRequestSchema, TIMELINE_OPTIONS } from '@/lib/validations/lead';
import { SERVICE_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Checkbox, FieldError, Input, Label, Select, Textarea } from '@/components/ui/input';
import { ActionFeedback } from '@/components/ui/feedback';
import { useServerForm } from '@/components/forms/use-server-form';

export function QuoteForm({ services }: { services: string[] }) {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service') ?? '';

  const options = services.length > 0 ? services : [...SERVICE_OPTIONS];

  const { form, state, isPending, onSubmit } = useServerForm({
    schema: quoteRequestSchema,
    action: submitQuoteRequest,
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      service: options.includes(preselectedService) ? preselectedService : '',
      budget: '',
      timeline: '',
      description: '',
      consent: false,
      website: '',
    },
  });

  const { errors } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <ActionFeedback state={state} />

      {/* Honeypot: hidden from users and assistive tech, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="quote-website">Do not fill this field</label>
        <input id="quote-website" type="text" tabIndex={-1} autoComplete="off" {...form.register('website')} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-name" required>
            Full name
          </Label>
          <Input
            id="quote-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'quote-name-error' : undefined}
            {...form.register('name')}
          />
          <span id="quote-name-error">
            <FieldError messages={errors.name?.message ? [errors.name.message] : undefined} />
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-company">Company / organisation</Label>
          <Input id="quote-company" autoComplete="organization" {...form.register('company')} />
          <FieldError messages={errors.company?.message ? [errors.company.message] : undefined} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-email" required>
            Business email
          </Label>
          <Input
            id="quote-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...form.register('email')}
          />
          <FieldError messages={errors.email?.message ? [errors.email.message] : undefined} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-phone" required>
            Contact number
          </Label>
          <Input
            id="quote-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+63 917 000 0000"
            aria-invalid={Boolean(errors.phone)}
            {...form.register('phone')}
          />
          <FieldError messages={errors.phone?.message ? [errors.phone.message] : undefined} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="quote-service" required>
          Service required
        </Label>
        <Select id="quote-service" aria-invalid={Boolean(errors.service)} {...form.register('service')}>
          <option value="">Select a service…</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FieldError messages={errors.service?.message ? [errors.service.message] : undefined} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-budget">Indicative budget</Label>
          <Select id="quote-budget" {...form.register('budget')}>
            <option value="">Prefer not to say</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-timeline">Target timeline</Label>
          <Select id="quote-timeline" {...form.register('timeline')}>
            <option value="">Not yet defined</option>
            {TIMELINE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="quote-description" required>
          Project requirements
        </Label>
        <Textarea
          id="quote-description"
          rows={6}
          placeholder="Describe the sites involved, existing systems, number of users or cameras, and any deadlines we should plan around."
          aria-invalid={Boolean(errors.description)}
          {...form.register('description')}
        />
        <FieldError messages={errors.description?.message ? [errors.description.message] : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Checkbox id="quote-consent" aria-invalid={Boolean(errors.consent)} {...form.register('consent')} />
          <Label htmlFor="quote-consent" className="text-sm font-normal text-muted">
            I agree to J2 SecureTech processing this enquiry in line with the{' '}
            <Link href="/privacy-policy" className="text-secondary hover:underline">
              privacy policy
            </Link>
            .
          </Label>
        </div>
        <FieldError messages={errors.consent?.message ? [errors.consent.message] : undefined} />
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="sm:self-start">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Submit request
          </>
        )}
      </Button>

      <p className="text-xs text-subtle">
        We respond to every request within one business day. Technical surveys are scheduled at no cost.
      </p>
    </form>
  );
}

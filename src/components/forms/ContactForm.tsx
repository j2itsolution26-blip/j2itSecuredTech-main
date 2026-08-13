'use client';

import Link from 'next/link';
import { Loader2, Send } from 'lucide-react';
import { submitContactMessage } from '@/lib/actions/lead-actions';
import { contactMessageSchema } from '@/lib/validations/lead';
import { Button } from '@/components/ui/button';
import { Checkbox, FieldError, Input, Label, Textarea } from '@/components/ui/input';
import { ActionFeedback } from '@/components/ui/feedback';
import { useServerForm } from '@/components/forms/use-server-form';

export function ContactForm() {
  const { form, state, isPending, onSubmit } = useServerForm({
    schema: contactMessageSchema,
    action: submitContactMessage,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      consent: false,
      website: '',
    },
  });

  const { errors } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <ActionFeedback state={state} />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Do not fill this field</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...form.register('website')} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name" required>
            Full name
          </Label>
          <Input
            id="contact-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...form.register('name')}
          />
          <FieldError messages={errors.name?.message ? [errors.name.message] : undefined} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email" required>
            Email address
          </Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...form.register('email')}
          />
          <FieldError messages={errors.email?.message ? [errors.email.message] : undefined} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-phone">Contact number</Label>
          <Input id="contact-phone" type="tel" autoComplete="tel" {...form.register('phone')} />
          <FieldError messages={errors.phone?.message ? [errors.phone.message] : undefined} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-company">Company</Label>
          <Input id="contact-company" autoComplete="organization" {...form.register('company')} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject" required>
          Subject
        </Label>
        <Input
          id="contact-subject"
          aria-invalid={Boolean(errors.subject)}
          {...form.register('subject')}
        />
        <FieldError messages={errors.subject?.message ? [errors.subject.message] : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message" required>
          Message
        </Label>
        <Textarea
          id="contact-message"
          rows={6}
          aria-invalid={Boolean(errors.message)}
          {...form.register('message')}
        />
        <FieldError messages={errors.message?.message ? [errors.message.message] : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Checkbox id="contact-consent" aria-invalid={Boolean(errors.consent)} {...form.register('consent')} />
          <Label htmlFor="contact-consent" className="text-sm font-normal text-muted">
            I agree to J2 SecureTech processing this message in line with the{' '}
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
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}

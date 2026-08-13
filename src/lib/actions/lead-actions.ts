'use server';

import { AuditAction } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';
import { getRequestContext } from '@/lib/request-context';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';
import { sanitizeText } from '@/lib/security/sanitize';
import { contactMessageSchema, quoteRequestSchema } from '@/lib/validations/lead';
import { generateQuoteReference } from '@/lib/data/leads';
import { failure, fromZodError, success, toActionError, type ActionState } from '@/lib/action-result';

/**
 * Public quote submission.
 *
 * Defence layers: honeypot field, per-IP rate limit, Zod validation and
 * text sanitisation before anything reaches the database.
 */
export async function submitQuoteRequest(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = quoteRequestSchema.safeParse({
      name: formData.get('name'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      budget: formData.get('budget'),
      timeline: formData.get('timeline'),
      description: formData.get('description'),
      consent: formData.get('consent') === 'on' || formData.get('consent') === 'true',
      website: formData.get('website') ?? '',
    });

    if (!parsed.success) return fromZodError(parsed.error);

    const { ipAddress } = await getRequestContext();
    const limit = rateLimit(`quote:${ipAddress}`, RATE_LIMITS.quoteRequest);

    if (!limit.success) {
      return failure(
        `You have reached the submission limit. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes or call us directly.`,
      );
    }

    const data = parsed.data;
    const reference = generateQuoteReference();

    const quote = await prisma.quoteRequest.create({
      data: {
        reference,
        name: sanitizeText(data.name),
        company: data.company ? sanitizeText(data.company) : null,
        email: data.email,
        phone: sanitizeText(data.phone),
        service: sanitizeText(data.service),
        budget: data.budget ? sanitizeText(data.budget) : null,
        timeline: data.timeline ? sanitizeText(data.timeline) : null,
        description: sanitizeText(data.description).slice(0, 5000),
        ipAddress,
      },
      select: { id: true, reference: true },
    });

    await recordAudit({
      action: AuditAction.CREATE,
      entity: 'QuoteRequest',
      entityId: quote.id,
      summary: `New quote request ${quote.reference} from ${data.email}`,
      actor: { email: data.email },
    });

    return success(
      'Thank you. Your request has been received — our solutions team responds within one business day.',
      { reference: quote.reference },
    );
  } catch (error) {
    return toActionError(error);
  }
}

/** Public contact form submission. */
export async function submitContactMessage(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = contactMessageSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      consent: formData.get('consent') === 'on' || formData.get('consent') === 'true',
      website: formData.get('website') ?? '',
    });

    if (!parsed.success) return fromZodError(parsed.error);

    const { ipAddress } = await getRequestContext();
    const limit = rateLimit(`contact:${ipAddress}`, RATE_LIMITS.contactMessage);

    if (!limit.success) {
      return failure(
        `Too many messages sent from this connection. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
      );
    }

    const data = parsed.data;

    const message = await prisma.contactMessage.create({
      data: {
        name: sanitizeText(data.name),
        email: data.email,
        phone: data.phone ? sanitizeText(data.phone) : null,
        company: data.company ? sanitizeText(data.company) : null,
        subject: sanitizeText(data.subject),
        message: sanitizeText(data.message).slice(0, 5000),
        ipAddress,
      },
      select: { id: true },
    });

    await recordAudit({
      action: AuditAction.CREATE,
      entity: 'ContactMessage',
      entityId: message.id,
      summary: `New contact message from ${data.email}`,
      actor: { email: data.email },
    });

    return success('Message sent. A member of our team will reply shortly.');
  } catch (error) {
    return toActionError(error);
  }
}

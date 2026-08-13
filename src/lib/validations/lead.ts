import { z } from 'zod';
import { MessageStatus, QuoteStatus } from '@prisma/client';

/** Loose international phone matcher — digits, spaces and common separators. */
const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number')
  .max(24, 'Phone number is too long')
  .regex(/^[+()\d\s.-]+$/, 'Phone number contains invalid characters');

export const BUDGET_RANGES = [
  'Under ₱100,000',
  '₱100,000 – ₱500,000',
  '₱500,000 – ₱1,000,000',
  '₱1,000,000 – ₱5,000,000',
  'Above ₱5,000,000',
  'Not yet determined',
] as const;

export const TIMELINE_OPTIONS = [
  'Immediately (within 2 weeks)',
  '1 – 3 months',
  '3 – 6 months',
  '6 – 12 months',
  'Planning / budgeting stage',
] as const;

/**
 * Public quote request. `website` is an unused honeypot field — real users
 * never see it, bots fill it in, and submissions containing it are rejected.
 */
export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.string().trim().toLowerCase().email('Enter a valid business email'),
  phone: phoneSchema,
  service: z.string().trim().min(2, 'Select the service you need'),
  budget: z.string().trim().max(80).optional().or(z.literal('')),
  timeline: z.string().trim().max(80).optional().or(z.literal('')),
  description: z
    .string()
    .trim()
    .min(30, 'Please describe your requirements in at least 30 characters')
    .max(5000, 'Description must be under 5000 characters'),
  consent: z
    .boolean()
    .refine((accepted) => accepted, 'Please accept the privacy policy to continue'),
  website: z.string().max(0, 'Submission rejected').optional(),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: phoneSchema.optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Please enter a subject').max(180),
  message: z
    .string()
    .trim()
    .min(20, 'Please provide at least 20 characters')
    .max(5000, 'Message must be under 5000 characters'),
  consent: z
    .boolean()
    .refine((accepted) => accepted, 'Please accept the privacy policy to continue'),
  website: z.string().max(0, 'Submission rejected').optional(),
});

export const quoteStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(QuoteStatus),
  notes: z.string().trim().max(4000).optional().or(z.literal('')),
});

export const messageStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(MessageStatus),
  notes: z.string().trim().max(4000).optional().or(z.literal('')),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

import { z } from 'zod';
import { EmploymentType, MediaType, ServiceCategory } from '@prisma/client';

const slugSchema = z
  .string()
  .trim()
  .min(2, 'Slug is required')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only');

/** Textareas collect one item per line; empty lines are discarded. */
export const linesToArray = z
  .union([z.string(), z.array(z.string())])
  .transform((value) =>
    (Array.isArray(value) ? value : value.split('\n'))
      .map((line) => line.trim())
      .filter(Boolean),
  );

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

/** HTML checkbox inputs post "on"/"true" rather than booleans. */
const checkbox = z
  .union([z.boolean(), z.string()])
  .transform((value) => value === true || value === 'true' || value === 'on')
  .default(false);

const numeric = (fallback = 0) =>
  z.coerce.number().int().min(0).max(100000).default(fallback);

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, 'Title is required').max(160),
  slug: slugSchema,
  category: z.nativeEnum(ServiceCategory),
  summary: z.string().trim().min(20, 'Summary must be at least 20 characters').max(400),
  description: z.string().trim().min(50, 'Description must be at least 50 characters'),
  icon: z.string().trim().min(1).max(60).default('Cpu'),
  features: linesToArray,
  deliverables: linesToArray,
  image: optionalText(600),
  metaTitle: optionalText(160),
  metaDesc: optionalText(320),
  order: numeric(0),
  isActive: checkbox,
  isFeatured: checkbox,
});

export const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, 'Title is required').max(180),
  slug: slugSchema,
  category: z.string().trim().min(2, 'Category is required').max(80),
  client: z.string().trim().min(2, 'Client is required').max(160),
  industry: optionalText(120),
  location: optionalText(160),
  summary: z.string().trim().min(20, 'Summary must be at least 20 characters').max(400),
  overview: z.string().trim().min(50, 'Overview must be at least 50 characters'),
  challenge: optionalText(4000),
  solution: optionalText(4000),
  technologies: linesToArray,
  features: linesToArray,
  results: linesToArray,
  images: linesToArray,
  thumbnail: z.string().trim().min(1, 'Thumbnail URL is required').max(600),
  metaTitle: optionalText(160),
  metaDesc: optionalText(320),
  order: numeric(0),
  isActive: checkbox,
  isFeatured: checkbox,
  completedAt: z.string().trim().optional().or(z.literal('')),
});

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(5, 'Title is required').max(200),
  slug: slugSchema,
  excerpt: z.string().trim().min(40, 'Excerpt must be at least 40 characters').max(400),
  content: z.string().trim().min(100, 'Content must be at least 100 characters'),
  featuredImage: optionalText(600),
  category: z.string().trim().min(2, 'Category is required').max(80),
  tags: linesToArray,
  isPublished: checkbox,
  isFeatured: checkbox,
  metaTitle: optionalText(160),
  metaDesc: optionalText(320),
  authorName: z.string().trim().min(2).max(120).default('J2 SecureTech Editorial'),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Name is required').max(120),
  role: z.string().trim().min(2, 'Role is required').max(120),
  company: z.string().trim().min(2, 'Company is required').max(160),
  industry: optionalText(120),
  content: z.string().trim().min(30, 'Testimonial must be at least 30 characters').max(1200),
  image: optionalText(600),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  order: numeric(0),
  isActive: checkbox,
  isFeatured: checkbox,
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(8, 'Question is required').max(300),
  answer: z.string().trim().min(20, 'Answer must be at least 20 characters').max(3000),
  category: z.string().trim().min(2).max(80).default('General'),
  order: numeric(0),
  isActive: checkbox,
});

export const careerSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, 'Title is required').max(160),
  slug: slugSchema,
  department: z.string().trim().min(2, 'Department is required').max(120),
  type: z.nativeEnum(EmploymentType),
  location: z.string().trim().min(2, 'Location is required').max(160),
  isRemote: checkbox,
  salaryRange: optionalText(120),
  description: z.string().trim().min(50, 'Description must be at least 50 characters'),
  responsibilities: linesToArray,
  requirements: linesToArray,
  benefits: linesToArray,
  isActive: checkbox,
  closesAt: z.string().trim().optional().or(z.literal('')),
});

export const industrySchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, 'Title is required').max(160),
  slug: slugSchema,
  description: z.string().trim().min(30, 'Description must be at least 30 characters').max(600),
  icon: z.string().trim().min(1).max(60).default('Building2'),
  challenges: linesToArray,
  solutions: linesToArray,
  order: numeric(0),
  isActive: checkbox,
});

export const mediaSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Name is required').max(200),
  url: z.string().trim().url('Enter a valid URL').max(600),
  publicId: optionalText(240),
  type: z.nativeEnum(MediaType).default(MediaType.IMAGE),
  format: optionalText(20),
  width: z.coerce.number().int().min(0).optional(),
  height: z.coerce.number().int().min(0).optional(),
  bytes: z.coerce.number().int().min(0).default(0),
  folder: z.string().trim().max(120).default('j2securetech'),
  alt: optionalText(300),
});

export const settingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().trim().min(1).max(80),
      value: z.string().max(5000),
    }),
  ),
});

export const idSchema = z.object({ id: z.string().min(1, 'Missing record identifier') });

export type ServiceInput = z.infer<typeof serviceSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
export type CareerInput = z.infer<typeof careerSchema>;
export type IndustryInput = z.infer<typeof industrySchema>;
export type MediaInput = z.infer<typeof mediaSchema>;

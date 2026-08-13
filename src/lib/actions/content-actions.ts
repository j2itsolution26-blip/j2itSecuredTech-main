'use server';

import { AuditAction, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/cache';
import { sanitizeHtml, sanitizeText } from '@/lib/security/sanitize';
import { estimateReadingTime } from '@/lib/utils';
import {
  blogPostSchema,
  careerSchema,
  faqSchema,
  idSchema,
  industrySchema,
  portfolioSchema,
  serviceSchema,
  testimonialSchema,
} from '@/lib/validations/content';
import { fromZodError, type ActionState } from '@/lib/action-result';
import { runMutation, toNullable, toOptionalDate } from '@/lib/actions/mutation';

/** Turns a FormData payload into a plain object the Zod schemas can parse. */
function toObject(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries());
}

// --- Services ----------------------------------------------------------------

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = serviceSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...input } = parsed.data;

  return runMutation(
    {
      entity: 'Service',
      action: id ? AuditAction.UPDATE : AuditAction.CREATE,
      tag: CACHE_TAGS.services,
    },
    async () => {
      const data = {
        ...input,
        title: sanitizeText(input.title),
        summary: sanitizeText(input.summary),
        description: sanitizeHtml(input.description),
        image: toNullable(input.image),
        metaTitle: toNullable(input.metaTitle),
        metaDesc: toNullable(input.metaDesc),
      };

      const record = id
        ? await prisma.service.update({ where: { id }, data })
        : await prisma.service.create({ data });

      return {
        entityId: record.id,
        message: id ? 'Service updated successfully.' : 'Service created successfully.',
        summary: `${id ? 'Updated' : 'Created'} service “${record.title}”`,
      };
    },
  );
}

export async function deleteService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Service', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.services },
    async () => {
      const record = await prisma.service.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'Service deleted.',
        summary: `Deleted service “${record.title}”`,
      };
    },
  );
}

// --- Portfolio ---------------------------------------------------------------

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = portfolioSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, completedAt, ...input } = parsed.data;

  return runMutation(
    {
      entity: 'Portfolio',
      action: id ? AuditAction.UPDATE : AuditAction.CREATE,
      tag: CACHE_TAGS.portfolio,
    },
    async () => {
      const data = {
        ...input,
        title: sanitizeText(input.title),
        client: sanitizeText(input.client),
        summary: sanitizeText(input.summary),
        overview: sanitizeHtml(input.overview),
        challenge: input.challenge ? sanitizeHtml(input.challenge) : null,
        solution: input.solution ? sanitizeHtml(input.solution) : null,
        industry: toNullable(input.industry),
        location: toNullable(input.location),
        metaTitle: toNullable(input.metaTitle),
        metaDesc: toNullable(input.metaDesc),
        completedAt: toOptionalDate(completedAt),
      };

      const record = id
        ? await prisma.portfolio.update({ where: { id }, data })
        : await prisma.portfolio.create({ data });

      return {
        entityId: record.id,
        message: id ? 'Project updated successfully.' : 'Project created successfully.',
        summary: `${id ? 'Updated' : 'Created'} portfolio project “${record.title}”`,
      };
    },
  );
}

export async function deleteProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Portfolio', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.portfolio },
    async () => {
      const record = await prisma.portfolio.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'Project deleted.',
        summary: `Deleted portfolio project “${record.title}”`,
      };
    },
  );
}

// --- Blog --------------------------------------------------------------------

export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = blogPostSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...input } = parsed.data;

  return runMutation(
    { entity: 'BlogPost', action: id ? AuditAction.UPDATE : AuditAction.CREATE, tag: CACHE_TAGS.blog },
    async (session) => {
      const existing = id ? await prisma.blogPost.findUnique({ where: { id } }) : null;
      const content = sanitizeHtml(input.content);

      const data = {
        ...input,
        title: sanitizeText(input.title),
        excerpt: sanitizeText(input.excerpt),
        content,
        readingTime: estimateReadingTime(content),
        featuredImage: toNullable(input.featuredImage),
        metaTitle: toNullable(input.metaTitle),
        metaDesc: toNullable(input.metaDesc),
        authorId: existing?.authorId ?? session.user.id,
        // Stamp the publish date the first time a post goes live and keep it stable after.
        publishedAt: input.isPublished ? (existing?.publishedAt ?? new Date()) : null,
      };

      const record = id
        ? await prisma.blogPost.update({ where: { id }, data })
        : await prisma.blogPost.create({ data });

      return {
        entityId: record.id,
        message: id ? 'Article updated successfully.' : 'Article created successfully.',
        summary: `${id ? 'Updated' : 'Created'} article “${record.title}”`,
      };
    },
  );
}

export async function deletePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'BlogPost', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.blog },
    async () => {
      const record = await prisma.blogPost.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'Article deleted.',
        summary: `Deleted article “${record.title}”`,
      };
    },
  );
}

// --- Testimonials ------------------------------------------------------------

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = testimonialSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...input } = parsed.data;

  return runMutation(
    {
      entity: 'Testimonial',
      action: id ? AuditAction.UPDATE : AuditAction.CREATE,
      tag: CACHE_TAGS.testimonials,
    },
    async () => {
      const data = {
        ...input,
        name: sanitizeText(input.name),
        role: sanitizeText(input.role),
        company: sanitizeText(input.company),
        content: sanitizeText(input.content),
        industry: toNullable(input.industry),
        image: toNullable(input.image),
      };

      const record = id
        ? await prisma.testimonial.update({ where: { id }, data })
        : await prisma.testimonial.create({ data });

      return {
        entityId: record.id,
        message: id ? 'Testimonial updated.' : 'Testimonial created.',
        summary: `${id ? 'Updated' : 'Created'} testimonial from ${record.name} (${record.company})`,
      };
    },
  );
}

export async function deleteTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Testimonial', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.testimonials },
    async () => {
      const record = await prisma.testimonial.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'Testimonial deleted.',
        summary: `Deleted testimonial from ${record.name}`,
      };
    },
  );
}

// --- FAQs --------------------------------------------------------------------

export async function saveFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = faqSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...input } = parsed.data;

  return runMutation(
    { entity: 'Faq', action: id ? AuditAction.UPDATE : AuditAction.CREATE, tag: CACHE_TAGS.faqs },
    async () => {
      const data = {
        ...input,
        question: sanitizeText(input.question),
        answer: sanitizeText(input.answer),
      };

      const record = id
        ? await prisma.faq.update({ where: { id }, data })
        : await prisma.faq.create({ data });

      return {
        entityId: record.id,
        message: id ? 'FAQ updated.' : 'FAQ created.',
        summary: `${id ? 'Updated' : 'Created'} FAQ “${record.question}”`,
      };
    },
  );
}

export async function deleteFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Faq', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.faqs },
    async () => {
      const record = await prisma.faq.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'FAQ deleted.',
        summary: `Deleted FAQ “${record.question}”`,
      };
    },
  );
}

// --- Careers -----------------------------------------------------------------

export async function saveCareer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = careerSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, closesAt, ...input } = parsed.data;

  return runMutation(
    { entity: 'Career', action: id ? AuditAction.UPDATE : AuditAction.CREATE, tag: CACHE_TAGS.careers },
    async () => {
      const data = {
        ...input,
        title: sanitizeText(input.title),
        department: sanitizeText(input.department),
        location: sanitizeText(input.location),
        description: sanitizeHtml(input.description),
        salaryRange: toNullable(input.salaryRange),
        closesAt: toOptionalDate(closesAt),
      };

      const record = id
        ? await prisma.career.update({ where: { id }, data })
        : await prisma.career.create({ data });

      return {
        entityId: record.id,
        message: id ? 'Role updated.' : 'Role published.',
        summary: `${id ? 'Updated' : 'Created'} career listing “${record.title}”`,
      };
    },
  );
}

export async function deleteCareer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Career', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.careers },
    async () => {
      const record = await prisma.career.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'Role removed.',
        summary: `Deleted career listing “${record.title}”`,
      };
    },
  );
}

// --- Industries --------------------------------------------------------------

export async function saveIndustry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = industrySchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...input } = parsed.data;

  return runMutation(
    {
      entity: 'Industry',
      action: id ? AuditAction.UPDATE : AuditAction.CREATE,
      tag: CACHE_TAGS.industries,
    },
    async () => {
      const data = {
        ...input,
        title: sanitizeText(input.title),
        description: sanitizeText(input.description),
      };

      const record = id
        ? await prisma.industry.update({ where: { id }, data })
        : await prisma.industry.create({ data });

      return {
        entityId: record.id,
        message: id ? 'Industry updated.' : 'Industry created.',
        summary: `${id ? 'Updated' : 'Created'} industry “${record.title}”`,
      };
    },
  );
}

export async function deleteIndustry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Industry', action: AuditAction.DELETE, role: UserRole.ADMIN, tag: CACHE_TAGS.industries },
    async () => {
      const record = await prisma.industry.delete({ where: { id: parsed.data.id } });
      return {
        entityId: record.id,
        message: 'Industry deleted.',
        summary: `Deleted industry “${record.title}”`,
      };
    },
  );
}

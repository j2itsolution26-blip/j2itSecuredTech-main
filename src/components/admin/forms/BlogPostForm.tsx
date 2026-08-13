import type { BlogPost } from '@prisma/client';
import {
  AdminForm,
  CheckboxField,
  FormSection,
  HiddenId,
  ListField,
  TextField,
  TextareaField,
} from '@/components/admin/AdminForm';
import { savePost } from '@/lib/actions/content-actions';

export function BlogPostForm({ post }: { post?: BlogPost | null }) {
  return (
    <AdminForm
      action={savePost}
      submitLabel={post ? 'Update article' : 'Create article'}
      redirectOnSuccess="/admin/blog"
    >
      <HiddenId value={post?.id} />

      <FormSection title="Article" columns={2}>
        <TextField name="title" label="Title" required defaultValue={post?.title} />
        <TextField name="slug" label="URL slug" required defaultValue={post?.slug} />
        <TextField name="category" label="Category" required defaultValue={post?.category} />
        <TextField
          name="authorName"
          label="Author byline"
          defaultValue={post?.authorName ?? 'J2 SecureTech Editorial'}
        />
        <TextareaField
          name="excerpt"
          label="Excerpt"
          required
          rows={3}
          className="sm:col-span-2"
          defaultValue={post?.excerpt}
          hint="Shown on cards and used as the meta description fallback."
        />
        <TextareaField
          name="content"
          label="Content"
          required
          rows={20}
          className="sm:col-span-2"
          defaultValue={post?.content}
          hint="HTML is supported. Scripts, iframes and event handlers are stripped on save."
        />
      </FormSection>

      <FormSection title="Taxonomy & media" columns={2}>
        <ListField name="tags" label="Tags" defaultValue={post?.tags} rows={6} />
        <TextField name="featuredImage" label="Featured image URL" defaultValue={post?.featuredImage} />
      </FormSection>

      <FormSection title="SEO & publication" columns={2}>
        <TextField name="metaTitle" label="Meta title" defaultValue={post?.metaTitle} />
        <TextField name="metaDesc" label="Meta description" defaultValue={post?.metaDesc} />
        <CheckboxField
          name="isPublished"
          label="Published"
          hint="The publish date is stamped the first time this is enabled."
          defaultChecked={post?.isPublished ?? false}
        />
        <CheckboxField
          name="isFeatured"
          label="Feature this article"
          defaultChecked={post?.isFeatured ?? false}
        />
      </FormSection>
    </AdminForm>
  );
}

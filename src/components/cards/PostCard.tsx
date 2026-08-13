import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import type { BlogCard } from '@/lib/data/blog';
import { Badge } from '@/components/ui/badge';
import { formatDate, toIsoString } from '@/lib/utils';

export function PostCard({ post, priority = false }: { post: BlogCard; priority?: boolean }) {
  return (
    <article className="card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10 bg-dot-pattern">
            <span className="font-heading text-3xl font-bold text-white/20">J2</span>
          </div>
        )}
        <Badge variant="brand" className="absolute left-4 top-4 backdrop-blur">
          {post.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 text-xs text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={toIsoString(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {post.readingTime} min read
          </span>
        </div>
      </div>
    </article>
  );
}

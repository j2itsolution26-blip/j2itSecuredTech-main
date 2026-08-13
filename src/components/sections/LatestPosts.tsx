import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogCard } from '@/lib/data/blog';
import { PostCard } from '@/components/cards/PostCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

export function LatestPosts({ posts }: { posts: BlogCard[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-24" aria-labelledby="insights-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Insights"
            title={<span id="insights-heading">Field notes from our engineers</span>}
            description="Practical guidance on infrastructure planning, security posture and systems procurement."
            className="max-w-2xl"
          />

          <Button asChild variant="outline" className="shrink-0">
            <Link href="/blog">
              Visit the blog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id} className="h-full">
              <PostCard post={post} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

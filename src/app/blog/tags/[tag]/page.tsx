import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/layout";
import { BlogPostCard } from "@/components/blog-post-card";
import { getAllBlogTags, getPostsByTag } from "@/lib/content";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllBlogTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return {
    title: `Posts tagged "${tag}"`,
    description: `${posts.length} article${posts.length !== 1 ? "s" : ""} tagged with "${tag}"`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <Section className="pt-24 md:pt-32">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Posts tagged &ldquo;{tag}&rdquo;
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          {posts.length} article{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts found with this tag.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Section>
  );
}

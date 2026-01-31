import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { BlogPostCard } from "@/components/blog-post-card";
import { Badge } from "@/components/ui";
import { getAllBlogTags, getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on analytics, data science, machine learning, and technical leadership.",
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const allTags = getAllBlogTags();

  if (posts.length === 0) {
    return (
      <Section className="pt-24 md:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Coming soon. I&apos;ll be sharing articles on analytics, data
            science, machine learning, and lessons from building technical teams.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/projects">
                View Projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24 md:pt-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Articles on analytics, data science, machine learning, and technical
          leadership.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}`}>
              <Badge
                variant="outline"
                className="hover:bg-accent cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <h2 className="sr-only">All Posts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}

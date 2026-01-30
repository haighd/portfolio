import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Section } from "@/components/layout";
import { Badge } from "@/components/ui";
import { MDXContent } from "@/components/mdx-content";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const ogImageUrl = new URL("/api/og", "https://danalytics.info");
  ogImageUrl.searchParams.set("title", post.title);
  ogImageUrl.searchParams.set("description", post.description);
  ogImageUrl.searchParams.set("type", "article");

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl.toString()],
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Section className="pt-24 md:pt-32" containerSize="narrow">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <header className="mb-12">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={post.publishedDate}>
            {formatDate(post.publishedDate)}
          </time>
          {post.updatedDate && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>
                Updated{" "}
                <time dateTime={post.updatedDate}>
                  {formatDate(post.updatedDate)}
                </time>
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{post.description}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <article>
        <MDXContent code={post.body} />
      </article>
    </Section>
  );
}

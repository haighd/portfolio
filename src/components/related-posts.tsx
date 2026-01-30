import Link from "next/link";
import { Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/content";

interface RelatedPostsProps {
  posts: BlogPost[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <aside aria-labelledby="related-posts-heading">
      <h2
        id="related-posts-heading"
        className="mb-6 text-2xl font-bold tracking-tight"
      >
        Related Posts
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-card hover:bg-accent/50 border-border group rounded-lg border p-4 transition-colors"
          >
            <div className="text-muted-foreground mb-2 flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={post.publishedDate}>
                {formatDate(post.publishedDate)}
              </time>
            </div>
            <h3 className="group-hover:text-accent font-semibold leading-snug transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}

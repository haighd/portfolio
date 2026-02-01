import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from "@/components/ui";
import type { BlogPost } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={post.publishedDate}>
              {formatDate(post.publishedDate)}
            </time>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{post.readingTime} min read</span>
          </span>
        </div>
        <CardTitle>
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-accent transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {post.tags?.slice(0, 4).map((tag) => (
            <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`}>
              <Badge
                variant="secondary"
                className="hover:bg-secondary/80 cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            </Link>
          ))}
          {(post.tags?.length ?? 0) > 4 && (
            <Badge variant="outline">+{(post.tags?.length ?? 0) - 4}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Read more &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

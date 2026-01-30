import Link from "next/link";
import { Calendar } from "lucide-react";
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

interface BlogPostCardProps {
  post: BlogPost;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={post.publishedDate}>
            {formatDate(post.publishedDate)}
          </time>
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
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {(post.tags?.length ?? 0) > 4 && (
            <Badge variant="outline">+{post.tags.length - 4}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Read more &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

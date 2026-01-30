import Link from "next/link";
import { ExternalLink, Github, Lock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from "@/components/ui";
import type { Project } from "@/lib/content";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-accent transition-colors"
          >
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {project.techStack?.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
          {(project.techStack?.length ?? 0) > 4 && (
            <Badge variant="outline">+{project.techStack.length - 4}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View details &rarr;
        </Link>
        {project.github &&
          (project.private ? (
            <span
              className="inline-flex items-center gap-1 text-muted-foreground/60"
              aria-label="Private repository"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Private</span>
            </span>
          ) : (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="View live site"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

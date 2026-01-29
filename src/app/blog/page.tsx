import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on analytics, data science, machine learning, and technical leadership.",
};

export default function BlogPage() {
  return (
    <>
      <Section className="pt-24 md:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-muted p-3">
            <Rss className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Coming soon. I&apos;ll be sharing articles on analytics, data
            science, machine learning, and lessons from building technical teams.
          </p>
        </div>
      </Section>

      <Section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-semibold tracking-tight">
            Topics I&apos;ll Cover
          </h2>
          <ul className="mt-6 space-y-4">
            <li className="flex gap-3">
              <span className="text-muted-foreground" aria-hidden="true">→</span>
              <span className="text-muted-foreground">
                Practical ML/AI implementation strategies
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-muted-foreground" aria-hidden="true">→</span>
              <span className="text-muted-foreground">
                Building and scaling analytics teams
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-muted-foreground" aria-hidden="true">→</span>
              <span className="text-muted-foreground">
                Technical deep-dives on side projects
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-muted-foreground" aria-hidden="true">→</span>
              <span className="text-muted-foreground">
                Data engineering patterns and best practices
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Want to be notified?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Connect with me on LinkedIn to stay updated when new posts are
            published.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <a
                href="https://linkedin.com/in/danhaight"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on LinkedIn
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

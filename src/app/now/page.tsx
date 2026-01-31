import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { Section } from "@/components/layout";
import { MDXContent } from "@/components/mdx-content";
import { getNowContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What I'm currently focused on, learning, reading, and building.",
};

export default function NowPage() {
  const now = getNowContent();

  if (!now) {
    notFound();
  }

  return (
    <Section className="pt-24 md:pt-32" containerSize="narrow">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Now
          <span className="mt-2 block h-1 w-16 rounded-full bg-foreground/20" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          What I&apos;m currently focused on, learning, reading, and building.
        </p>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Last updated{" "}
          <time dateTime={now.lastUpdated}>{formatDate(now.lastUpdated)}</time>
        </p>
      </header>

      <article>
        <MDXContent code={now.body} />
      </article>
    </Section>
  );
}

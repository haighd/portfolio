import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout";
import { MDXContent } from "@/components/mdx-content";
import { getUsesContent } from "@/lib/content";

const description =
  "The tools, hardware, and software I use for development and productivity.";

export const metadata: Metadata = {
  title: "Uses",
  description,
};

export default async function UsesPage() {
  const uses = await getUsesContent();

  if (!uses) {
    notFound();
  }

  return (
    <Section className="pt-24 md:pt-32" containerSize="narrow">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Uses
          <span className="mt-2 block h-1 w-16 rounded-full bg-foreground/20" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      </header>

      <article data-pagefind-meta="type:page">
        <MDXContent code={uses.body} />
      </article>
    </Section>
  );
}

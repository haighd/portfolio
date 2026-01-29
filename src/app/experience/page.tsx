import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { MDXContent } from "@/components/mdx-content";
import { getExperiences } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience in analytics leadership, data science, and ML/AI.",
};

export default function ExperiencePage() {
  const experiences = getExperiences();

  return (
    <>
      <Section className="pt-24 md:pt-32">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Experience</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            My professional journey in analytics, data science, and leadership.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 hidden h-full w-px bg-border md:left-32 md:block" />

          <div className="space-y-12">
            {experiences.map((experience) => (
              <div key={`${experience.company}-${experience.role}`} className="relative md:pl-44">
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 hidden h-3 w-3 rounded-full border-2 border-accent bg-background md:left-[121px] md:block" />

                {/* Date badge - positioned to the left on desktop */}
                <div className="mb-2 md:absolute md:left-0 md:top-0 md:w-28 md:text-right">
                  <span className="text-sm font-medium text-muted-foreground">
                    {experience.startDate}
                    {experience.endDate
                      ? ` – ${experience.endDate}`
                      : " – Present"}
                  </span>
                </div>

                {/* Content card */}
                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">{experience.role}</h2>
                    <p className="text-muted-foreground">
                      {experience.company} · {experience.location}
                    </p>
                  </div>
                  <div className="text-sm">
                    <MDXContent code={experience.body} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            See What I&apos;ve Built
          </h2>
          <p className="mt-4 text-muted-foreground">
            Check out my side projects that demonstrate hands-on technical
            capability.
          </p>
          <Button asChild className="mt-6">
            <Link href="/projects">
              View Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

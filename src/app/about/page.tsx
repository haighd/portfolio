import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout";
import { Badge, Button } from "@/components/ui";
import { getSkillsSummary } from "@/data/skills";
import { getAboutContent, getExperiences } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Analytics leader with hands-on technical depth in Python, SQL, and ML/AI.",
};

const skills = getSkillsSummary();

// Fallback content for when database content is not available
const fallbackBio = (
  <>
    <p className="text-lg">
      I&apos;m an analytics leader who believes the best data work happens when
      strategic thinking meets technical execution.
    </p>
    <p>
      With experience spanning data science, machine learning, and analytics
      leadership, I bring a unique perspective that combines hands-on technical
      capability with the ability to translate complex insights into business
      impact.
    </p>
    <p>
      Currently, I lead analytics initiatives at Merck, where I develop ML/AI
      solutions for business process optimization and partner with
      cross-functional teams to drive data-informed decision making.
    </p>
    <p>
      Outside of work, I build side projects that let me explore new
      technologies and stay sharp on the technical side. From algorithmic
      trading systems to full-stack web applications, these projects keep me
      connected to the craft of building software.
    </p>
  </>
);

export default async function AboutPage() {
  const [about, experiences] = await Promise.all([
    getAboutContent(),
    getExperiences(),
  ]);

  // Current role is the experience without an endDate
  const currentExperience = experiences.find((exp) => !exp.endDate);

  const title = about?.title ?? "About Me";
  // Derive current role/company from experiences (source of truth), fall back to about content, then hardcoded
  const currentRole =
    currentExperience?.role ??
    about?.currentRole ??
    "Associate Director, Data Science & Analytics";
  const currentCompany =
    currentExperience?.company ??
    about?.currentCompany ??
    "Merck";
  const focusAreas = about?.focusAreas ?? ["ML/AI", "Analytics", "Leadership"];
  const location = about?.location ?? "Roxbury Township, NJ";

  return (
    <>
      <Section className="pt-24 md:pt-32">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {title}
              <span className="mt-2 block h-1 w-16 rounded-full bg-foreground/20" />
            </h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
              {about?.body ? (
                <MDXContent code={about.body} />
              ) : (
                fallbackBio
              )}
            </div>
            <div className="mt-8 flex gap-4">
              <Button asChild>
                <Link href="/experience">
                  View Experience
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/projects">See Projects</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            {/* Headshot */}
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src="/static/images/headshot.webp"
                alt="Dan Haight"
                width={600}
                height={400}
                className="w-full object-cover"
                priority
              />
            </div>
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-semibold">Current Role</h2>
              <p className="mt-2 text-sm text-muted-foreground">{currentRole}</p>
              <p className="text-sm text-muted-foreground">{currentCompany}</p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-semibold">Location</h2>
              <p className="mt-2 text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-semibold">Focus Areas</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <Badge key={area} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative border-t border-border bg-muted/30">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <h2 className="text-2xl font-semibold tracking-tight">
          Skills & Technologies
          <span className="mt-2 block h-1 w-12 rounded-full bg-foreground/20" />
        </h2>
        <p className="mt-2 text-muted-foreground">
          Technical skills I use regularly in my work and side projects.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="flex items-center gap-2 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                {category}
              </h3>
              <ul className="mt-3 space-y-2">
                {items.map((skill) => (
                  <li key={skill} className="text-sm text-muted-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Let&apos;s Connect
          </h2>
          <p className="mt-4 text-muted-foreground">
            Interested in discussing analytics, data science, or potential
            opportunities? I&apos;d love to hear from you.
          </p>
          <Button asChild className="mt-6">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

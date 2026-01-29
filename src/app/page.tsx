import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { Section } from "@/components/layout";
import { ProjectCard } from "@/components/project-card";
import { getFeaturedProjects } from "@/lib/content";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-4">
            Analytics Leadership
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Building data-driven
            <span className="block text-muted-foreground">
              solutions that matter
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Analytics leader with hands-on technical depth in Python, SQL, and
            ML/AI. I bridge the gap between strategic vision and technical
            execution to deliver measurable business impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/projects">
                View Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Featured Projects Preview */}
      <Section className="border-t border-border bg-muted/30">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-2 text-muted-foreground">
              Technical projects demonstrating hands-on capability
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            View all projects &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/projects"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all projects &rarr;
          </Link>
        </div>
      </Section>

      {/* Brief About */}
      <Section>
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Technical Depth Meets Strategic Vision
            </h2>
            <p className="mt-4 text-muted-foreground">
              With experience spanning data science, machine learning, and
              analytics leadership, I bring a unique perspective that combines
              hands-on technical execution with strategic business impact.
            </p>
            <Button variant="ghost" asChild className="mt-4 -ml-4">
              <Link href="/about">
                More about me
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Python", desc: "ML & Data Engineering" },
              { label: "SQL", desc: "Analytics & Optimization" },
              { label: "ML/AI", desc: "Predictive Modeling" },
              { label: "Leadership", desc: "Team & Strategy" },
            ].map((skill) => (
              <div
                key={skill.label}
                className="rounded-lg border border-border p-4"
              >
                <div className="font-medium">{skill.label}</div>
                <div className="text-sm text-muted-foreground">{skill.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

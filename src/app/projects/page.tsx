import type { Metadata } from "next";
import { Section } from "@/components/layout";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects | Dan Haight",
  description:
    "Technical projects demonstrating hands-on capability in Python, ML/AI, and data engineering.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Section className="pt-24 md:pt-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Technical projects demonstrating hands-on capability in Python, ML/AI,
          and data engineering.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

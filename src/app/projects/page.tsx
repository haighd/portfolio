import type { Metadata } from "next";
import { Section } from "@/components/layout";
import { ProjectsFilter } from "@/components/projects-filter";
import { getAllProjectTechStack, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Technical projects demonstrating hands-on capability in Python, ML/AI, and data engineering.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const allTech = await getAllProjectTechStack();

  return (
    <Section className="pt-24 md:pt-32" data-pagefind-meta="type:page">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Technical projects demonstrating hands-on capability in Python, ML/AI,
          and data engineering.
        </p>
      </div>

      <h2 className="sr-only">All Projects</h2>
      <ProjectsFilter projects={projects} allTech={allTech} />
    </Section>
  );
}

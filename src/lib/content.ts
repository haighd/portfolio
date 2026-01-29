import { projects, experiences } from "#site/content";

export type Project = (typeof projects)[number];
export type Experience = (typeof experiences)[number];

export function getProjects() {
  return projects.sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects() {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getExperiences() {
  return experiences.sort((a, b) => a.order - b.order);
}

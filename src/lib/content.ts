import { projects, experiences, blog } from "#site/content";

export type Project = (typeof projects)[number];
export type Experience = (typeof experiences)[number];
export type BlogPost = (typeof blog)[number];

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

export function getBlogPosts() {
  return blog.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

export function getFeaturedBlogPosts() {
  return blog
    .filter((post) => post.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );
}

export function getBlogPostBySlug(slug: string) {
  return blog.find((post) => post.slug === slug);
}

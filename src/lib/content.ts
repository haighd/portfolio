import { projects, experiences, now, blog } from "#site/content";

export type Project = (typeof projects)[number];
export type Experience = (typeof experiences)[number];
export type Now = (typeof now)[number];
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

export function getNowContent() {
  return now[0];
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

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  const currentTags = new Set(currentPost.tags || []);
  if (currentTags.size === 0) {
    // No tags, return most recent posts excluding current
    return blog
      .filter((post) => post.slug !== currentSlug)
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
      )
      .slice(0, limit);
  }

  // Score posts by number of shared tags
  const scored = blog
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const postTags = post.tags || [];
      const sharedTags = postTags.filter((tag) => currentTags.has(tag)).length;
      return { post, score: sharedTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      // Primary: more shared tags first
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: more recent first
      return (
        new Date(b.post.publishedDate).getTime() -
        new Date(a.post.publishedDate).getTime()
      );
    });

  const related = scored.slice(0, limit).map(({ post }) => post);

  // If not enough related posts, fill with recent posts
  if (related.length < limit) {
    const relatedSlugs = new Set(related.map((p) => p.slug));
    const filler = blog
      .filter((p) => p.slug !== currentSlug && !relatedSlugs.has(p.slug))
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
      )
      .slice(0, limit - related.length);
    related.push(...filler);
  }

  return related;
}

import { projects, experiences, now, blog } from "#site/content";

// Feature flag for database content
const USE_DATABASE = process.env.DATABASE_CONTENT_ENABLED === "true";

// Lazy import for database content module (only loaded when USE_DATABASE is true)
async function getDbContent() {
  return import("./db-content");
}

// Export Velite types for backward compatibility
export type Project = (typeof projects)[number];
export type Experience = (typeof experiences)[number];
export type Now = (typeof now)[number];
export type BlogPost = (typeof blog)[number];

// Helper to sort by published date descending
const sortByPublishedDateDesc = (a: BlogPost, b: BlogPost) =>
  new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();

// ============================================================================
// Projects
// ============================================================================

export async function getProjects(): Promise<Project[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getProjects() as Promise<Project[]>;
  }
  return projects.sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getFeaturedProjects() as Promise<Project[]>;
  }
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getProjectBySlug(slug) as Promise<Project | undefined>;
  }
  return projects.find((p) => p.slug === slug);
}

export async function getAllProjectTechStack(): Promise<string[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getAllProjectTechStack();
  }
  const tech = new Set<string>();
  projects.forEach((p) => p.techStack?.forEach((t) => tech.add(t)));
  return Array.from(tech).sort();
}

// ============================================================================
// Experiences
// ============================================================================

export async function getExperiences(): Promise<Experience[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getExperiences() as Promise<Experience[]>;
  }
  return experiences.sort((a, b) => a.order - b.order);
}

// ============================================================================
// Now Content
// ============================================================================

export async function getNowContent(): Promise<Now | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getNowContent() as Promise<Now | undefined>;
  }
  return now[0];
}

// ============================================================================
// Blog Posts
// ============================================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getBlogPosts() as Promise<BlogPost[]>;
  }
  return blog.sort(sortByPublishedDateDesc);
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getFeaturedBlogPosts() as Promise<BlogPost[]>;
  }
  return blog.filter((post) => post.featured).sort(sortByPublishedDateDesc);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getBlogPostBySlug(slug) as Promise<BlogPost | undefined>;
  }
  return blog.find((post) => post.slug === slug);
}

export async function getAllBlogTags(): Promise<string[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getAllBlogTags();
  }
  const tags = new Set<string>();
  blog.forEach((post) =>
    post.tags?.forEach((tag) => tags.add(tag.toLowerCase()))
  );
  return Array.from(tags).sort();
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getPostsByTag(tag) as Promise<BlogPost[]>;
  }
  const lowercasedTag = tag.toLowerCase();
  return blog
    .filter((post) => post.tags?.some((t) => t.toLowerCase() === lowercasedTag))
    .sort(sortByPublishedDateDesc);
}

export async function getRelatedPosts(
  currentSlug: string,
  limit = 3
): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getRelatedPosts(currentSlug, limit) as Promise<BlogPost[]>;
  }

  const currentPost = blog.find((post) => post.slug === currentSlug);
  if (!currentPost) return [];

  const currentTags = new Set(currentPost.tags || []);
  if (currentTags.size === 0) {
    // No tags, return most recent posts excluding current
    return blog
      .filter((post) => post.slug !== currentSlug)
      .sort(sortByPublishedDateDesc)
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
      .sort(sortByPublishedDateDesc)
      .slice(0, limit - related.length);
    related.push(...filler);
  }

  return related;
}

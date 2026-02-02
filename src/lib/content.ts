// Feature flag for database content
const USE_DATABASE = process.env.DATABASE_CONTENT_ENABLED === "true";

// Velite content is dynamically imported only when DATABASE_CONTENT_ENABLED=false
let veliteContent: typeof import("#site/content") | null = null;

async function getVeliteContent() {
  if (!veliteContent) {
    veliteContent = await import("#site/content");
  }
  return veliteContent;
}

// Lazy import for database content module (only loaded when USE_DATABASE is true)
async function getDbContent() {
  return import("./db-content");
}

// Define types independently (compatible with both Velite and database formats)
// id is optional because Velite doesn't generate id fields
export type Project = {
  id?: string;
  title: string;
  description: string;
  slug: string;
  featured: boolean;
  order: number;
  techStack?: string[];
  github?: string | null;
  private?: boolean;
  liveUrl?: string | null;
  image?: string | null;
  challenge?: string | null;
  approach?: string | null;
  impact?: string | null;
  learnings?: string | null;
  body: string;
};

export type Experience = {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string | null;
  order: number;
  body: string;
};

export type Now = {
  id?: string;
  title: string;
  lastUpdated: string;
  body: string;
};

export type About = {
  id?: string;
  title: string;
  description: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  focusAreas: string[];
  body: string;
};

export type BlogPost = {
  id?: string;
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  updatedDate?: string;
  tags: string[];
  featured: boolean;
  readingTime?: number | string | null;
  body: string;
};

export type Uses = {
  id?: string;
  title: string;
  body: string;
};

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
  const velite = await getVeliteContent();
  return velite.projects.sort((a, b) => a.order - b.order) as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getFeaturedProjects() as Promise<Project[]>;
  }
  const velite = await getVeliteContent();
  return velite.projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order) as Project[];
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getProjectBySlug(slug) as Promise<Project | undefined>;
  }
  const velite = await getVeliteContent();
  return velite.projects.find((p) => p.slug === slug) as Project | undefined;
}

export async function getAllProjectTechStack(): Promise<string[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getAllProjectTechStack();
  }
  const velite = await getVeliteContent();
  const tech = new Set<string>();
  velite.projects.forEach((p) => p.techStack?.forEach((t) => tech.add(t)));
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
  const velite = await getVeliteContent();
  return velite.experiences.sort((a, b) => a.order - b.order) as Experience[];
}

// ============================================================================
// Now Content
// ============================================================================

export async function getNowContent(): Promise<Now | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getNowContent() as Promise<Now | undefined>;
  }
  const velite = await getVeliteContent();
  return velite.now[0] as Now | undefined;
}

// ============================================================================
// About Content
// ============================================================================

export async function getAboutContent(): Promise<About | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getAboutContent() as Promise<About | undefined>;
  }
  const velite = await getVeliteContent();
  return velite.about as About | undefined;
}

// ============================================================================
// Uses Content
// ============================================================================

export async function getUsesContent(): Promise<Uses | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getUsesContent() as Promise<Uses | undefined>;
  }
  const velite = await getVeliteContent();
  return velite.uses as Uses | undefined;
}

// ============================================================================
// Blog Posts
// ============================================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getBlogPosts() as Promise<BlogPost[]>;
  }
  const velite = await getVeliteContent();
  return (velite.blog as BlogPost[]).sort(sortByPublishedDateDesc);
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getFeaturedBlogPosts() as Promise<BlogPost[]>;
  }
  const velite = await getVeliteContent();
  return (velite.blog.filter((post) => post.featured) as BlogPost[]).sort(
    sortByPublishedDateDesc
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getBlogPostBySlug(slug) as Promise<BlogPost | undefined>;
  }
  const velite = await getVeliteContent();
  return velite.blog.find((post) => post.slug === slug) as
    | BlogPost
    | undefined;
}

export async function getAllBlogTags(): Promise<string[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getAllBlogTags();
  }
  const velite = await getVeliteContent();
  const tags = new Set<string>();
  velite.blog.forEach((post) =>
    post.tags?.forEach((tag) => tags.add(tag.toLowerCase()))
  );
  return Array.from(tags).sort();
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getPostsByTag(tag) as Promise<BlogPost[]>;
  }
  const velite = await getVeliteContent();
  const lowercasedTag = tag.toLowerCase();
  return (velite.blog as BlogPost[])
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

  const velite = await getVeliteContent();
  const blog = velite.blog as BlogPost[];
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

/**
 * Database content accessor layer
 * Mirrors the API of src/lib/content.ts for drop-in replacement
 */

import { getDb } from "@/db";
import {
  projects,
  experiences,
  blogPosts,
  skills,
  nowContent,
  certifications,
  type Project as DbProject,
  type Experience as DbExperience,
  type BlogPost as DbBlogPost,
  type Skill as DbSkill,
  type NowContent as DbNowContent,
  type Certification as DbCertification,
} from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// Types that match Velite's output format (dates as strings)
export type Project = Omit<DbProject, "createdAt" | "updatedAt">;
export type Experience = Omit<
  DbExperience,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate?: string;
};
export type BlogPost = Omit<
  DbBlogPost,
  "publishedDate" | "updatedDate" | "createdAt" | "updatedAt"
> & {
  publishedDate: string;
  updatedDate?: string;
};
export type Skill = Omit<DbSkill, "createdAt" | "updatedAt">;
export type Now = Omit<DbNowContent, "lastUpdated" | "createdAt" | "updatedAt"> & {
  lastUpdated: string;
};
export type Certification = Omit<DbCertification, "createdAt" | "updatedAt">;

// Helper to format date as ISO string (date only, no time)
// Handles both Date objects and string inputs from different database drivers
function formatDate(date: Date | string): string {
  // Create a new Date object to handle both Date and string types uniformly
  const d = new Date(date);

  // Check if the date is valid. `new Date('invalid-string')` results in an invalid date.
  if (isNaN(d.getTime())) {
    console.warn("Invalid date received, could not parse:", date);
    return new Date().toISOString().split("T")[0] as string;
  }

  // If valid, format as YYYY-MM-DD
  return d.toISOString().split("T")[0] as string;
}

// Helper to convert DB experience to Velite-compatible format
function toExperience(db: DbExperience): Experience {
  return {
    id: db.id,
    company: db.company,
    role: db.role,
    startDate: formatDate(db.startDate),
    endDate: db.endDate ? formatDate(db.endDate) : undefined,
    location: db.location,
    order: db.order,
    body: db.body,
  };
}

// Helper to convert DB blog post to Velite-compatible format
function toBlogPost(db: DbBlogPost): BlogPost {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    slug: db.slug,
    publishedDate: formatDate(db.publishedDate),
    updatedDate: db.updatedDate ? formatDate(db.updatedDate) : undefined,
    tags: db.tags,
    featured: db.featured,
    readingTime: db.readingTime,
    body: db.body,
  };
}

// Helper to convert DB now content to Velite-compatible format
function toNow(db: DbNowContent): Now {
  return {
    id: db.id,
    title: db.title,
    lastUpdated: formatDate(db.lastUpdated),
    body: db.body,
  };
}

// Cache configuration - longer revalidation for mostly static portfolio content
const CACHE_REVALIDATE =
  Number(process.env.CACHE_REVALIDATE_SECONDS) || 3600; // default: 1 hour

// ============================================================================
// Projects
// ============================================================================

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    return getDb().select().from(projects).orderBy(asc(projects.order));
  },
  ["db-projects"],
  { revalidate: CACHE_REVALIDATE }
);

export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    return getDb()
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(asc(projects.order));
  },
  ["db-featured-projects"],
  { revalidate: CACHE_REVALIDATE }
);

export const getProjectBySlug = async (
  slug: string
): Promise<Project | undefined> => {
  const cachedFn = unstable_cache(
    async (): Promise<Project | undefined> => {
      const result = await getDb()
        .select()
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);
      return result[0];
    },
    ["db-project-by-slug", slug],
    { revalidate: CACHE_REVALIDATE }
  );
  return cachedFn();
};

export const getAllProjectTechStack = unstable_cache(
  async (): Promise<string[]> => {
    // Use unnest to extract and deduplicate tech stack values at the database level
    const result = await getDb()
      .selectDistinct({ tech: sql<string>`unnest(${projects.techStack})` })
      .from(projects)
      .orderBy(sql`1`);
    return result.map((r) => r.tech);
  },
  ["db-project-tech-stack"],
  { revalidate: CACHE_REVALIDATE }
);

// ============================================================================
// Experiences
// ============================================================================

export const getExperiences = unstable_cache(
  async (): Promise<Experience[]> => {
    const result = await getDb()
      .select()
      .from(experiences)
      .orderBy(asc(experiences.order));
    return result.map(toExperience);
  },
  ["db-experiences"],
  { revalidate: CACHE_REVALIDATE }
);

// ============================================================================
// Now Content
// ============================================================================

export const getNowContent = unstable_cache(
  async (): Promise<Now | undefined> => {
    const result = await getDb().select().from(nowContent).limit(1);
    return result[0] ? toNow(result[0]) : undefined;
  },
  ["db-now-content"],
  { revalidate: CACHE_REVALIDATE }
);

// ============================================================================
// Blog Posts
// ============================================================================

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const result = await getDb()
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedDate));
    return result.map(toBlogPost);
  },
  ["db-blog-posts"],
  { revalidate: CACHE_REVALIDATE }
);

export const getFeaturedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const result = await getDb()
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.publishedDate));
    return result.map(toBlogPost);
  },
  ["db-featured-blog-posts"],
  { revalidate: CACHE_REVALIDATE }
);

export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPost | undefined> => {
  const cachedFn = unstable_cache(
    async (): Promise<BlogPost | undefined> => {
      const result = await getDb()
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);
      return result[0] ? toBlogPost(result[0]) : undefined;
    },
    ["db-blog-post-by-slug", slug],
    { revalidate: CACHE_REVALIDATE }
  );
  return cachedFn();
};

export const getAllBlogTags = unstable_cache(
  async (): Promise<string[]> => {
    // Use unnest to extract and deduplicate tags at the database level
    const result = await getDb()
      .selectDistinct({ tag: sql<string>`lower(unnest(${blogPosts.tags}))` })
      .from(blogPosts)
      .orderBy(sql`1`);
    return result.map((r) => r.tag);
  },
  ["db-all-blog-tags"],
  { revalidate: CACHE_REVALIDATE }
);

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  const lowercasedTag = tag.toLowerCase();
  const cachedFn = unstable_cache(
    async (): Promise<BlogPost[]> => {
      // Filter by tag at the database level using unnest for case-insensitive matching
      const result = await getDb().execute(sql`
        SELECT * FROM ${blogPosts}
        WHERE EXISTS (
          SELECT 1
          FROM unnest(${blogPosts.tags}) as t
          WHERE lower(t) = ${lowercasedTag}
        )
        ORDER BY ${blogPosts.publishedDate} DESC
      `);
      // Map raw SQL results to Velite-compatible format
      return (result as unknown as DbBlogPost[]).map(toBlogPost);
    },
    ["db-posts-by-tag", lowercasedTag],
    { revalidate: CACHE_REVALIDATE }
  );
  return cachedFn();
};

export const getRelatedPosts = async (
  currentSlug: string,
  limit = 3
): Promise<BlogPost[]> => {
  const cachedFn = unstable_cache(
    async (): Promise<BlogPost[]> => {
      const currentPost = await getBlogPostBySlug(currentSlug);
      if (!currentPost) return [];

      const currentTags = new Set(currentPost.tags || []);
      const allPosts = await getBlogPosts();

      if (currentTags.size === 0) {
        // No tags, return most recent posts excluding current
        return allPosts
          .filter((post) => post.slug !== currentSlug)
          .slice(0, limit);
      }

      // Score posts by number of shared tags
      const scored = allPosts
        .filter((post) => post.slug !== currentSlug)
        .map((post) => {
          const postTags = post.tags || [];
          const sharedTags = postTags.filter((tag) =>
            currentTags.has(tag)
          ).length;
          return { post, score: sharedTags };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => {
          // Primary: more shared tags first
          if (b.score !== a.score) return b.score - a.score;
          // Secondary: more recent first (timestamps are Date objects now)
          return (
            new Date(b.post.publishedDate).getTime() -
            new Date(a.post.publishedDate).getTime()
          );
        });

      const related = scored.slice(0, limit).map(({ post }) => post);

      // If not enough related posts, fill with recent posts
      if (related.length < limit) {
        const relatedSlugs = new Set(related.map((p) => p.slug));
        const filler = allPosts
          .filter((p) => p.slug !== currentSlug && !relatedSlugs.has(p.slug))
          .slice(0, limit - related.length);
        related.push(...filler);
      }

      return related;
    },
    ["db-related-posts", currentSlug, String(limit)],
    { revalidate: CACHE_REVALIDATE }
  );
  return cachedFn();
};

// ============================================================================
// Skills
// ============================================================================

export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    return getDb().select().from(skills).orderBy(asc(skills.category), asc(skills.order));
  },
  ["db-skills"],
  { revalidate: CACHE_REVALIDATE }
);

// ============================================================================
// Certifications
// ============================================================================

export const getCertifications = unstable_cache(
  async (): Promise<Certification[]> => {
    return getDb()
      .select()
      .from(certifications)
      .orderBy(asc(certifications.name));
  },
  ["db-certifications"],
  { revalidate: CACHE_REVALIDATE }
);

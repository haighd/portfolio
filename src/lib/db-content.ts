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

// Re-export types compatible with Velite types
export type Project = DbProject;
export type Experience = DbExperience;
export type BlogPost = DbBlogPost;
export type Skill = DbSkill;
export type Now = DbNowContent;
export type Certification = DbCertification;

// Cache configuration
const CACHE_REVALIDATE = 60; // 1 minute cache for dynamic content

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

export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | undefined> => {
    const result = await getDb()
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    return result[0];
  },
  ["db-project-by-slug"],
  { revalidate: CACHE_REVALIDATE }
);

export const getAllProjectTechStack = unstable_cache(
  async (): Promise<string[]> => {
    const allProjects = await getDb().select({ techStack: projects.techStack }).from(projects);
    const tech = new Set<string>();
    allProjects.forEach((p) => p.techStack?.forEach((t) => tech.add(t)));
    return Array.from(tech).sort();
  },
  ["db-project-tech-stack"],
  { revalidate: CACHE_REVALIDATE }
);

// ============================================================================
// Experiences
// ============================================================================

export const getExperiences = unstable_cache(
  async (): Promise<Experience[]> => {
    return getDb().select().from(experiences).orderBy(asc(experiences.order));
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
    return result[0];
  },
  ["db-now-content"],
  { revalidate: CACHE_REVALIDATE }
);

// ============================================================================
// Blog Posts
// ============================================================================

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    return getDb()
      .select()
      .from(blogPosts)
      .orderBy(desc(sql`${blogPosts.publishedDate}::date`));
  },
  ["db-blog-posts"],
  { revalidate: CACHE_REVALIDATE }
);

export const getFeaturedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    return getDb()
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(sql`${blogPosts.publishedDate}::date`));
  },
  ["db-featured-blog-posts"],
  { revalidate: CACHE_REVALIDATE }
);

export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | undefined> => {
    const result = await getDb()
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return result[0];
  },
  ["db-blog-post-by-slug"],
  { revalidate: CACHE_REVALIDATE }
);

export const getAllBlogTags = unstable_cache(
  async (): Promise<string[]> => {
    const allPosts = await getDb().select({ tags: blogPosts.tags }).from(blogPosts);
    const tags = new Set<string>();
    allPosts.forEach((post) =>
      post.tags?.forEach((tag) => tags.add(tag.toLowerCase()))
    );
    return Array.from(tags).sort();
  },
  ["db-all-blog-tags"],
  { revalidate: CACHE_REVALIDATE }
);

export const getPostsByTag = unstable_cache(
  async (tag: string): Promise<BlogPost[]> => {
    // Postgres array contains operator
    const lowercasedTag = tag.toLowerCase();
    const allPosts = await getBlogPosts();
    return allPosts.filter((post) =>
      post.tags?.some((t) => t.toLowerCase() === lowercasedTag)
    );
  },
  ["db-posts-by-tag"],
  { revalidate: CACHE_REVALIDATE }
);

export const getRelatedPosts = unstable_cache(
  async (currentSlug: string, limit = 3): Promise<BlogPost[]> => {
    const currentPost = await getBlogPostBySlug(currentSlug);
    if (!currentPost) return [];

    const currentTags = new Set(currentPost.tags || []);
    const allPosts = await getBlogPosts();

    if (currentTags.size === 0) {
      // No tags, return most recent posts excluding current
      return allPosts.filter((post) => post.slug !== currentSlug).slice(0, limit);
    }

    // Score posts by number of shared tags
    const scored = allPosts
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
      const filler = allPosts
        .filter((p) => p.slug !== currentSlug && !relatedSlugs.has(p.slug))
        .slice(0, limit - related.length);
      related.push(...filler);
    }

    return related;
  },
  ["db-related-posts"],
  { revalidate: CACHE_REVALIDATE }
);

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
    return getDb().select().from(certifications);
  },
  ["db-certifications"],
  { revalidate: CACHE_REVALIDATE }
);

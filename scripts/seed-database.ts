/**
 * Database seed script
 * Reads content from Velite JSON output and inserts into Postgres database
 *
 * Usage: bun run scripts/seed-database.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import * as fs from "fs";
import * as path from "path";
import { certifications as staticCertifications } from "../src/data/skills";

// Types for Velite JSON data
interface VeliteProject {
  title: string;
  description: string;
  slug: string;
  featured: boolean;
  order: number;
  techStack: string[];
  github?: string;
  private: boolean;
  liveUrl?: string;
  image?: string;
  challenge?: string;
  approach?: string;
  impact?: string;
  learnings?: string;
  body: string;
}

interface VeliteExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location: string;
  order: number;
  body: string;
}

interface VeliteBlogPost {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  updatedDate?: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  body: string;
}

interface VeliteSkill {
  name: string;
  category: string;
  categorySlug: string;
  proficiency: "expert" | "advanced" | "intermediate";
  order: number;
  body: string;
}

interface VeliteNow {
  title: string;
  lastUpdated: string;
  body: string;
}

interface VeliteAbout {
  title: string;
  description: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  focusAreas: string[];
  body: string;
}

interface VeliteUses {
  title: string;
  body: string;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  const veliteDir = path.join(process.cwd(), ".velite");

  console.log("Starting database seed...\n");

  // Check if Velite directory exists
  if (!fs.existsSync(veliteDir)) {
    console.error(
      `Error: Velite output directory not found at ${veliteDir}\n` +
        "Please run 'bun run build:velite' first to generate the content."
    );
    process.exit(1);
  }

  // Helper function to safely read Velite JSON files
  function readVeliteJson<T>(filename: string): T {
    const filePath = path.join(veliteDir, filename);
    if (!fs.existsSync(filePath)) {
      console.error(
        `Error: Velite output file not found: ${filePath}\n` +
          "Please run 'bun run build:velite' first to generate the content."
      );
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // Read Velite JSON files
  const projectsData = readVeliteJson<VeliteProject[]>("projects.json");
  const experiencesData = readVeliteJson<VeliteExperience[]>("experiences.json");
  const blogData = readVeliteJson<VeliteBlogPost[]>("blog.json");
  const skillsData = readVeliteJson<VeliteSkill[]>("skills.json");
  const nowData = readVeliteJson<VeliteNow[]>("now.json");
  const aboutData = readVeliteJson<VeliteAbout>("about.json");
  const usesData = readVeliteJson<VeliteUses>("uses.json");

  // Seed projects
  console.log(`Seeding ${projectsData.length} projects...`);
  for (const project of projectsData) {
    await db
      .insert(schema.projects)
      .values({
        title: project.title,
        description: project.description,
        slug: project.slug,
        featured: project.featured,
        order: project.order,
        techStack: project.techStack,
        github: project.github ?? null,
        private: project.private,
        liveUrl: project.liveUrl ?? null,
        image: project.image ?? null,
        challenge: project.challenge ?? null,
        approach: project.approach ?? null,
        impact: project.impact ?? null,
        learnings: project.learnings ?? null,
        body: project.body,
      })
      .onConflictDoUpdate({
        target: schema.projects.slug,
        set: {
          title: project.title,
          description: project.description,
          featured: project.featured,
          order: project.order,
          techStack: project.techStack,
          github: project.github ?? null,
          private: project.private,
          liveUrl: project.liveUrl ?? null,
          image: project.image ?? null,
          challenge: project.challenge ?? null,
          approach: project.approach ?? null,
          impact: project.impact ?? null,
          learnings: project.learnings ?? null,
          body: project.body,
          updatedAt: new Date(),
        },
      });
  }
  console.log("  Projects seeded successfully");

  // Seed experiences using upsert with unique constraint
  console.log(`Seeding ${experiencesData.length} experiences...`);
  for (const exp of experiencesData) {
    await db
      .insert(schema.experiences)
      .values({
        company: exp.company,
        role: exp.role,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        location: exp.location,
        order: exp.order,
        body: exp.body,
      })
      .onConflictDoUpdate({
        target: [
          schema.experiences.company,
          schema.experiences.role,
          schema.experiences.startDate,
        ],
        set: {
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          location: exp.location,
          order: exp.order,
          body: exp.body,
          updatedAt: new Date(),
        },
      });
  }
  console.log("  Experiences seeded successfully");

  // Seed blog posts
  console.log(`Seeding ${blogData.length} blog posts...`);
  for (const post of blogData) {
    await db
      .insert(schema.blogPosts)
      .values({
        title: post.title,
        description: post.description,
        slug: post.slug,
        publishedDate: new Date(post.publishedDate),
        updatedDate: post.updatedDate ? new Date(post.updatedDate) : null,
        tags: post.tags,
        featured: post.featured,
        readingTime: post.readingTime,
        body: post.body,
      })
      .onConflictDoUpdate({
        target: schema.blogPosts.slug,
        set: {
          title: post.title,
          description: post.description,
          publishedDate: new Date(post.publishedDate),
          updatedDate: post.updatedDate ? new Date(post.updatedDate) : null,
          tags: post.tags,
          featured: post.featured,
          readingTime: post.readingTime,
          body: post.body,
          updatedAt: new Date(),
        },
      });
  }
  console.log("  Blog posts seeded successfully");

  // Seed skills
  console.log(`Seeding ${skillsData.length} skills...`);
  for (const skill of skillsData) {
    await db
      .insert(schema.skills)
      .values({
        name: skill.name,
        category: skill.category,
        categorySlug: skill.categorySlug,
        proficiency: skill.proficiency,
        order: skill.order,
        body: skill.body,
      })
      .onConflictDoUpdate({
        target: schema.skills.name,
        set: {
          category: skill.category,
          categorySlug: skill.categorySlug,
          proficiency: skill.proficiency,
          order: skill.order,
          body: skill.body,
          updatedAt: new Date(),
        },
      });
  }
  console.log("  Skills seeded successfully");

  // Seed now content (singleton)
  console.log(`Seeding now content...`);
  await db.delete(schema.nowContent);
  const nowItem = nowData[0];
  if (nowItem) {
    await db.insert(schema.nowContent).values({
      title: nowItem.title,
      lastUpdated: new Date(nowItem.lastUpdated),
      body: nowItem.body,
    });
  }
  console.log("  Now content seeded successfully");

  // Seed about content (singleton)
  console.log(`Seeding about content...`);
  await db.delete(schema.aboutContent);
  if (aboutData) {
    await db.insert(schema.aboutContent).values({
      title: aboutData.title,
      description: aboutData.description,
      currentRole: aboutData.currentRole,
      currentCompany: aboutData.currentCompany,
      location: aboutData.location,
      focusAreas: aboutData.focusAreas,
      body: aboutData.body,
    });
  }
  console.log("  About content seeded successfully");

  // Seed uses content (singleton)
  console.log(`Seeding uses content...`);
  await db.delete(schema.usesContent);
  if (usesData) {
    await db.insert(schema.usesContent).values({
      title: usesData.title,
      body: usesData.body,
    });
  }
  console.log("  Uses content seeded successfully");

  // Seed certifications (imported from src/data/skills.ts for single source of truth)
  console.log(`Seeding ${staticCertifications.length} certifications...`);
  await db.delete(schema.certifications);
  for (const cert of staticCertifications) {
    await db.insert(schema.certifications).values({
      name: cert.name,
      abbreviation: cert.abbreviation,
      issuer: cert.issuer,
    });
  }
  console.log("  Certifications seeded successfully");

  // Summary
  console.log("\n--- Seed Summary ---");
  console.log(`Projects: ${projectsData.length}`);
  console.log(`Experiences: ${experiencesData.length}`);
  console.log(`Blog posts: ${blogData.length}`);
  console.log(`Skills: ${skillsData.length}`);
  console.log(`Now content: ${nowData.length}`);
  console.log(`About content: ${aboutData ? 1 : 0}`);
  console.log(`Uses content: ${usesData ? 1 : 0}`);
  console.log(`Certifications: ${staticCertifications.length}`);
  console.log("\nDatabase seeded successfully!");

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

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

  // Read Velite JSON files
  const projectsData: VeliteProject[] = JSON.parse(
    fs.readFileSync(path.join(veliteDir, "projects.json"), "utf-8")
  );
  const experiencesData: VeliteExperience[] = JSON.parse(
    fs.readFileSync(path.join(veliteDir, "experiences.json"), "utf-8")
  );
  const blogData: VeliteBlogPost[] = JSON.parse(
    fs.readFileSync(path.join(veliteDir, "blog.json"), "utf-8")
  );
  const skillsData: VeliteSkill[] = JSON.parse(
    fs.readFileSync(path.join(veliteDir, "skills.json"), "utf-8")
  );
  const nowData: VeliteNow[] = JSON.parse(
    fs.readFileSync(path.join(veliteDir, "now.json"), "utf-8")
  );

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

  // Seed experiences
  console.log(`Seeding ${experiencesData.length} experiences...`);
  // Clear existing experiences first (no unique constraint)
  await db.delete(schema.experiences);
  for (const exp of experiencesData) {
    await db.insert(schema.experiences).values({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate ?? null,
      location: exp.location,
      order: exp.order,
      body: exp.body,
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
        publishedDate: post.publishedDate,
        updatedDate: post.updatedDate ?? null,
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
          publishedDate: post.publishedDate,
          updatedDate: post.updatedDate ?? null,
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
      lastUpdated: nowItem.lastUpdated,
      body: nowItem.body,
    });
  }
  console.log("  Now content seeded successfully");

  // Seed certifications
  console.log(`Seeding certifications...`);
  const certifications = [
    {
      name: "Six Sigma Black Belt",
      abbreviation: "SSBB",
      issuer: "American Society for Quality (ASQ)",
    },
    {
      name: "Certified in Planning and Inventory Management",
      abbreviation: "CPIM",
      issuer: "Association for Supply Chain Management (ASCM/APICS)",
    },
    {
      name: "Certified Professional",
      abbreviation: "CP",
      issuer: "Association of Clinical Research Professionals (ACRP)",
    },
  ];

  await db.delete(schema.certifications);
  for (const cert of certifications) {
    await db.insert(schema.certifications).values(cert);
  }
  console.log("  Certifications seeded successfully");

  // Summary
  console.log("\n--- Seed Summary ---");
  console.log(`Projects: ${projectsData.length}`);
  console.log(`Experiences: ${experiencesData.length}`);
  console.log(`Blog posts: ${blogData.length}`);
  console.log(`Skills: ${skillsData.length}`);
  console.log(`Now content: ${nowData.length}`);
  console.log(`Certifications: ${certifications.length}`);
  console.log("\nDatabase seeded successfully!");

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

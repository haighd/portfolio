import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Enums
export const proficiencyEnum = pgEnum("proficiency", [
  "expert",
  "advanced",
  "intermediate",
]);

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  techStack: text("tech_stack").array().notNull().default([]),
  github: text("github"),
  private: boolean("private").notNull().default(false),
  liveUrl: text("live_url"),
  image: text("image"),
  // Case study fields
  challenge: text("challenge"),
  approach: text("approach"),
  impact: text("impact"),
  learnings: text("learnings"),
  // MDX content (compiled JS function string)
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Experiences table
export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    company: text("company").notNull(),
    role: text("role").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    location: text("location").notNull(),
    order: integer("order").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    // Unique constraint for idempotent seeding
    companyRoleStartIdx: uniqueIndex("experiences_company_role_start_unique").on(
      table.company,
      table.role,
      table.startDate
    ),
  })
);

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  publishedDate: timestamp("published_date").notNull(),
  updatedDate: timestamp("updated_date"),
  tags: text("tags").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  readingTime: integer("reading_time").notNull().default(1),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Skills table
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  categorySlug: text("category_slug").notNull(),
  proficiency: proficiencyEnum("proficiency").notNull(),
  order: integer("order").notNull().default(0),
  body: text("body").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Now content table (singleton pattern)
export const nowContent = pgTable("now_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// About content table (singleton pattern)
export const aboutContent = pgTable("about_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  currentRole: text("current_role").notNull(),
  currentCompany: text("current_company").notNull(),
  location: text("location").notNull(),
  focusAreas: text("focus_areas").array().notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Certifications table
export const certifications = pgTable("certifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
  issuer: text("issuer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Type exports for use in application code
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type NowContent = typeof nowContent.$inferSelect;
export type NewNowContent = typeof nowContent.$inferInsert;

export type AboutContent = typeof aboutContent.$inferSelect;
export type NewAboutContent = typeof aboutContent.$inferInsert;

export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;

import { defineConfig, defineCollection, s } from "velite";

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string(),
    slug: s.slug("projects"),
    featured: s.boolean().default(false),
    order: s.number().default(0),
    techStack: s.array(s.string()),
    github: s.string().optional(),
    liveUrl: s.string().optional(),
    image: s.string().optional(),
    body: s.mdx(),
  }),
});

const experiences = defineCollection({
  name: "Experience",
  pattern: "experience/**/*.mdx",
  schema: s.object({
    company: s.string(),
    role: s.string(),
    startDate: s.string(),
    endDate: s.string().optional(),
    location: s.string(),
    order: s.number(),
    body: s.mdx(),
  }),
});

const blog = defineCollection({
  name: "BlogPost",
  pattern: "blog/**/*.mdx",
  schema: s.object({
    title: s.string().max(100),
    description: s.string().max(200),
    slug: s.slug("blog"),
    publishedDate: s.string(),
    updatedDate: s.string().optional(),
    tags: s.array(s.string()).default([]),
    featured: s.boolean().default(false),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects, experiences, blog },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

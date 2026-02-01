// Migration script to generate skill MDX files from existing data
// Run with: bun run scripts/migrate-skills.ts

import { writeFileSync, mkdirSync } from "fs";

// Skills data copied from src/data/skills.ts
const proficiencyOrder = {
  expert: 0,
  advanced: 1,
  intermediate: 2,
} as const;

type Proficiency = keyof typeof proficiencyOrder;

type Skill = {
  name: string;
  proficiency: Proficiency;
};

type SkillCategory = {
  name: string;
  description: string;
  skills: Skill[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    description: "Programming and query languages",
    skills: [
      { name: "Python", proficiency: "expert" },
      { name: "SQL", proficiency: "expert" },
      { name: "R", proficiency: "expert" },
      { name: "VBA", proficiency: "expert" },
      { name: "Power M", proficiency: "expert" },
      { name: "DAX", proficiency: "expert" },
      { name: "JavaScript", proficiency: "advanced" },
      { name: "Bash/Shell", proficiency: "advanced" },
      { name: "TypeScript", proficiency: "intermediate" },
      { name: "Java", proficiency: "intermediate" },
      { name: "MATLAB", proficiency: "intermediate" },
      { name: "SAS", proficiency: "intermediate" },
    ],
  },
  {
    name: "Frameworks & Libraries",
    description: "Development frameworks and data libraries",
    skills: [
      { name: "R Shiny", proficiency: "expert" },
      { name: "R tidyverse", proficiency: "expert" },
      { name: "pandas", proficiency: "expert" },
      { name: "NumPy", proficiency: "expert" },
      { name: "Quarto", proficiency: "expert" },
      { name: "scikit-learn", proficiency: "advanced" },
      { name: "React", proficiency: "intermediate" },
      { name: "FastAPI", proficiency: "intermediate" },
      { name: "Next.js", proficiency: "intermediate" },
      { name: "Vue.js", proficiency: "intermediate" },
      { name: "dbt", proficiency: "intermediate" },
    ],
  },
  {
    name: "Data Science & Analytics",
    description: "Machine learning, statistics, and analytics",
    skills: [
      { name: "Machine Learning", proficiency: "expert" },
      { name: "Statistical Modeling", proficiency: "expert" },
      { name: "Data Visualization", proficiency: "expert" },
      { name: "Business Intelligence", proficiency: "expert" },
      { name: "Operations Research", proficiency: "expert" },
      { name: "A/B Testing", proficiency: "expert" },
      { name: "Predictive Modeling", proficiency: "expert" },
      { name: "Time Series Analysis", proficiency: "expert" },
      { name: "Data Mining", proficiency: "expert" },
      { name: "Experiment Design", proficiency: "expert" },
      { name: "Data Engineering", proficiency: "intermediate" },
      { name: "ETL Pipelines", proficiency: "intermediate" },
      { name: "NLP", proficiency: "intermediate" },
      { name: "Computer Vision", proficiency: "intermediate" },
      { name: "Recommendation Systems", proficiency: "intermediate" },
      { name: "Deep Learning", proficiency: "intermediate" },
      { name: "Causal Inference", proficiency: "intermediate" },
    ],
  },
  {
    name: "Platforms & Infrastructure",
    description: "Databases, cloud services, and DevOps",
    skills: [
      { name: "PostgreSQL", proficiency: "expert" },
      { name: "MySQL", proficiency: "expert" },
      { name: "SQL Server", proficiency: "expert" },
      { name: "Google Cloud Platform", proficiency: "expert" },
      { name: "Railway", proficiency: "expert" },
      { name: "Redshift", proficiency: "expert" },
      { name: "Linux", proficiency: "expert" },
      { name: "Azure", proficiency: "advanced" },
      { name: "Git/GitHub", proficiency: "advanced" },
      { name: "MongoDB", proficiency: "intermediate" },
      { name: "Redis", proficiency: "intermediate" },
      { name: "Docker", proficiency: "intermediate" },
      { name: "Kubernetes", proficiency: "intermediate" },
      { name: "AWS", proficiency: "intermediate" },
      { name: "Vercel", proficiency: "intermediate" },
      { name: "Heroku", proficiency: "intermediate" },
      { name: "Databricks", proficiency: "intermediate" },
      { name: "BigQuery", proficiency: "intermediate" },
    ],
  },
  {
    name: "Tools",
    description: "Software and development environments",
    skills: [
      { name: "Power BI", proficiency: "expert" },
      { name: "Excel", proficiency: "expert" },
      { name: "Jupyter", proficiency: "expert" },
      { name: "VS Code", proficiency: "expert" },
      { name: "RStudio", proficiency: "expert" },
      { name: "Positron", proficiency: "expert" },
      { name: "Power Apps", proficiency: "advanced" },
      { name: "JIRA", proficiency: "advanced" },
      { name: "Confluence", proficiency: "advanced" },
      { name: "Tableau", proficiency: "intermediate" },
      { name: "Figma", proficiency: "intermediate" },
      { name: "Postman", proficiency: "intermediate" },
    ],
  },
  {
    name: "Leadership & Operations",
    description: "Management, strategy, and process improvement",
    skills: [
      { name: "Team Management", proficiency: "expert" },
      { name: "Strategy Development", proficiency: "expert" },
      { name: "Stakeholder Communication", proficiency: "expert" },
      { name: "Mentorship", proficiency: "expert" },
      { name: "Project Management", proficiency: "expert" },
      { name: "Cross-functional Collaboration", proficiency: "expert" },
      { name: "Hiring & Interviewing", proficiency: "expert" },
      { name: "Budget Management", proficiency: "expert" },
      { name: "Vendor Management", proficiency: "expert" },
      { name: "Change Management", proficiency: "expert" },
      { name: "Six Sigma", proficiency: "expert" },
      { name: "Lean", proficiency: "expert" },
      { name: "Kaizen", proficiency: "expert" },
      { name: "Inventory Management", proficiency: "expert" },
      { name: "Technical Writing", proficiency: "advanced" },
      { name: "Public Speaking", proficiency: "advanced" },
      { name: "Good Clinical Practice", proficiency: "advanced" },
      { name: "Agile/Scrum", proficiency: "intermediate" },
    ],
  },
];

// Sort skills by proficiency, then alphabetically
const sortSkills = (skills: Skill[]): Skill[] =>
  [...skills].sort((a, b) => {
    const profDiff = proficiencyOrder[a.proficiency] - proficiencyOrder[b.proficiency];
    if (profDiff !== 0) return profDiff;
    return a.name.localeCompare(b.name);
  });

// Generate URL-friendly slug
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[&\s]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-");

let totalFiles = 0;

for (const category of skillCategories) {
  const categorySlug = slugify(category.name);
  const dir = `src/content/skills/${categorySlug}`;
  mkdirSync(dir, { recursive: true });

  const sortedSkills = sortSkills(category.skills);

  sortedSkills.forEach((skill, index) => {
    const skillSlug = slugify(skill.name);
    const content = `---
name: "${skill.name}"
category: "${category.name}"
categorySlug: "${categorySlug}"
proficiency: "${skill.proficiency}"
order: ${index + 1}
---
`;
    writeFileSync(`${dir}/${skillSlug}.mdx`, content);
    totalFiles++;
  });

  console.log(`✓ ${category.name}: ${sortedSkills.length} skills`);
}

console.log(`\n✓ Migration complete! Created ${totalFiles} skill files.`);

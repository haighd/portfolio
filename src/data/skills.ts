// Shared skills utilities and certifications data
// Skills content now lives in src/content/skills/*.mdx (Velite collection)
// or in the database when DATABASE_CONTENT_ENABLED=true
// Used by: /skills, /about

import { skills } from "#site/content";

const USE_DATABASE = process.env.DATABASE_CONTENT_ENABLED === "true";

// Lazy import for database content module (only loaded when USE_DATABASE is true)
async function getDbContent() {
  return import("@/lib/db-content");
}

export const proficiencyLevels = ["expert", "advanced", "intermediate"] as const;
export type Proficiency = (typeof proficiencyLevels)[number];

export type Certification = {
  name: string;
  issuer: string;
  abbreviation: string;
};

// Static certifications (also available in database)
export const certifications: Certification[] = [
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

// Curated skills summary for the about page
// This is an intentionally small subset showcasing key skills
const skillsSummary: Record<string, string[]> = {
  "Languages & Tools": ["Python", "SQL", "TypeScript", "React", "FastAPI"],
  "Data & ML": [
    "Machine Learning",
    "Statistical Modeling",
    "Data Engineering",
    "ETL Pipelines",
  ],
  Platforms: ["PostgreSQL", "Docker", "AWS", "Railway"],
  Leadership: [
    "Team Management",
    "Strategy Development",
    "Stakeholder Communication",
    "Mentorship",
  ],
};

// Development-time validation: ensure summary skills exist in the Velite collection
// Only runs with Velite (not database) to avoid async complexity
if (process.env.NODE_ENV !== "production" && !USE_DATABASE) {
  const allSkillNames = skills.map((s) => s.name);
  const summarySkills = Object.values(skillsSummary).flat();

  for (const skill of summarySkills) {
    if (!allSkillNames.includes(skill)) {
      console.warn(
        `[Skills Data Inconsistency] The skill '${skill}' from the 'about' page summary does not exist in the Velite skills collection.`
      );
    }
  }
}

export function getSkillsSummary(): Record<string, string[]> {
  return skillsSummary;
}

// Export skills getter that supports both Velite and database
export async function getSkills() {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    return dbContent.getSkills();
  }
  return skills;
}

// Export certifications getter that supports both static and database
export async function getCertifications(): Promise<Certification[]> {
  if (USE_DATABASE) {
    const dbContent = await getDbContent();
    const dbCerts = await dbContent.getCertifications();
    return dbCerts.map((c) => ({
      name: c.name,
      abbreviation: c.abbreviation,
      issuer: c.issuer,
    }));
  }
  return certifications;
}

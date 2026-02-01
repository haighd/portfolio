// Shared skills utilities and certifications data
// Skills content now lives in src/content/skills/*.mdx (Velite collection)
// Used by: /skills, /about

export const proficiencyLevels = ["expert", "advanced", "intermediate"] as const;
export type Proficiency = (typeof proficiencyLevels)[number];

export const proficiencyVariant: Record<Proficiency, "expert" | "advanced" | "intermediate"> = {
  expert: "expert",
  advanced: "advanced",
  intermediate: "intermediate",
};

export type Certification = {
  name: string;
  issuer: string;
  abbreviation: string;
};

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
export function getSkillsSummary(): Record<string, string[]> {
  return {
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
}

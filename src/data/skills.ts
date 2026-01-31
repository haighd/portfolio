// Shared skills and certifications data
// Used by: /skills, /about

export const proficiencyLevels = ["expert", "advanced", "intermediate"] as const;
export type Proficiency = (typeof proficiencyLevels)[number];

export type Skill = {
  name: string;
  proficiency: Proficiency;
};

export type SkillCategory = {
  name: string;
  description: string;
  skills: Skill[];
};

export const proficiencyOrder: Record<Proficiency, number> = {
  expert: 0,
  advanced: 1,
  intermediate: 2,
};

export const proficiencyVariant: Record<Proficiency, "default" | "secondary" | "outline"> = {
  expert: "default",
  advanced: "secondary",
  intermediate: "outline",
};

export const sortSkills = (skills: Skill[]): Skill[] =>
  [...skills].sort((a, b) => {
    const profDiff = proficiencyOrder[a.proficiency] - proficiencyOrder[b.proficiency];
    if (profDiff !== 0) return profDiff;
    return a.name.localeCompare(b.name);
  });

export const skillCategories: SkillCategory[] = [
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

// Pre-sorted skill categories for direct use in components
export const sortedSkillCategories = skillCategories.map((category) => ({
  ...category,
  skills: sortSkills(category.skills),
}));

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

// Helper to get a simplified skills summary for the about page
// Returns top skills from key categories
export function getSkillsSummary(): Record<string, string[]> {
  const findCategory = (name: string) =>
    skillCategories.find((c) => c.name === name);

  const getTopSkills = (category: SkillCategory | undefined, count: number) =>
    category
      ? sortSkills(category.skills)
          .slice(0, count)
          .map((s) => s.name)
      : [];

  const languages = findCategory("Languages");
  const frameworks = findCategory("Frameworks & Libraries");
  const dataScience = findCategory("Data Science & Analytics");
  const platforms = findCategory("Platforms & Infrastructure");
  const leadership = findCategory("Leadership & Operations");

  return {
    "Languages & Tools": [
      ...getTopSkills(languages, 2),
      ...getTopSkills(frameworks, 2).slice(0, 1),
      "TypeScript",
      "React",
      "FastAPI",
    ].slice(0, 5),
    "Data & ML": getTopSkills(dataScience, 4),
    Platforms: getTopSkills(platforms, 4),
    Leadership: getTopSkills(leadership, 4),
  };
}

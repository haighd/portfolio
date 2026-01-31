import type { Metadata } from "next";
import { Section } from "@/components/layout";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Skills & Certifications",
  description:
    "Technical expertise and professional certifications across data, engineering, and leadership.",
};

const proficiencyLevels = ["expert", "advanced", "intermediate"] as const;
type Proficiency = (typeof proficiencyLevels)[number];

type Skill = {
  name: string;
  proficiency: Proficiency;
};

const proficiencyOrder: Record<Proficiency, number> = {
  expert: 0,
  advanced: 1,
  intermediate: 2,
};

const sortSkills = (skills: Skill[]): Skill[] =>
  [...skills].sort((a, b) => {
    const profDiff = proficiencyOrder[a.proficiency] - proficiencyOrder[b.proficiency];
    if (profDiff !== 0) return profDiff;
    return a.name.localeCompare(b.name);
  });

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

// Pre-sort skills by proficiency then alphabetically (avoids sorting on each render)
const sortedSkillCategories = skillCategories.map((category) => ({
  ...category,
  skills: sortSkills(category.skills),
}));

type Certification = {
  name: string;
  issuer: string;
  abbreviation: string;
};

const certifications: Certification[] = [
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

export default function SkillsPage() {
  return (
    <Section className="pt-24 md:pt-32">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Skills & Certifications
          <span className="mt-2 block h-1 w-16 rounded-full bg-foreground/20" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Technical expertise and professional certifications across data, engineering, and leadership.
        </p>
      </div>

      {/* Skill categories grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {sortedSkillCategories.map((category) => (
          <div key={category.name} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={skill.proficiency}
                >
                  {skill.name}
                  <span className="sr-only">
                    {" "}
                    ({skill.proficiency} proficiency)
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>Proficiency:</span>
        {proficiencyLevels.map((level) => (
          <Badge key={level} variant={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Certifications */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Certifications
          <span className="mt-2 block h-1 w-12 rounded-full bg-foreground/20" />
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div key={cert.abbreviation} className="rounded-lg border p-4">
              <div className="font-medium">
                {cert.name} ({cert.abbreviation})
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {cert.issuer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

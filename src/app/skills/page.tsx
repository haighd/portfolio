import type { Metadata } from "next";
import { Section } from "@/components/layout";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical expertise across data, engineering, and leadership.",
};

const proficiencyLevels = ["expert", "advanced", "intermediate"] as const;
type Proficiency = (typeof proficiencyLevels)[number];

type Skill = {
  name: string;
  proficiency: Proficiency;
};

const proficiencyVariantMap: Record<Proficiency, "default" | "secondary" | "outline"> = {
  expert: "default",
  advanced: "secondary",
  intermediate: "outline",
};

type SkillCategory = {
  name: string;
  description: string;
  skills: Skill[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Languages & Tools",
    description: "Core programming languages and development tools",
    skills: [
      { name: "Python", proficiency: "expert" },
      { name: "SQL", proficiency: "expert" },
      { name: "R", proficiency: "expert" },
      { name: "R Shiny", proficiency: "expert" },
      { name: "R - tidyverse", proficiency: "expert" },
      { name: "VBA", proficiency: "expert" },
      { name: "Power BI", proficiency: "expert" },
      { name: "Power Apps", proficiency: "advanced" },
      { name: "TypeScript", proficiency: "advanced" },
      { name: "React", proficiency: "advanced" },
      { name: "FastAPI", proficiency: "advanced" },
    ],
  },
  {
    name: "Data & ML",
    description: "Machine learning, analytics, and data engineering",
    skills: [
      { name: "Machine Learning", proficiency: "expert" },
      { name: "Statistical Modeling", proficiency: "expert" },
      { name: "Data Engineering", proficiency: "expert" },
      { name: "Data Visualization", proficiency: "expert" },
      { name: "Business Intelligence", proficiency: "expert" },
      { name: "Operations Research", proficiency: "expert" },
      { name: "ETL Pipelines", proficiency: "advanced" },
    ],
  },
  {
    name: "Platforms",
    description: "Infrastructure, databases, and cloud services",
    skills: [
      { name: "PostgreSQL", proficiency: "expert" },
      { name: "Docker", proficiency: "advanced" },
      { name: "AWS", proficiency: "advanced" },
      { name: "Railway", proficiency: "intermediate" },
    ],
  },
  {
    name: "Leadership",
    description: "Team management and strategic capabilities",
    skills: [
      { name: "Team Management", proficiency: "expert" },
      { name: "Strategy Development", proficiency: "expert" },
      { name: "Stakeholder Communication", proficiency: "expert" },
      { name: "Mentorship", proficiency: "advanced" },
    ],
  },
];

export default function SkillsPage() {
  return (
    <Section className="pt-24 md:pt-32">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Skills
          <span className="mt-2 block h-1 w-16 rounded-full bg-foreground/20" />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Technical expertise across data, engineering, and leadership.
        </p>
      </div>

      {/* Skill categories grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {skillCategories.map((category) => (
          <div key={category.name} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={proficiencyVariantMap[skill.proficiency]}
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
          <Badge key={level} variant={proficiencyVariantMap[level]}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        ))}
      </div>
    </Section>
  );
}

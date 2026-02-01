import type { Metadata } from "next";
import { skills } from "#site/content";
import { Section } from "@/components/layout";
import { Badge } from "@/components/ui";
import {
  proficiencyLevels,
  proficiencyVariant,
  certifications,
  type Proficiency,
} from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills & Certifications",
  description:
    "Technical expertise and professional certifications across data, engineering, and leadership.",
};

// Category display configuration
const categoryOrder = [
  "Languages",
  "Frameworks & Libraries",
  "Data Science & Analytics",
  "Platforms & Infrastructure",
  "Tools",
  "Leadership & Operations",
];

const categoryDescriptions: Record<string, string> = {
  Languages: "Programming and query languages",
  "Frameworks & Libraries": "Development frameworks and data libraries",
  "Data Science & Analytics": "Machine learning, statistics, and analytics",
  "Platforms & Infrastructure": "Databases, cloud services, and DevOps",
  Tools: "Software and development environments",
  "Leadership & Operations": "Management, strategy, and process improvement",
};

// Group skills by category
const skillsByCategory: Record<string, (typeof skills)[number][]> = {};
for (const skill of skills) {
  const cat = skill.category;
  if (!skillsByCategory[cat]) {
    skillsByCategory[cat] = [];
  }
  skillsByCategory[cat]!.push(skill);
}

// Sort skills within each category by order
for (const categorySkills of Object.values(skillsByCategory)) {
  categorySkills.sort((a, b) => a.order - b.order);
}

// Create ordered categories array
const sortedCategories = categoryOrder
  .filter((cat) => cat in skillsByCategory)
  .map((cat) => ({
    name: cat,
    description: categoryDescriptions[cat],
    skills: skillsByCategory[cat]!,
  }));

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
        {sortedCategories.map((category) => (
          <div key={category.name} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={proficiencyVariant[skill.proficiency as Proficiency]}
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
          <Badge key={level} variant={proficiencyVariant[level]}>
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

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Project } from "@/lib/content";
import { Badge, Button } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";

interface ProjectsFilterProps {
  projects: Project[];
  allTech: string[];
}

type SortOption = "default" | "featured" | "alphabetical";

export function ProjectsFilter({ projects, allTech }: ProjectsFilterProps) {
  const [selectedTech, setSelectedTech] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Filter logic
  const filtered = projects.filter((p) => {
    if (selectedTech.size === 0) return true;
    return p.techStack?.some((t) => selectedTech.has(t));
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return a.order - b.order;
    }
  });

  const toggleTech = (tech: string) => {
    const next = new Set(selectedTech);
    if (next.has(tech)) next.delete(tech);
    else next.add(tech);
    setSelectedTech(next);
  };

  const clearFilters = () => {
    setSelectedTech(new Set());
    setSortBy("default");
  };

  const hasFilters = selectedTech.size > 0 || sortBy !== "default";

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {allTech.map((tech) => (
            <Badge
              key={tech}
              variant={selectedTech.has(tech) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleTech(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-background rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="default">Default order</option>
            <option value="featured">Featured first</option>
            <option value="alphabetical">A-Z</option>
          </select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-muted-foreground py-8 text-center">
          No projects match the selected filters.
        </p>
      )}
    </>
  );
}

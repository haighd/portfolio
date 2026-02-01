import type { ReactNode } from "react";

interface CaseStudySectionProps {
  title: string;
  content: string;
  icon?: ReactNode;
}

export function CaseStudySection({ title, content, icon }: CaseStudySectionProps) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
        {icon}
        {title}
      </h3>
      <p className="text-muted-foreground leading-7">{content}</p>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
  containerSize?: "default" | "narrow" | "wide";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    { className, container = true, containerSize = "default", children, ...props },
    ref
  ) => {
    return (
      <section ref={ref} className={cn("py-16 md:py-24", className)} {...props}>
        {container ? (
          <Container size={containerSize}>{children}</Container>
        ) : (
          children
        )}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };

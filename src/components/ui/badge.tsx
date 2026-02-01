import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        secondary: "bg-muted text-muted-foreground",
        outline: "border border-border text-foreground",
        accent: "bg-accent/10 text-accent",
        expert: "bg-teal-100 text-teal-900 dark:bg-teal-800 dark:text-teal-100",
        advanced:
          "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
        intermediate:
          "bg-purple-100 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

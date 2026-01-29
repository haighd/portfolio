import * as React from "react";
import { cn } from "@/lib/utils";

interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {}

const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base prose styles
        "[&>*]:mb-4 [&>*:last-child]:mb-0",
        // Headings
        "[&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-medium",
        // Paragraphs
        "[&_p]:leading-7 [&_p]:text-muted-foreground",
        // Lists
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
        "[&_li]:text-muted-foreground [&_li]:leading-7",
        // Links
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-accent/80",
        // Code
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono",
        "[&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // Blockquotes
        "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic",
        // Strong/Bold
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className
      )}
      {...props}
    />
  )
);
Prose.displayName = "Prose";

export { Prose };

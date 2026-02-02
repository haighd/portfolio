"use client";

import { Search } from "lucide-react";

interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-2"
      aria-label="Search (⌘K)"
    >
      <Search className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

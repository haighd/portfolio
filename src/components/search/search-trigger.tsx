"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { SearchDialog } from "./search-dialog";

export function SearchTrigger() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-2"
        aria-label="Search (⌘K)"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

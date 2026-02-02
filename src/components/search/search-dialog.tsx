"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Folder, Briefcase, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/use-focus-trap";

// Search configuration constants
const DEBOUNCE_DELAY_MS = 200;
const MAX_SEARCH_RESULTS = 10;
const FOCUS_DELAY_MS = 50;

interface PagefindResult {
  url: string;
  meta: {
    title?: string;
    type?: string;
  };
  excerpt: string;
}

interface PagefindSearchResult {
  id: string;
  data: () => Promise<PagefindResult>;
}

interface PagefindResponse {
  results: PagefindSearchResult[];
}

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  type: "blog" | "project" | "page";
}

function getResultType(
  meta: PagefindResult["meta"],
  url: string
): SearchResult["type"] {
  // Prefer meta type if available
  if (meta.type === "blog") return "blog";
  if (meta.type === "project") return "project";
  if (meta.type === "page") return "page";

  // Fallback to URL-based detection for backwards compatibility
  if (url.startsWith("/blog/")) return "blog";
  if (url.startsWith("/projects/")) return "project";
  return "page";
}

function getTypeIcon(type: SearchResult["type"]) {
  switch (type) {
    case "blog":
      return FileText;
    case "project":
      return Folder;
    default:
      return Briefcase;
  }
}

function getTypeLabel(type: SearchResult["type"]) {
  switch (type) {
    case "blog":
      return "Blog";
    case "project":
      return "Project";
    default:
      return "Page";
  }
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pagefind, setPagefind] = React.useState<{
    search: (query: string) => Promise<PagefindResponse>;
  } | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsContainerRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Trap focus within dialog and restore on close
  useFocusTrap(dialogRef, open);

  // Load Pagefind on mount
  React.useEffect(() => {
    async function loadPagefind() {
      if (typeof window === "undefined") return;

      try {
        // Use dynamic import to bypass Next.js bundler
        const pagefindPath = "/pagefind/pagefind.js";
        const pf = await (Function(
          `return import("${pagefindPath}")`
        )() as Promise<{
          search: (query: string) => Promise<PagefindResponse>;
        }>);
        setPagefind(pf);
      } catch {
        console.warn("Pagefind not available - search will not work");
      }
    }
    loadPagefind();
  }, []);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      // Small delay to ensure dialog is rendered
      setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
    }
  }, [open]);

  // Search when query changes
  React.useEffect(() => {
    const search = async () => {
      if (!pagefind || !query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await pagefind.search(query);
        const searchResults = await Promise.all(
          response.results.slice(0, MAX_SEARCH_RESULTS).map(async (result) => {
            const data = await result.data();
            return {
              url: data.url,
              title: data.meta?.title || "Untitled",
              excerpt: data.excerpt,
              type: getResultType(data.meta, data.url),
            };
          })
        );
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, DEBOUNCE_DELAY_MS);
    return () => clearTimeout(debounce);
  }, [query, pagefind]);

  // Global keyboard shortcut
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcut in input fields
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable)
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Scroll selected result into view
  React.useEffect(() => {
    if (resultsContainerRef.current?.children[selectedIndex]) {
      resultsContainerRef.current.children[selectedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation within dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Guard: don't navigate if no results
    if (
      results.length === 0 &&
      (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")
    ) {
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  };

  const navigateToResult = (result: SearchResult) => {
    onOpenChange(false);
    router.push(result.url);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="bg-background/80 fixed inset-0 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed top-[20%] left-1/2 w-full max-w-lg -translate-x-1/2 px-4">
        <div
          ref={dialogRef}
          className="border-border bg-background overflow-hidden rounded-lg border shadow-lg"
        >
          {/* Search input */}
          <div className="border-border flex items-center border-b px-4">
            <Search
              className="text-muted-foreground h-5 w-5 shrink-0"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent px-3 text-sm outline-none"
              aria-label="Search"
              aria-autocomplete="list"
              aria-controls="search-results"
            />
            {isLoading && (
              <Loader2
                className="text-muted-foreground h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground ml-2 rounded p-1"
              aria-label="Close search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Results */}
          <div
            ref={resultsContainerRef}
            id="search-results"
            className="max-h-[300px] overflow-y-auto"
            role="listbox"
            aria-label="Search results"
          >
            {query.trim() && results.length === 0 && !isLoading && (
              <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                No results found for &quot;{query}&quot;
              </p>
            )}

            {results.map((result, index) => {
              const Icon = getTypeIcon(result.type);
              return (
                <button
                  key={result.url}
                  onClick={() => navigateToResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                    index === selectedIndex && "bg-muted"
                  )}
                >
                  <Icon
                    className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">
                        {result.title}
                      </span>
                      <span className="bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 text-xs">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p
                      className="text-muted-foreground mt-0.5 line-clamp-2 text-sm"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="border-border text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs">
            <span>
              <kbd className="border-border rounded border px-1.5 py-0.5 font-mono">
                ↑↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="border-border rounded border px-1.5 py-0.5 font-mono">
                ↵
              </kbd>{" "}
              to select
            </span>
            <span>
              <kbd className="border-border rounded border px-1.5 py-0.5 font-mono">
                esc
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

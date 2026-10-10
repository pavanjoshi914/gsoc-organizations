import React, { useEffect, useState } from 'react';
import { Search, Bookmark, BarChart3, Moon, Sun, Scale, ExternalLink, Sparkles, Github, Star } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookmarkedCount: number;
  compareCount: number;
  onOpenBookmarks: () => void;
  onOpenCompare: () => void;
  onOpenAnalytics: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  totalOrgsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  bookmarkedCount,
  compareCount,
  onOpenBookmarks,
  onOpenCompare,
  onOpenAnalytics,
  darkMode,
  onToggleTheme,
  totalOrgsCount,
}) => {
  const [starCount, setStarCount] = useState<number | null>(176);

  useEffect(() => {
    fetch('https://api.github.com/repos/pavanjoshi914/GSoC_archive')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // keep fallback 176
      });
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 shadow-md shadow-orange-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground">GSoC Orgs</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                2016–2026
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Analyze all {totalOrgsCount} Google Summer of Code organizations
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search organizations, technologies (e.g. Python, C++, React)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-border bg-muted/40 py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              compareCount > 0
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Compare organizations"
          >
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {compareCount}
              </span>
            )}
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className={`relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              bookmarkedCount > 0
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Shortlisted Organizations"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Shortlist</span>
            {bookmarkedCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Analytics / Insights */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="View 11-Year Insights & Analytics"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </button>

          {/* GSoC Archive GitHub Repository with Star Button */}
          <a
            href="https://github.com/pavanjoshi914/GSoC_archive"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-amber-500/50 hover:bg-amber-500/5 transition-all shadow-xs"
            title="Star GSoC Archive on GitHub (Accepted Proposals Across Years)"
          >
            <Github className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
            <span className="hidden md:inline font-semibold">GSoC Archive</span>
            <span className="flex items-center gap-1 rounded bg-muted/80 group-hover:bg-amber-500/15 group-hover:text-amber-500 px-1.5 py-0.5 text-xs font-mono font-bold text-muted-foreground transition-colors">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{starCount !== null ? starCount : 'Star'}</span>
            </span>
          </a>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};


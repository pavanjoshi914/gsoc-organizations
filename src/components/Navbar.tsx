import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  Bookmark,
  BarChart3,
  Moon,
  Sun,
  Scale,
  Sparkles,
  Github,
  Star,
  Sprout,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookmarkedCount: number;
  compareCount: number;
  onOpenBookmarks: () => void;
  onOpenCompare: () => void;
  onOpenAnalytics: () => void;
  onOpenMethodology?: () => void;
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
  onOpenMethodology,
  darkMode,
  onToggleTheme,
  totalOrgsCount,
}) => {
  const [starCount, setStarCount] = useState<number | null>(279);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/pavanjoshi914/GSoC_archive')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // fallback 279
      });
  }, []);

  // Close mobile menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 shadow-md shadow-orange-500/20">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
                GSoC Orgs
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-primary border border-primary/20 whitespace-nowrap">
                2016–2026
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden 2xl:block truncate max-w-xs">
              Analyze all {totalOrgsCount} Google Summer of Code organizations
            </p>
          </div>
        </div>

        {/* Global Search Bar (Guaranteed minimum width so text is always fully visible) */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[240px] md:min-w-[280px] max-w-xs lg:max-w-sm xl:max-w-md hidden md:block mx-2">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search organizations, tech..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full min-w-0 rounded-full border border-border bg-muted/50 py-1.5 pl-9 pr-14 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`relative flex h-9 items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              compareCount > 0
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Compare organizations"
            aria-label="Compare organizations"
          >
            <Scale className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">Compare</span>
            {compareCount > 0 && (
              <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shrink-0">
                {compareCount}
              </span>
            )}
          </button>

          {/* Bookmarks / Shortlist */}
          <button
            onClick={onOpenBookmarks}
            className={`relative flex h-9 items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              bookmarkedCount > 0
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Shortlisted Organizations"
            aria-label="Shortlisted Organizations"
          >
            <Bookmark className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">Shortlist</span>
            {bookmarkedCount > 0 && (
              <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shrink-0">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Beginner Friendly Methodology (hidden on mobile, in more menu) */}
          {onOpenMethodology && (
            <button
              onClick={onOpenMethodology}
              className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              title="How Beginner Friendliness is Scored"
              aria-label="Beginner Guide"
            >
              <Sprout className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="inline xl:hidden">Guide</span>
              <span className="hidden xl:inline">Beginner Guide</span>
            </button>
          )}

          {/* Analytics / Insights (hidden on mobile, in more menu) */}
          <button
            onClick={onOpenAnalytics}
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="View 11-Year Insights & Analytics"
            aria-label="11-Year Insights"
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">Insights</span>
          </button>

          {/* GSoC Archive GitHub Repo with Star Button (hidden on mobile, in more menu) */}
          <a
            href="https://github.com/pavanjoshi914/GSoC_archive"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden sm:flex h-9 items-center gap-1.5 sm:gap-2 rounded-lg border border-border bg-card px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-foreground hover:border-amber-500/50 hover:bg-amber-500/5 transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            title="Star GSoC Archive on GitHub (Accepted Proposals Across Years)"
            aria-label="Star GSoC Archive on GitHub"
          >
            <Github className="h-4 w-4 text-foreground group-hover:text-primary transition-colors shrink-0" />
            <span className="hidden xl:inline font-semibold">GSoC Archive</span>
            <span className="flex items-center gap-1 rounded bg-muted/80 group-hover:bg-amber-500/15 group-hover:text-amber-500 px-1.5 py-0.5 text-[11px] font-mono font-bold text-muted-foreground transition-colors shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{starCount !== null ? starCount : 'Star'}</span>
            </span>
          </a>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Button (visible on mobile < sm) */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex sm:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="More Options"
            aria-label="Open mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer / Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="sm:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 shadow-xl space-y-1.5 animate-in slide-in-from-top-2 duration-150"
        >
          {onOpenMethodology && (
            <button
              onClick={() => {
                onOpenMethodology();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sprout className="h-4 w-4 text-emerald-500" />
                <span>Beginner Friendliness Guide & Formula</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          <button
            onClick={() => {
              onOpenAnalytics();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>11-Year Insights & Analytics</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <a
            href="https://github.com/pavanjoshi914/GSoC_archive"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Github className="h-4 w-4" />
              <span>GSoC Archive on GitHub</span>
            </div>
            <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono font-bold text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{starCount !== null ? starCount : 'Star'}</span>
            </span>
          </a>
        </div>
      )}
    </header>
  );
};

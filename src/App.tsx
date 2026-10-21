import React, { useEffect, useState, useMemo } from 'react';
import {
  Filter,
  Layers,
  Sparkles,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Info,
  ArrowUpDown,
  Github,
  Twitter,
  Linkedin,
  Heart,
} from 'lucide-react';
import { OrganizationSummary, FilterState } from './types';
import { Navbar } from './components/Navbar';
import { FilterSidebar } from './components/FilterSidebar';
import { OrganizationCard } from './components/OrganizationCard';
import { OrganizationDetailModal } from './components/OrganizationDetailModal';
import { CompareModal } from './components/CompareModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ShortlistModal } from './components/ShortlistModal';
import { BeginnerMethodologyModal } from './components/BeginnerMethodologyModal';

export const App: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme (Dark mode default)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('gsoc_theme_preference');
      if (saved) return saved === 'dark';
      // Always default to dark mode
      return true;
    } catch {
      return true;
    }
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedYears: [],
    selectedCategory: null,
    selectedTech: [],
    selectedTopics: [],
    minProjects: 0,
    onlyActiveLatest: false,
    veteransOnly: false,
    bookmarkedOnly: false,
    beginnerFriendlyOnly: false,
    selectedBeginnerTier: null,
    sortBy: 'name',
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gsoc_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare List
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Selected Org for Detail Modal
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(null);

  // Modals
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Pagination (load 24 per page for instant smooth rendering)
  const [visibleCount, setVisibleCount] = useState(24);

  // Effect to apply dark mode class to html
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('gsoc_theme_preference', 'dark');
      localStorage.setItem('gsoc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gsoc_theme_preference', 'light');
      localStorage.setItem('gsoc_theme', 'light');
    }
  }, [darkMode]);

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('gsoc_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Load organizations dataset
  useEffect(() => {
    setLoading(true);
    fetch('/data/organizations.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dataset');
        return res.json();
      })
      .then((data: OrganizationSummary[]) => {
        setOrganizations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading organizations:', err);
        setLoading(false);
      });
  }, []);

  // Compute Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    organizations.forEach((org) => {
      counts[org.category] = (counts[org.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [organizations]);

  // Compute Top Technologies with counts
  const topTechnologiesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    organizations.forEach((org) => {
      org.technologies.forEach((tech) => {
        counts[tech] = (counts[tech] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count);
  }, [organizations]);

  const allYears = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  // Toggle Bookmark
  const toggleBookmark = (org: OrganizationSummary) => {
    setBookmarkedIds((prev) =>
      prev.includes(org.id) ? prev.filter((id) => id !== org.id) : [...prev, org.id]
    );
  };

  // Toggle Compare
  const toggleCompare = (org: OrganizationSummary) => {
    setComparedIds((prev) => {
      if (prev.includes(org.id)) {
        return prev.filter((id) => id !== org.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 organizations at a time.');
        return prev;
      }
      return [...prev, org.id];
    });
  };

  // Filter tech handler
  const handleFilterByTech = (tech: string) => {
    if (!filters.selectedTech.includes(tech)) {
      setFilters((prev) => ({
        ...prev,
        selectedTech: [...prev.selectedTech, tech],
      }));
    }
  };

  // Filter year toggle handler
  const handleFilterByYear = (year: string) => {
    setFilters((prev) => {
      const exists = prev.selectedYears.includes(year);
      return {
        ...prev,
        selectedYears: exists
          ? prev.selectedYears.filter((y) => y !== year)
          : [...prev.selectedYears, year],
      };
    });
  };

  // Filtered & Sorted Organizations
  const filteredOrganizations = useMemo(() => {
    return organizations
      .filter((org) => {
        // Search text
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = org.name.toLowerCase().includes(q);
          const matchDesc = org.description.toLowerCase().includes(q);
          const matchTech = org.technologies.some((t) => t.toLowerCase().includes(q));
          const matchTopics = org.topics.some((top) => top.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTech && !matchTopics) {
            return false;
          }
        }

        // Years filter (must match ANY selected year)
        if (filters.selectedYears.length > 0) {
          const matchesYear = filters.selectedYears.some((y) => org.years.includes(y));
          if (!matchesYear) return false;
        }

        // Category filter
        if (filters.selectedCategory && org.category !== filters.selectedCategory) {
          return false;
        }

        // Tech filter (must match all selected technologies)
        if (filters.selectedTech.length > 0) {
          const matchesAllTech = filters.selectedTech.every((t) => org.technologies.includes(t));
          if (!matchesAllTech) return false;
        }

        // Beginner Friendliness filter
        if (filters.beginnerFriendlyOnly && (org.beginner_friendly?.score || 0) < 70) {
          return false;
        }

        // Beginner Tier filter
        if (filters.selectedBeginnerTier && org.beginner_friendly?.tier !== filters.selectedBeginnerTier) {
          return false;
        }

        // Quick Highlights
        if (filters.onlyActiveLatest && !org.years.includes('2026')) {
          return false;
        }

        if (filters.veteransOnly && org.years_count < 8) {
          return false;
        }

        if (filters.bookmarkedOnly && !bookmarkedIds.includes(org.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'beginner-desc') {
          return (b.beginner_friendly?.score || 0) - (a.beginner_friendly?.score || 0);
        }
        if (filters.sortBy === 'projects-desc') {
          return b.total_projects - a.total_projects;
        }
        if (filters.sortBy === 'years-desc') {
          return b.years_count - a.years_count;
        }
        if (filters.sortBy === 'latest') {
          const aLatest = a.years[a.years.length - 1] || '0';
          const bLatest = b.years[b.years.length - 1] || '0';
          return bLatest.localeCompare(aLatest);
        }
        return a.name.localeCompare(b.name);
      });
  }, [organizations, filters, bookmarkedIds]);

  // Bookmarked Orgs List
  const bookmarkedOrgs = useMemo(() => {
    return organizations.filter((org) => bookmarkedIds.includes(org.id));
  }, [organizations, bookmarkedIds]);

  // Compared Orgs List
  const comparedOrgs = useMemo(() => {
    return organizations.filter((org) => comparedIds.includes(org.id));
  }, [organizations, comparedIds]);

  // Reset pagination visible count when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [filters]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.search}
        onSearchChange={(query) => setFilters((prev) => ({ ...prev, search: query }))}
        bookmarkedCount={bookmarkedIds.length}
        compareCount={comparedIds.length}
        onOpenBookmarks={() => setShowShortlistModal(true)}
        onOpenCompare={() => setShowCompareModal(true)}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
        onOpenMethodology={() => setShowMethodologyModal(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        totalOrgsCount={organizations.length}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Search & Filter Toolbar */}
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search organizations or tech..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-14 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setShowMobileFilter(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Hero Banner Header */}
        <div className="mb-8 rounded-2xl border border-border/80 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Google Summer of Code Complete Archive (2016–2026)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Find Your Dream GSoC Organization
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Analyze past accepted student proposals, project slot volumes, and tech stacks across all 519 organizations to maximize your chances of acceptance.
              </p>
            </div>

            {/* Quick Hero Counters */}
            <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-border/80 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">519</span>
                <p className="text-xs text-muted-foreground">Organizations</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-primary font-mono">12K+</span>
                <p className="text-xs text-muted-foreground">Student Projects</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">183</span>
                <p className="text-xs text-muted-foreground">In 2026 Edition</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="flex items-start gap-8">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            categoriesWithCounts={categoriesWithCounts}
            topTechnologiesWithCounts={topTechnologiesWithCounts}
            allYears={allYears}
            totalFilteredCount={filteredOrganizations.length}
            totalAllCount={organizations.length}
            isOpenMobile={showMobileFilter}
            onCloseMobile={() => setShowMobileFilter(false)}
            onOpenMethodology={() => setShowMethodologyModal(true)}
          />

          {/* Organization Cards Feed */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Pills Bar */}
            {(filters.selectedCategory ||
              filters.selectedYears.length > 0 ||
              filters.selectedTech.length > 0 ||
              filters.onlyActiveLatest ||
              filters.veteransOnly ||
              filters.bookmarkedOnly ||
              filters.beginnerFriendlyOnly ||
              filters.selectedBeginnerTier ||
              filters.search) && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs select-none">
                <span className="text-muted-foreground font-medium">Active:</span>

                {filters.search && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-foreground">
                    Search: "{filters.search}"
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                      className="hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.beginnerFriendlyOnly && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 font-medium">
                    Beginner Friendly (70+)
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, beginnerFriendlyOnly: false }))}
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.selectedBeginnerTier && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1 font-medium">
                    Tier: {filters.selectedBeginnerTier}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, selectedBeginnerTier: null }))}
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.selectedCategory && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1 font-medium">
                    Category: {filters.selectedCategory}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, selectedCategory: null }))}
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.selectedYears.map((yr) => (
                  <span
                    key={yr}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-foreground"
                  >
                    Year: {yr}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedYears: prev.selectedYears.filter((y) => y !== yr),
                        }))
                      }
                      className="hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {filters.selectedTech.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-md bg-muted font-mono px-2 py-1 text-foreground"
                  >
                    {tech}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedTech: prev.selectedTech.filter((t) => t !== tech),
                        }))
                      }
                      className="hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {filters.onlyActiveLatest && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-500 px-2 py-1 font-medium">
                    Active in 2026
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, onlyActiveLatest: false }))}
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.veteransOnly && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-foreground">
                    Veterans Only
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, veteransOnly: false }))}
                      className="hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.bookmarkedOnly && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-500 px-2 py-1 font-medium">
                    Shortlisted Only
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, bookmarkedOnly: false }))}
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      selectedYears: [],
                      selectedCategory: null,
                      selectedTech: [],
                      selectedTopics: [],
                      minProjects: 0,
                      onlyActiveLatest: false,
                      veteransOnly: false,
                      bookmarkedOnly: false,
                      beginnerFriendlyOnly: false,
                      selectedBeginnerTier: null,
                      sortBy: 'name',
                    })
                  }
                  className="text-primary hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Organizations Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-xl border border-border bg-card p-5 animate-pulse flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-20 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-4/5 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-full bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : filteredOrganizations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredOrganizations.slice(0, visibleCount).map((org) => (
                    <OrganizationCard
                      key={org.id}
                      org={org}
                      isBookmarked={bookmarkedIds.includes(org.id)}
                      isCompared={comparedIds.includes(org.id)}
                      selectedYears={filters.selectedYears}
                      onToggleBookmark={toggleBookmark}
                      onToggleCompare={toggleCompare}
                      onSelect={(target) => setSelectedOrg(target)}
                      onFilterByTech={handleFilterByTech}
                      onFilterByYear={handleFilterByYear}
                      onOpenMethodology={() => setShowMethodologyModal(true)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredOrganizations.length && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:border-primary/40 transition-all shadow-sm"
                    >
                      <span>Show More Organizations</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Showing {Math.min(visibleCount, filteredOrganizations.length)} of {filteredOrganizations.length}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-dashed border-border p-12 text-center select-none cursor-default">
                <Layers className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-lg font-bold text-foreground">No organizations match your criteria</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                  Try clearing some filter tags or searching for broader terms like "python", "ai", or "web".
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      selectedYears: [],
                      selectedCategory: null,
                      selectedTech: [],
                      selectedTopics: [],
                      minProjects: 0,
                      onlyActiveLatest: false,
                      veteransOnly: false,
                      bookmarkedOnly: false,
                      beginnerFriendlyOnly: false,
                      selectedBeginnerTier: null,
                      sortBy: 'name',
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card/60 py-10 text-xs text-muted-foreground backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50">
            {/* Branding & Attribution */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="font-bold text-foreground text-sm tracking-tight">GSoC Organizations Pro</span>
              <span className="hidden sm:inline text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1.5 text-foreground/90 font-medium">
                Made with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 inline animate-pulse" /> by{' '}
                <a
                  href="https://pavanjoshi.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-foreground hover:text-primary underline decoration-primary/40 underline-offset-4 transition-colors"
                >
                  Pavan Joshi
                </a>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/pavanjoshi914"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                title="Pavan Joshi on GitHub"
              >
                <Github className="h-3.5 w-3.5" />
                <span className="font-medium">GitHub</span>
              </a>

              <a
                href="https://twitter.com/PavanJ1620"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                title="Pavan Joshi on Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
                <span className="font-medium">Twitter</span>
              </a>

              <a
                href="https://www.linkedin.com/in/pavan-joshi-177873192/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                title="Pavan Joshi on LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span className="font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Subfooter */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span>
              All 519 organizations & 12,095 projects verified against Google Summer of Code (2016–2026).
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://summerofcode.withgoogle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Official Google Summer of Code
              </a>
              <span>•</span>
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="hover:text-primary transition-colors font-medium"
              >
                11-Year Insights
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OrganizationDetailModal
        org={selectedOrg}
        onClose={() => setSelectedOrg(null)}
        isBookmarked={selectedOrg ? bookmarkedIds.includes(selectedOrg.id) : false}
        isCompared={selectedOrg ? comparedIds.includes(selectedOrg.id) : false}
        onToggleBookmark={toggleBookmark}
        onToggleCompare={toggleCompare}
        onOpenMethodology={() => setShowMethodologyModal(true)}
      />

      {showCompareModal && (
        <CompareModal
          comparedOrgs={comparedOrgs}
          onClose={() => setShowCompareModal(false)}
          onRemove={(id) => setComparedIds((prev) => prev.filter((i) => i !== id))}
          onClear={() => setComparedIds([])}
          onSelect={(org) => setSelectedOrg(org)}
        />
      )}

      {showAnalyticsModal && (
        <AnalyticsModal
          organizations={organizations}
          onClose={() => setShowAnalyticsModal(false)}
          onSelectOrg={(org) => setSelectedOrg(org)}
          onFilterByTech={handleFilterByTech}
        />
      )}

      {showShortlistModal && (
        <ShortlistModal
          bookmarkedOrgs={bookmarkedOrgs}
          onClose={() => setShowShortlistModal(false)}
          onRemoveBookmark={toggleBookmark}
          onClearAll={() => setBookmarkedIds([])}
          onSelectOrg={(org) => setSelectedOrg(org)}
        />
      )}

      <BeginnerMethodologyModal
        isOpen={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
      />
    </div>
  );
};
export default App;


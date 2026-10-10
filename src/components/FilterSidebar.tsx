import React, { useState } from 'react';
import { Filter, X, RotateCcw, Search, Check, Layers, Calendar, Code, Cpu } from 'lucide-react';
import { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categoriesWithCounts: { category: string; count: number }[];
  topTechnologiesWithCounts: { tech: string; count: number }[];
  allYears: string[];
  totalFilteredCount: number;
  totalAllCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  categoriesWithCounts,
  topTechnologiesWithCounts,
  allYears,
  totalFilteredCount,
  totalAllCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [techSearch, setTechSearch] = useState('');

  const toggleYear = (year: string) => {
    const exists = filters.selectedYears.includes(year);
    const newYears = exists
      ? filters.selectedYears.filter((y) => y !== year)
      : [...filters.selectedYears, year];
    onChange({ ...filters, selectedYears: newYears });
  };

  const toggleTech = (tech: string) => {
    const exists = filters.selectedTech.includes(tech);
    const newTech = exists
      ? filters.selectedTech.filter((t) => t !== tech)
      : [...filters.selectedTech, tech];
    onChange({ ...filters, selectedTech: newTech });
  };

  const resetFilters = () => {
    onChange({
      search: '',
      selectedYears: [],
      selectedCategory: null,
      selectedTech: [],
      selectedTopics: [],
      minProjects: 0,
      onlyActiveLatest: false,
      veteransOnly: false,
      bookmarkedOnly: false,
      sortBy: 'name',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.selectedYears.length > 0 ||
    filters.selectedCategory !== null ||
    filters.selectedTech.length > 0 ||
    filters.onlyActiveLatest ||
    filters.veteransOnly ||
    filters.bookmarkedOnly;

  const filteredTechList = topTechnologiesWithCounts.filter((item) =>
    item.tech.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-card border-r border-border p-5 transition-transform duration-300 ease-in-out lg:static lg:block lg:w-72 lg:translate-x-0 lg:p-0 lg:border-none lg:bg-transparent ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col gap-5 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                Filter & Sort
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={onCloseMobile}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Result Count Banner */}
          <div className="rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground border border-border/50 flex justify-between items-center">
            <span>Showing organizations:</span>
            <span className="font-bold text-foreground">
              {totalFilteredCount} <span className="font-normal text-muted-foreground">/ {totalAllCount}</span>
            </span>
          </div>

          {/* Quick Filters */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Highlights
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={filters.onlyActiveLatest}
                  onChange={(e) => onChange({ ...filters, onlyActiveLatest: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 accent-primary"
                />
                <span className="font-medium text-amber-500">Active in 2026 Edition</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={filters.veteransOnly}
                  onChange={(e) => onChange({ ...filters, veteransOnly: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 accent-primary"
                />
                <span>Veterans (8+ Years Active)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={filters.bookmarkedOnly}
                  onChange={(e) => onChange({ ...filters, bookmarkedOnly: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 accent-primary"
                />
                <span>Shortlisted / Bookmarked Only</span>
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sort By
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="name">Name (A to Z)</option>
              <option value="projects-desc">Total Projects / Slots (Highest First)</option>
              <option value="years-desc">Consistency (Most Years Active)</option>
              <option value="latest">Latest Edition Participation</option>
            </select>
          </div>

          {/* Years Multi-Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Calendar className="h-3 w-3" />
              <span>Years Participated</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allYears.slice().reverse().map((year) => {
                const isSelected = filters.selectedYears.includes(year);
                return (
                  <button
                    key={year}
                    onClick={() => toggleYear(year)}
                    className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Layers className="h-3 w-3" />
              <span>Category</span>
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              <button
                onClick={() => onChange({ ...filters, selectedCategory: null })}
                className={`w-full flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition-colors ${
                  filters.selectedCategory === null
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] text-muted-foreground">{totalAllCount}</span>
              </button>

              {categoriesWithCounts.map(({ category, count }) => {
                const isSelected = filters.selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => onChange({ ...filters, selectedCategory: isSelected ? null : category })}
                    className={`w-full flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="truncate pr-2 font-medium" title={category}>{category}</span>
                    <span className="shrink-0 text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technologies Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                <span>Technologies</span>
              </div>
              {filters.selectedTech.length > 0 && (
                <button
                  onClick={() => onChange({ ...filters, selectedTech: [] })}
                  className="text-[10px] text-primary hover:underline lowercase font-normal"
                >
                  clear ({filters.selectedTech.length})
                </button>
              )}
            </div>

            {/* Tech Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter languages / tech..."
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-card py-1 pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {filteredTechList.slice(0, 35).map(({ tech, count }) => {
                const isSelected = filters.selectedTech.includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`w-full flex items-center justify-between rounded-md px-2 py-1 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <div
                        className={`h-3 w-3 rounded-sm border flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-border'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className="truncate">{tech}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};


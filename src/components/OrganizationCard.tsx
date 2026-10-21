import React from 'react';
import { Bookmark, Scale, FolderGit2, ArrowRight, Sprout } from 'lucide-react';
import { OrganizationSummary } from '../types';

interface OrganizationCardProps {
  org: OrganizationSummary;
  isBookmarked: boolean;
  isCompared: boolean;
  selectedYears?: string[];
  onToggleBookmark: (org: OrganizationSummary) => void;
  onToggleCompare: (org: OrganizationSummary) => void;
  onSelect: (org: OrganizationSummary) => void;
  onFilterByTech: (tech: string) => void;
  onFilterByYear?: (year: string) => void;
  onOpenMethodology?: () => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  org,
  isBookmarked,
  isCompared,
  selectedYears = [],
  onToggleBookmark,
  onToggleCompare,
  onSelect,
  onFilterByTech,
  onFilterByYear,
  onOpenMethodology,
}) => {
  const is2026Active = org.years.includes('2026');
  const allYears = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  const bf = org.beginner_friendly;

  return (
    <div
      onClick={() => onSelect(org)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(org);
        }
      }}
      className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer select-none"
    >
      {/* Top Header */}
      <div>
        {/* Top Action Row: Prominent Logo + Action Icons */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(org);
            }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/80 p-2 shadow-sm overflow-hidden transition-all group-hover:scale-105 group-hover:border-primary/40 cursor-pointer"
            style={{ backgroundColor: org.image_background_color || '#ffffff' }}
            title={org.name}
          >
            {org.image_url ? (
              <img
                src={org.image_url}
                alt={org.name}
                className="h-full w-full object-contain pointer-events-none"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xl font-bold text-foreground">
                {org.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Actions: Compare & Bookmark */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 shrink-0 bg-muted/40 p-1 rounded-xl border border-border/40"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(org);
              }}
              className={`rounded-lg p-2 transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
              aria-label="Compare organization"
            >
              <Scale className="h-4 w-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(org);
              }}
              className={`rounded-lg p-2 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/15 text-amber-500'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark organization'}
              aria-label="Bookmark organization"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 justify-between">
            <h3
              onClick={(e) => {
                e.stopPropagation();
                onSelect(org);
              }}
              className="font-bold text-base sm:text-lg text-foreground tracking-tight hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2"
              title={org.name}
            >
              {org.name}
            </h3>
            {is2026Active && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                2026
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="inline-block rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border/40">
              {org.category}
            </span>

            {bf && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenMethodology) onOpenMethodology();
                  else onSelect(org);
                }}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                  bf.tier === 'Very High'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                    : bf.tier === 'High'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25'
                    : bf.tier === 'Moderate'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                    : 'bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/25'
                }`}
                title={`Beginner Friendliness Score: ${bf.score}/100 (${bf.tier} Tier). Click to see how it's calculated.`}
              >
                <Sprout className="h-3 w-3" />
                <span>{bf.score}/100</span>
                <span className="opacity-75">· {bf.tier}</span>
              </button>
            )}

            {bf && bf.github_repo && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(org);
                }}
                className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 px-1.5 py-0.5 text-[10px] font-medium hover:bg-purple-500/20 transition-colors cursor-pointer"
                title={`Official repo: ${bf.github_repo}. Click to view live beginner issues.`}
              >
                <span>🎯 Starter Issues</span>
              </span>
            )}
          </div>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {org.description || 'No description provided.'}
        </p>

        {/* Consistency Timeline Pills (Clean & Sleek) */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span className="font-medium">Participation History</span>
            <span className="font-mono font-semibold text-foreground">
              {org.years_count} of 11 Years
            </span>
          </div>

          {/* Original sleek pill dots */}
          <div className="grid grid-cols-11 gap-1">
            {allYears.map((yr) => {
              const active = org.years.includes(yr);
              const slots = org.projects_by_year[yr]?.num_projects || 0;
              const isFilterSelected = selectedYears.includes(yr);
              return (
                <div
                  key={yr}
                  title={`${yr}: ${active ? `${slots} student project${slots === 1 ? '' : 's'}` : 'Did not participate'}${isFilterSelected ? ' (Filtered)' : ''}`}
                  className={`h-2.5 rounded-full transition-all ${
                    active
                      ? isFilterSelected
                        ? 'bg-primary ring-2 ring-primary ring-offset-1 ring-offset-card'
                        : yr === '2026'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                        : 'bg-primary/80 group-hover:bg-primary'
                      : isFilterSelected
                      ? 'bg-muted/60 ring-1 ring-border'
                      : 'bg-muted/70'
                  }`}
                />
              );
            })}
          </div>

          {/* Clear separate participating years badges below */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            <span className="text-[10px] text-muted-foreground font-medium mr-1">Years:</span>
            {org.years.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onFilterByYear) onFilterByYear(yr);
                }}
                className={`rounded px-1.5 py-0.5 text-[10px] font-mono transition-colors cursor-pointer ${
                  selectedYears.includes(yr)
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : yr === '2026'
                    ? 'bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-muted/70 text-foreground/80 hover:bg-primary/10 hover:text-primary'
                }`}
                title={`Filter by ${yr}`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack Pills */}
        {org.technologies && org.technologies.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1">
            {org.technologies.slice(0, 4).map((tech) => (
              <button
                key={tech}
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterByTech(tech);
                }}
                className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/40 cursor-pointer"
              >
                {tech}
              </button>
            ))}
            {org.technologies.length > 4 && (
              <span className="rounded-md bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{org.technologies.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Meta & Button */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FolderGit2 className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">{org.total_projects}</span>
          <span>projects accepted</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(org);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group-hover:translate-x-0.5 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

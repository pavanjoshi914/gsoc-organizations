import React from 'react';
import { X, Scale, ExternalLink, Lightbulb, Trash2, CheckCircle, Minus } from 'lucide-react';
import { OrganizationSummary } from '../types';

interface CompareModalProps {
  comparedOrgs: OrganizationSummary[];
  onClose: () => void;
  onRemove: (orgId: string) => void;
  onClear: () => void;
  onSelect: (org: OrganizationSummary) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  comparedOrgs,
  onClose,
  onRemove,
  onClear,
  onSelect,
}) => {
  if (comparedOrgs.length === 0) return null;

  const allYears = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 p-5">
          <div className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Organization Comparison</h2>
              <p className="text-xs text-muted-foreground">
                Comparing {comparedOrgs.length} selected organizations side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-5 sm:p-6">
          <div className="min-w-[650px]">
            {/* Header Columns */}
            <div
              className="grid gap-4 pb-4 border-b border-border"
              style={{
                gridTemplateColumns: `180px repeat(${comparedOrgs.length}, minmax(180px, 1fr))`,
              }}
            >
              <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider self-end">
                Organization
              </div>

              {comparedOrgs.map((org) => (
                <div key={org.id} className="relative flex flex-col items-center text-center p-3 rounded-xl border border-border bg-muted/20">
                  <button
                    onClick={() => onRemove(org.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-muted"
                    title="Remove from comparison"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div
                    className="h-12 w-12 rounded-xl border border-border p-1.5 flex items-center justify-center mb-2 overflow-hidden shadow-sm"
                    style={{ backgroundColor: org.image_background_color || '#ffffff' }}
                  >
                    {org.image_url ? (
                      <img src={org.image_url} alt={org.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="font-bold">{org.name.slice(0, 2)}</span>
                    )}
                  </div>

                  <h3
                    onClick={() => {
                      onClose();
                      onSelect(org);
                    }}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1"
                  >
                    {org.name}
                  </h3>

                  <span className="mt-1 text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground">
                    {org.category}
                  </span>

                  {org.ideas_url && (
                    <a
                      href={org.ideas_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-amber-500 hover:underline"
                    >
                      <Lightbulb className="h-3 w-3" />
                      <span>Ideas Page</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-border/60 text-xs">
              {/* Total Projects */}
              <div
                className="grid gap-4 py-3 items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${comparedOrgs.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="font-semibold text-muted-foreground">Total GSoC Projects</div>
                {comparedOrgs.map((org) => (
                  <div key={org.id} className="font-mono font-bold text-sm text-primary text-center">
                    {org.total_projects} projects
                  </div>
                ))}
              </div>

              {/* Consistency */}
              <div
                className="grid gap-4 py-3 items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${comparedOrgs.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="font-semibold text-muted-foreground">Consistency</div>
                {comparedOrgs.map((org) => (
                  <div key={org.id} className="text-center font-mono">
                    <span className="font-bold text-foreground">{org.years_count} / 11 years</span>
                    <span className="ml-1 text-[10px] text-emerald-500 font-semibold">
                      ({Math.round((org.years_count / 11) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* 2026 Participation */}
              <div
                className="grid gap-4 py-3 items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${comparedOrgs.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="font-semibold text-muted-foreground">2026 Edition Status</div>
                {comparedOrgs.map((org) => {
                  const has2026 = org.years.includes('2026');
                  return (
                    <div key={org.id} className="text-center">
                      {has2026 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500">
                          <CheckCircle className="h-3 w-3" />
                          <span>Confirmed (2026)</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Not in 2026</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Technologies */}
              <div
                className="grid gap-4 py-3 items-start"
                style={{
                  gridTemplateColumns: `180px repeat(${comparedOrgs.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="font-semibold text-muted-foreground pt-1">Technologies</div>
                {comparedOrgs.map((org) => (
                  <div key={org.id} className="flex flex-wrap gap-1 justify-center">
                    {org.technologies.slice(0, 8).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {org.technologies.length > 8 && (
                      <span className="text-[10px] text-muted-foreground">+{org.technologies.length - 8}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Yearly Slot Breakdown (2026 -> 2016) */}
              {allYears.map((yr) => (
                <div
                  key={yr}
                  className="grid gap-4 py-2.5 items-center hover:bg-muted/20 transition-colors"
                  style={{
                    gridTemplateColumns: `180px repeat(${comparedOrgs.length}, minmax(180px, 1fr))`,
                  }}
                >
                  <div className="text-muted-foreground font-mono font-medium">{yr} Project Slots</div>
                  {comparedOrgs.map((org) => {
                    const count = org.projects_by_year[yr]?.num_projects;
                    return (
                      <div key={org.id} className="text-center font-mono">
                        {count !== undefined ? (
                          <span className="font-semibold text-foreground bg-primary/10 px-2 py-0.5 rounded text-xs">
                            {count} slot{count !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


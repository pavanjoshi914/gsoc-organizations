import React from 'react';
import { X, BarChart3, Award, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { OrganizationSummary } from '../types';

interface AnalyticsModalProps {
  organizations: OrganizationSummary[];
  onClose: () => void;
  onSelectOrg: (org: OrganizationSummary) => void;
  onFilterByTech: (tech: string) => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  organizations,
  onClose,
  onSelectOrg,
  onFilterByTech,
}) => {
  // Compute top technologies
  const techCounts: Record<string, number> = {};
  organizations.forEach((org) => {
    org.technologies.forEach((tech) => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });

  const sortedTech = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxTechCount = sortedTech[0]?.[1] || 1;

  // 11-Year Veterans
  const veterans = organizations.filter((org) => org.years_count === 11);

  // Top organizations by project count
  const topByProjects = [...organizations]
    .sort((a, b) => b.total_projects - a.total_projects)
    .slice(0, 8);

  // Category counts
  const categoryCounts: Record<string, number> = {};
  organizations.forEach((org) => {
    categoryCounts[org.category] = (categoryCounts[org.category] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 p-5">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">GSoC Historical Analytics (2016–2026)</h2>
              <p className="text-xs text-muted-foreground">
                Deep-dive statistics across all 519 organizations and 12,000+ student projects
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Global Big Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-xs text-muted-foreground">Total Organizations</span>
              <p className="text-2xl font-black text-foreground mt-1 font-mono">519</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-xs text-muted-foreground">Archived Projects</span>
              <p className="text-2xl font-black text-primary mt-1 font-mono">12,095</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-xs text-muted-foreground">11-Year Veterans</span>
              <p className="text-2xl font-black text-emerald-500 mt-1 font-mono">{veterans.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-xs text-muted-foreground">Unique Technologies</span>
              <p className="text-2xl font-black text-amber-500 mt-1 font-mono">566</p>
            </div>
          </div>

          {/* Top 10 Technologies Chart */}
          <div className="rounded-xl border border-border bg-muted/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Most In-Demand Technologies</h3>
              </div>
              <span className="text-xs text-muted-foreground">Click language to filter</span>
            </div>

            <div className="space-y-2.5">
              {sortedTech.map(([tech, count]) => {
                const percent = Math.round((count / maxTechCount) * 100);
                return (
                  <div
                    key={tech}
                    onClick={() => {
                      onClose();
                      onFilterByTech(tech);
                    }}
                    className="group cursor-pointer flex items-center gap-3 text-xs"
                  >
                    <span className="w-24 font-mono font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {tech}
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 group-hover:opacity-90"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-muted-foreground">{count} orgs</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 11-Year Hall of Fame */}
          <div className="rounded-xl border border-border bg-muted/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-foreground">
                The 11-Year Veterans Hall of Fame ({veterans.length} Orgs)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              These elite organizations have participated in Google Summer of Code every single year without interruption (2016–2026).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {veterans.slice(0, 24).map((org) => (
                <div
                  key={org.id}
                  onClick={() => {
                    onClose();
                    onSelectOrg(org);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div
                    className="h-7 w-7 rounded-md border border-border p-0.5 flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ backgroundColor: org.image_background_color || '#ffffff' }}
                  >
                    {org.image_url ? (
                      <img src={org.image_url} alt={org.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold">{org.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {org.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Organizations by Projects Accepted */}
          <div className="rounded-xl border border-border bg-muted/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Highest Capacity Organizations (Most Student Slots)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topByProjects.map((org, index) => (
                <div
                  key={org.id}
                  onClick={() => {
                    onClose();
                    onSelectOrg(org);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-muted-foreground w-4">#{index + 1}</span>
                    <span className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate max-w-[180px]">
                      {org.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {org.total_projects} slots
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


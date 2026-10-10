import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  Bookmark,
  Scale,
  Calendar,
  FolderGit2,
  Code,
  Globe,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Mail,
  Loader2,
  CheckCircle2,
  Github,
} from 'lucide-react';
import { OrganizationSummary, OrganizationDetail, YearDetail, StudentProject } from '../types';

interface OrganizationDetailModalProps {
  org: OrganizationSummary | null;
  onClose: () => void;
  isBookmarked: boolean;
  isCompared: boolean;
  onToggleBookmark: (org: OrganizationSummary) => void;
  onToggleCompare: (org: OrganizationSummary) => void;
}

export const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({
  org,
  onClose,
  isBookmarked,
  isCompared,
  onToggleBookmark,
  onToggleCompare,
}) => {
  const [detail, setDetail] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    if (!org) {
      setDetail(null);
      return;
    }

    // Default to latest year active
    const latestYear = org.years[org.years.length - 1] || '2026';
    setSelectedYear(latestYear);

    // Fetch detailed json with student projects
    setLoading(true);
    fetch(`/data/orgs/${org.id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load detail');
        return res.json();
      })
      .then((data: OrganizationDetail) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching org detail:', err);
        setLoading(false);
      });
  }, [org]);

  if (!org) return null;

  const currentYearData: YearDetail | undefined = detail?.years_detailed?.[selectedYear];
  const projectsList: StudentProject[] = currentYearData?.projects || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="border-b border-border bg-muted/30 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Logo + Title */}
            <div className="flex items-start gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border p-2 shadow-sm overflow-hidden"
                style={{ backgroundColor: org.image_background_color || '#ffffff' }}
              >
                {org.image_url ? (
                  <img src={org.image_url} alt={org.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-xl font-bold">{org.name.slice(0, 2)}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {org.name}
                  </h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                    {org.category}
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                  {org.description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleCompare(org)}
                className={`rounded-lg p-2 transition-colors ${
                  isCompared ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title="Compare"
              >
                <Scale className="h-4 w-4" />
              </button>

              <button
                onClick={() => onToggleBookmark(org)}
                className={`rounded-lg p-2 transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="rounded-lg p-2 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links Row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/50 text-xs">
            {org.url && (
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 font-medium text-foreground border border-border hover:border-primary/50 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>Official Website</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}

            {org.ideas_url && (
              <a
                href={org.ideas_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:border-amber-500 transition-colors"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>GSoC Ideas List</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {org.guide_url && (
              <a
                href={org.guide_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 font-medium text-foreground border border-border hover:border-primary/50 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>Contributor Guide</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}

            {org.irc_channel && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-muted-foreground border border-border">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat: {org.irc_channel}</span>
              </span>
            )}

            {org.contact_email && (
              <a
                href={`mailto:${org.contact_email}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-muted-foreground border border-border hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{org.contact_email}</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
              <span className="text-xs text-muted-foreground">Years Active</span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">{org.years_count} / 11</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
              <span className="text-xs text-muted-foreground">Total Projects</span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">{org.total_projects}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
              <span className="text-xs text-muted-foreground">Avg Slots / Year</span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">
                {Math.round(org.total_projects / Math.max(1, org.years_count))}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
              <span className="text-xs text-muted-foreground">Consistency Score</span>
              <p className="text-lg font-bold text-emerald-500 mt-0.5 font-mono">
                {Math.round((org.years_count / 11) * 100)}%
              </p>
            </div>
          </div>

          {/* Technologies & Topics */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {org.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-foreground border border-border/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {org.topics && org.topics.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Topics & Fields
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {org.topics.map((top) => (
                    <span
                      key={top}
                      className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary border border-primary/20"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Year-by-Year Project Archive */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-foreground">Accepted Student Projects</h3>
                <p className="text-xs text-muted-foreground">
                  Browse real past GSoC proposals and repositories accepted by {org.name}
                </p>
              </div>

              {/* Year Selector Tabs */}
              <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg border border-border/60">
                {org.years.slice().reverse().map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedYear === yr
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Projects Content */}
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">Loading project archive for {selectedYear}...</span>
              </div>
            ) : projectsList.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>
                    Accepted <strong className="text-foreground">{projectsList.length}</strong> student project(s) in{' '}
                    {selectedYear}
                  </span>
                  {currentYearData?.projects_url && (
                    <a
                      href={currentYearData.projects_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Official GSoC Archive</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="grid gap-3">
                  {projectsList.map((proj, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/80 bg-muted/20 p-4 hover:border-border transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-foreground">{proj.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Student: <strong className="text-foreground">{proj.student_name}</strong></span>
                          </div>
                        </div>

                        {/* Project Links */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {proj.code_url && (
                            <a
                              href={proj.code_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-primary hover:text-white transition-colors"
                              title="View Project Code"
                            >
                              <Github className="h-3 w-3" />
                              <span>Code</span>
                            </a>
                          )}
                          {proj.project_url && (
                            <a
                              href={proj.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                              title="GSoC Project Page"
                            >
                              <span>Details</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {proj.short_description || proj.description?.replace(/<[^>]+>/g, '') || 'No description.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                <FolderGit2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm">No detailed project records archived for {selectedYear}.</p>
                {currentYearData?.projects_url && (
                  <a
                    href={currentYearData.projects_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <span>Check official GSoC archive page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


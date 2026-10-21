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
  Sprout,
  GitPullRequest,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { OrganizationSummary, OrganizationDetail, YearDetail, StudentProject, GoodFirstIssue } from '../types';

interface OrganizationDetailModalProps {
  org: OrganizationSummary | null;
  onClose: () => void;
  isBookmarked: boolean;
  isCompared: boolean;
  onToggleBookmark: (org: OrganizationSummary) => void;
  onToggleCompare: (org: OrganizationSummary) => void;
  onOpenMethodology?: () => void;
}

export const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({
  org,
  onClose,
  isBookmarked,
  isCompared,
  onToggleBookmark,
  onToggleCompare,
  onOpenMethodology,
}) => {
  const [detail, setDetail] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [liveIssues, setLiveIssues] = useState<GoodFirstIssue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  useEffect(() => {
    if (!org) {
      setDetail(null);
      setLiveIssues([]);
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

    // Query live open Good First Issues directly from GitHub
    const repo = org.beginner_friendly?.github_repo;
    if (repo && repo.includes('/')) {
      const cacheKey = `gfi_cache_${repo}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setLiveIssues(parsed);
            setLoadingIssues(false);
            return;
          }
        } catch {
          // ignore cache error
        }
      }

      setLoadingIssues(true);
      setIssueError(null);
      fetch(
        `https://api.github.com/repos/${repo}/issues?state=open&labels=good%20first%20issue&sort=updated&per_page=5`
      )
        .then((res) => {
          if (!res.ok) throw new Error('GitHub API rate limited or unavailable');
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            // Filter out pull requests (GitHub issues API includes PRs unless filtered) and closed issues
            const openList: GoodFirstIssue[] = data
              .filter((item: any) => !item.pull_request && item.state === 'open')
              .map((item: any) => ({
                number: item.number,
                title: item.title,
                url: item.html_url,
                repo: repo,
                labels: (item.labels || []).map((l: any) =>
                  typeof l === 'string' ? l : l.name
                ),
                comments: item.comments || 0,
                created_at: item.created_at,
                updated_at: item.updated_at,
              }));
            setLiveIssues(openList);
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(openList));
            } catch {
              // ignore quota
            }
          } else {
            setLiveIssues([]);
          }
          setLoadingIssues(false);
        })
        .catch(() => {
          setIssueError('GitHub rate limit reached or repository issues disabled');
          setLoadingIssues(false);
        });
    } else {
      setLiveIssues([]);
      setLoadingIssues(false);
    }
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
          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {org.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-card px-2.5 py-1 text-xs font-mono text-foreground border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {org.topics && org.topics.length > 0 && (
              <div className="pt-2 border-t border-border/50">
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

          {/* Beginner Friendliness & Community Health Section */}
          {org.beginner_friendly && (
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
              {/* Header with Score and Tier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border font-bold text-lg font-mono shadow-xs ${
                      org.beginner_friendly.tier === 'Very High'
                        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                        : org.beginner_friendly.tier === 'High'
                        ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                        : org.beginner_friendly.tier === 'Moderate'
                        ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                        : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                    }`}
                  >
                    {org.beginner_friendly.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Beginner Friendliness Index
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          org.beginner_friendly.tier === 'Very High'
                            ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                            : org.beginner_friendly.tier === 'High'
                            ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                            : org.beginner_friendly.tier === 'Moderate'
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                            : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                        }`}
                      >
                        {org.beginner_friendly.tier} Tier
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Objective multi-factor score based on Good First Issues, merge rate, response latency, and onboarding guides.
                    </p>
                  </div>
                </div>

                {onOpenMethodology && (
                  <button
                    onClick={onOpenMethodology}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors self-start sm:self-center bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg border border-primary/20"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>How it's calculated</span>
                  </button>
                )}
              </div>

              {/* 4 Pillars Progress Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Pillar 1 */}
                <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                      Good First Issues (30%)
                    </span>
                    <span className="font-mono text-muted-foreground font-medium">
                      {org.beginner_friendly.breakdown.issues_score} / 30 pts
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(org.beginner_friendly.breakdown.issues_score / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {org.beginner_friendly.breakdown.open_gfi_count} beginner starter tasks tracked
                  </span>
                </div>

                {/* Pillar 2 */}
                <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <GitPullRequest className="h-3.5 w-3.5 text-blue-500" />
                      PR Merge Rate (30%)
                    </span>
                    <span className="font-mono text-muted-foreground font-medium">
                      {org.beginner_friendly.breakdown.merge_rate_score} / 30 pts
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(org.beginner_friendly.breakdown.merge_rate_score / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {org.beginner_friendly.breakdown.pr_merge_rate_pct}% newcomer pull requests merged
                  </span>
                </div>

                {/* Pillar 3 */}
                <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      Maintainer Response (20%)
                    </span>
                    <span className="font-mono text-muted-foreground font-medium">
                      {org.beginner_friendly.breakdown.responsiveness_score} / 20 pts
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${(org.beginner_friendly.breakdown.responsiveness_score / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    Turnaround: {org.beginner_friendly.breakdown.response_time_desc}
                  </span>
                </div>

                {/* Pillar 4 */}
                <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                      Onboarding & Guides (20%)
                    </span>
                    <span className="font-mono text-muted-foreground font-medium">
                      {org.beginner_friendly.breakdown.onboarding_score} / 20 pts
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(org.beginner_friendly.breakdown.onboarding_score / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    Guide: {org.beginner_friendly.breakdown.has_contributing_guide ? '✓ Yes' : '— No'} · Chat: {org.beginner_friendly.breakdown.has_community_chat ? '✓ Yes' : '— No'}
                  </span>
                </div>
              </div>

              {/* Actionable Notes Bullet Points */}
              {org.beginner_friendly.breakdown.notes && org.beginner_friendly.breakdown.notes.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {org.beginner_friendly.breakdown.notes.map((note, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 px-2.5 py-1 text-[11px] text-foreground/80 border border-border/50"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{note}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Live Active Good First Issues / GitHub Search Link */}
              <div className="pt-2 border-t border-border/40">
                <div className="flex items-center justify-between mb-2.5">
                  <h5 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <span>Live Open Good First Issues</span>
                    {liveIssues.length > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[10px] font-mono font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {liveIssues.length} active open
                      </span>
                    )}
                  </h5>

                  {org.beginner_friendly.github_repo && (
                    <a
                      href={`https://github.com/${org.beginner_friendly.github_repo}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Search on GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {loadingIssues ? (
                  <div className="flex items-center justify-center py-6 gap-2 rounded-xl border border-dashed border-border/80 bg-card/40 text-muted-foreground text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Querying GitHub API for open beginner issues in {org.beginner_friendly.github_repo}...</span>
                  </div>
                ) : liveIssues.length > 0 ? (
                  <div className="space-y-2">
                    {liveIssues.map((issue, idx) => (
                      <a
                        key={idx}
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border/70 bg-card p-3 hover:border-primary/50 transition-colors shadow-2xs"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {issue.number ? (
                              <span className="font-mono text-muted-foreground mr-1.5 font-normal">
                                #{issue.number}
                              </span>
                            ) : null}
                            {issue.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <span className="text-primary font-medium">{issue.repo}</span>
                            {issue.labels &&
                              issue.labels.map((lbl: string, lIdx: number) => (
                                <span
                                  key={lIdx}
                                  className="rounded bg-muted px-1.5 py-0.2 text-muted-foreground"
                                >
                                  {lbl}
                                </span>
                              ))}
                            {issue.updated_at && (
                              <span className="text-[10px] text-muted-foreground">
                                • Updated {new Date(issue.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="text-[10px] text-muted-foreground">
                            {issue.comments} comment{issue.comments === 1 ? '' : 's'}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/80 bg-card/50 p-4 text-center space-y-2.5">
                    <p className="text-xs text-muted-foreground">
                      {org.beginner_friendly.github_repo
                        ? `No open issues currently tagged "good first issue" in ${org.beginner_friendly.github_repo}. Search all open newcomer tasks:`
                        : "Browse open beginner issues directly on this organization's official repository:"}
                    </p>
                    {org.beginner_friendly.github_repo ? (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <a
                          href={`https://github.com/${org.beginner_friendly.github_repo}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-3 py-1.5 text-xs font-semibold transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Search "good first issue" on GitHub</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={`https://github.com/${org.beginner_friendly.github_repo}/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 px-3 py-1.5 text-xs font-semibold transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Search "help wanted" on GitHub</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <a
                        href={org.ideas_url || org.guide_url || org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Visit Contributor / Ideas Page</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

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


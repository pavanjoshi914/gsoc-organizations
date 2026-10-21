import React from 'react';
import {
  X,
  Sprout,
  GitPullRequest,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Compass,
} from 'lucide-react';

interface BeginnerMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerMethodologyModal: React.FC<BeginnerMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-card-foreground">
        {/* Header */}
        <div className="border-b border-border bg-muted/40 p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-sm">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  GSoC Intelligence
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
                Beginner Friendliness Score Methodology
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7">
          {/* Introduction Hero */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 flex items-start gap-3.5">
            <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-foreground/90 space-y-1 leading-relaxed">
              <p className="font-semibold text-foreground">
                How is an organization scored for beginner friendliness?
              </p>
              <p className="text-muted-foreground">
                The <strong>Beginner Friendliness Index (0–100)</strong> is an objective, multi-factor metric designed to help first-time GSoC applicants find organizations that actively nurture, review, and merge newcomer contributions rather than leaving beginners stuck.
              </p>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3.5 flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              The 4 Core Evaluation Pillars (100 Points Total)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Pillar 1 */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Sprout className="h-4 w-4 text-emerald-500" />
                    <span>1. Good First Issues (30%)</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    30 pts max
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Measures whether the organization actively creates and maintains curated starter tasks with labels like <code className="text-foreground bg-muted px-1 py-0.5 rounded text-[11px]">good first issue</code>, <code className="text-foreground bg-muted px-1 py-0.5 rounded text-[11px]">easy</code>, or <code className="text-foreground bg-muted px-1 py-0.5 rounded text-[11px]">beginner-friendly</code>.
                </p>
                <div className="text-[11px] text-muted-foreground/90 border-t border-border/40 pt-2 flex flex-col gap-1">
                  <span>• 5+ active Good First Issues = <strong>30 pts</strong></span>
                  <span>• 3–4 active Good First Issues = <strong>25 pts</strong></span>
                  <span>• 1–2 active Good First Issues = <strong>18 pts</strong></span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <GitPullRequest className="h-4 w-4 text-blue-500" />
                    <span>2. PR Merge & Acceptance (30%)</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
                    30 pts max
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculates the percentage of newcomer pull requests that successfully get merged into the main codebase, confirming maintainers welcome external code contributions.
                </p>
                <div className="text-[11px] text-muted-foreground/90 border-t border-border/40 pt-2 flex flex-col gap-1">
                  <span>• Merge Rate &gt; 85% = <strong>30 pts</strong></span>
                  <span>• Merge Rate 75%–84% = <strong>25 pts</strong></span>
                  <span>• Merge Rate 60%–74% = <strong>18 pts</strong></span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>3. Review Latency (20%)</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                    20 pts max
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Evaluates the median Time to First Response (TTFR) by maintainers on contributor PRs and issues. Fast feedback prevents contributors from stalling.
                </p>
                <div className="text-[11px] text-muted-foreground/90 border-t border-border/40 pt-2 flex flex-col gap-1">
                  <span>• Within 24 hours = <strong>20 pts</strong></span>
                  <span>• 1 to 2 days = <strong>16 pts</strong></span>
                  <span>• 3 to 5 days = <strong>11 pts</strong></span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <span>4. Onboarding & Chat (20%)</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-500">
                    20 pts max
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verifies that the organization provides clear documentation and real-time mentor accessibility for new developers.
                </p>
                <div className="text-[11px] text-muted-foreground/90 border-t border-border/40 pt-2 flex flex-col gap-1">
                  <span>• Official Contributor Guide (<code className="text-foreground">CONTRIBUTING.md</code>) = <strong>+8 pts</strong></span>
                  <span>• Live chat (Discord, Slack, Matrix, Gitter) = <strong>+7 pts</strong></span>
                  <span>• Curated GSoC Ideas List = <strong>+5 pts</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Tiers Legend */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Score Tier Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-500">Very High</span>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">85 – 100</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Exceptional newcomer onboarding. Active starter issues, fast review turnaround, and high PR acceptance rate.
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-blue-500">High</span>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">70 – 84</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Welcoming open source community with reliable mentors, documented contribution guidelines, and solid merge velocity.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-500">Moderate</span>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">50 – 69</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Intermediate architecture. May have sporadic starter issues and longer review cycles; self-directed initiative required.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-500/30 bg-zinc-500/10 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-400">Challenging</span>
                  <span className="font-mono text-xs font-bold text-zinc-400">0 – 49</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Deep technical complexity (e.g., compilers, hypervisors, niche scientific kernels). High barrier to first commit.
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Advice for Applicants */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5 space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              How to Use this Data for Your GSoC Application:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Target Orgs with High Merge Rates:</strong> A repository with an 85%+ merge rate means your proposal and first pull requests will actually get reviewed with constructive guidance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Check Real-Time Chat Channels:</strong> Before submitting code, join the organization's Discord/Slack/Matrix channel, introduce yourself, and ask maintainers if an issue is still open for work.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Solve 1–2 Good First Issues Before Applying:</strong> Having even one merged pull request in the target organization's repository substantially elevates your GSoC proposal score.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 p-4 sm:p-5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Scored across 519 Google Summer of Code organizations
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};


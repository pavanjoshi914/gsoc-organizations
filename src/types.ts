export interface YearProjectStat {
  num_projects: number;
  projects_url?: string;
}

export interface GoodFirstIssue {
  number?: number;
  title: string;
  url: string;
  repo: string;
  labels: string[];
  comments: number;
  created_at?: string;
  updated_at?: string;
}

export interface BeginnerScoreBreakdown {
  issues_score: number; // out of 30
  merge_rate_score: number; // out of 30
  responsiveness_score: number; // out of 20
  onboarding_score: number; // out of 20
  pr_merge_rate_pct: number;
  open_gfi_count: number;
  response_time_desc: string;
  has_contributing_guide: boolean;
  has_ideas_list: boolean;
  has_community_chat: boolean;
  notes: string[];
}

export interface BeginnerFriendlinessData {
  score: number; // 0 - 100
  tier: 'Very High' | 'High' | 'Moderate' | 'Challenging';
  github_repo?: string;
  breakdown: BeginnerScoreBreakdown;
  recent_issues: GoodFirstIssue[];
}

export interface OrganizationSummary {
  id: string;
  name: string;
  url: string;
  image_url: string;
  image_background_color: string;
  description: string;
  category: string;
  topics: string[];
  technologies: string[];
  years: string[];
  years_count: number;
  total_projects: number;
  projects_by_year: Record<string, YearProjectStat>;
  irc_channel?: string;
  contact_email?: string;
  mailing_list?: string;
  ideas_url?: string;
  guide_url?: string;
  beginner_friendly?: BeginnerFriendlinessData;
}

export interface StudentProject {
  title: string;
  short_description: string;
  description: string;
  student_name: string;
  code_url: string;
  project_url: string;
}

export interface YearDetail {
  projects_url: string;
  num_projects: number;
  projects: StudentProject[];
}

export interface OrganizationDetail extends OrganizationSummary {
  years_detailed: Record<string, YearDetail>;
}

export interface FilterState {
  search: string;
  selectedYears: string[];
  selectedCategory: string | null;
  selectedTech: string[];
  selectedTopics: string[];
  minProjects: number;
  onlyActiveLatest: boolean; // active in 2026
  veteransOnly: boolean; // 8+ years
  bookmarkedOnly: boolean;
  beginnerFriendlyOnly: boolean; // score 70+
  selectedBeginnerTier: string | null; // 'all' | 'Very High' | 'High' | 'Moderate' | 'Challenging'
  sortBy: 'name' | 'projects-desc' | 'years-desc' | 'latest' | 'beginner-desc';
}


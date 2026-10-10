export interface YearProjectStat {
  num_projects: number;
  projects_url?: string;
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
  sortBy: 'name' | 'projects-desc' | 'years-desc' | 'latest';
}


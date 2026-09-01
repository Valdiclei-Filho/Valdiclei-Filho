export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
  weekday: number;
};

export type ContributionWeek = {
  firstDay: string;
  days: ContributionDay[];
};

export type LanguageShare = {
  name: string;
  color: string;
  bytes: number;
  repositories: number;
};

export type ProfileStatistics = {
  contributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  repositories: number;
};

export type ProfileData = {
  login: string;
  displayName: string;
  location: string;
  generatedAt: string;
  statistics: ProfileStatistics;
  languages: LanguageShare[];
  contributionWeeks: ContributionWeek[];
};

export type ThemeName = "dark" | "light";

export type ProfileTheme = {
  name: ThemeName;
  background: string;
  panel: string;
  grid: string;
  border: string;
  cyan: string;
  green: string;
  orange: string;
  text: string;
  muted: string;
  inactive: string;
  contribution: readonly [string, string, string, string, string];
};

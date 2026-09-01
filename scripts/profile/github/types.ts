export type ApiContributionLevel = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";

export type ApiRepository = {
  primaryLanguage: { name: string; color: string | null } | null;
  languages: { edges: Array<{ size: number; node: { name: string; color: string | null } }> };
};

export type ApiRepositories = {
  totalCount: number;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: ApiRepository[];
};

export type ApiProfile = {
  user: {
    login: string;
    name: string | null;
    location: string | null;
    repositories: ApiRepositories;
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          firstDay: string;
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            contributionLevel: ApiContributionLevel;
            weekday: number;
          }>;
        }>;
      };
    };
  } | null;
};

export type ApiRepositoryPage = { user: { repositories: ApiRepositories } | null };

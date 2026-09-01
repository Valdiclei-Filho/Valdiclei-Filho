import type { LanguageShare, ProfileData } from "../model.js";
import { GitHubGraphQlClient } from "./client.js";
import { PROFILE_QUERY, REPOSITORIES_QUERY } from "./query.js";
import type { ApiContributionLevel, ApiProfile, ApiRepositories, ApiRepository, ApiRepositoryPage } from "./types.js";

const levelMap: Record<ApiContributionLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
};

export function normalizeLevel(level: ApiContributionLevel): 0 | 1 | 2 | 3 | 4 {
  return levelMap[level];
}

function aggregateLanguages(repositories: ApiRepository[]): LanguageShare[] {
  const totals = new Map<string, LanguageShare>();
  for (const repository of repositories) {
    const seen = new Set<string>();
    for (const edge of repository.languages.edges) {
      const current = totals.get(edge.node.name) ?? {
        name: edge.node.name,
        color: edge.node.color ?? "#8fb3c7",
        bytes: 0,
        repositories: 0
      };
      current.bytes += edge.size;
      if (!seen.has(edge.node.name)) current.repositories += 1;
      seen.add(edge.node.name);
      totals.set(edge.node.name, current);
    }
  }
  return [...totals.values()].sort((left, right) => right.bytes - left.bytes).slice(0, 8);
}

async function loadAllRepositories(client: GitHubGraphQlClient, login: string, firstPage: ApiRepositories): Promise<ApiRepository[]> {
  const repositories = [...firstPage.nodes];
  let pageInfo = firstPage.pageInfo;
  while (pageInfo.hasNextPage) {
    const page: ApiRepositoryPage = await client.request(REPOSITORIES_QUERY, { login, after: pageInfo.endCursor });
    if (!page.user) throw new Error(`Perfil ${login} não encontrado durante a paginação.`);
    repositories.push(...page.user.repositories.nodes);
    pageInfo = page.user.repositories.pageInfo;
  }
  return repositories;
}

export async function loadProfileData(login: string, token: string): Promise<ProfileData> {
  const client = new GitHubGraphQlClient(token);
  const response = await client.request<ApiProfile>(PROFILE_QUERY, { login, after: null });
  if (!response.user) throw new Error(`Perfil GitHub ${login} não encontrado.`);

  const repositories = await loadAllRepositories(client, login, response.user.repositories);
  const collection = response.user.contributionsCollection;
  return {
    login: response.user.login,
    displayName: response.user.name ?? response.user.login,
    location: response.user.location ?? "Blumenau — SC, Brasil",
    generatedAt: new Date().toISOString(),
    statistics: {
      contributions: collection.contributionCalendar.totalContributions,
      commits: collection.totalCommitContributions,
      pullRequests: collection.totalPullRequestContributions,
      issues: collection.totalIssueContributions,
      repositories: response.user.repositories.totalCount
    },
    languages: aggregateLanguages(repositories),
    contributionWeeks: collection.contributionCalendar.weeks.map((week) => ({
      firstDay: week.firstDay,
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: normalizeLevel(day.contributionLevel),
        weekday: day.weekday
      }))
    }))
  };
}

import { GRAPHQL_ENDPOINT } from "../config.js";

type GraphQlError = { message: string };
type GraphQlResponse<T> = { data?: T; errors?: GraphQlError[] };

export class GitHubGraphQlClient {
  public constructor(private readonly token: string) {
    if (!token.trim()) throw new Error("GITHUB_TOKEN não foi informado.");
  }

  public async request<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "User-Agent": "vf-contribution-engine"
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(30_000)
    });

    if (!response.ok) throw new Error(`GitHub GraphQL respondeu HTTP ${response.status}.`);

    const payload = (await response.json()) as GraphQlResponse<T>;
    if (payload.errors?.length) {
      throw new Error(`GitHub GraphQL: ${payload.errors.map(({ message }) => message).join("; ")}`);
    }
    if (!payload.data) throw new Error("GitHub GraphQL retornou uma resposta sem dados.");
    return payload.data;
  }
}

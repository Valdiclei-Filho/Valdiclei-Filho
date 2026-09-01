import fixture from "./profile.json" with { type: "json" };
import type { ContributionLevel, ProfileData } from "../model.js";

function mockLevel(count: number): ContributionLevel {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 13) return 3;
  return 4;
}

export function loadMockProfile(): ProfileData {
  const start = new Date(`${fixture.contributions.startDate}T00:00:00Z`);
  const weeks = Array.from({ length: fixture.contributions.weeks }, (_, weekIndex) => {
    const firstDay = new Date(start);
    firstDay.setUTCDate(start.getUTCDate() + weekIndex * 7);
    return {
      firstDay: firstDay.toISOString().slice(0, 10),
      days: Array.from({ length: 7 }, (_, weekday) => {
        const date = new Date(firstDay);
        date.setUTCDate(firstDay.getUTCDate() + weekday);
        const patternIndex = (weekIndex * 7 + weekday * 11) % fixture.contributions.pattern.length;
        const base = fixture.contributions.pattern[patternIndex] ?? 0;
        const count = weekIndex > 38 ? Math.round(base * 1.35) : base;
        return { date: date.toISOString().slice(0, 10), count, level: mockLevel(count), weekday };
      })
    };
  });

  return {
    login: fixture.login,
    displayName: fixture.displayName,
    location: fixture.location,
    generatedAt: "2026-09-01T12:00:00.000Z",
    statistics: fixture.statistics,
    languages: fixture.languages,
    contributionWeeks: weeks
  };
}

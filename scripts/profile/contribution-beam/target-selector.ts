import { TARGETING } from "../design-system.js";
import type { BeamTarget, ContributionDay, ProfileData } from "../model.js";

type Candidate = ContributionDay & { weekIndex: number; x: number; y: number };

export function contributionCoordinates(weekIndex: number, weekday: number): { x: number; y: number } {
  return {
    x: TARGETING.gridX + weekIndex * (TARGETING.cell + TARGETING.gapX) + TARGETING.cell / 2,
    y: TARGETING.gridY + weekday * (TARGETING.cell + TARGETING.gapY) + TARGETING.cell / 2
  };
}

function candidateOrder(left: Candidate, right: Candidate): number {
  return right.count - left.count || right.level - left.level || right.weekIndex - left.weekIndex || right.weekday - left.weekday || left.date.localeCompare(right.date);
}

export function selectBeamTargets(data: ProfileData, desiredCount = TARGETING.targetCount): BeamTarget[] {
  const weeks = data.contributionWeeks.slice(-TARGETING.columns);
  const candidates = weeks.flatMap((week, weekIndex) => week.days
    .filter((day) => day.count > 0)
    .map((day) => ({ ...day, weekIndex, ...contributionCoordinates(weekIndex, day.weekday) })));
  if (candidates.length === 0 || desiredCount <= 0) return [];

  const selected: Candidate[] = [];
  for (let segment = 0; segment < desiredCount; segment += 1) {
    const start = Math.floor((segment * weeks.length) / desiredCount);
    const end = Math.floor(((segment + 1) * weeks.length) / desiredCount);
    const candidate = candidates.filter(({ weekIndex }) => weekIndex >= start && weekIndex < end).sort(candidateOrder)[0];
    if (candidate) selected.push(candidate);
  }

  const remaining = candidates.filter((candidate) => !selected.some(({ date }) => date === candidate.date));
  while (selected.length < Math.min(desiredCount, candidates.length)) {
    const next = remaining.sort((left, right) => {
      const leftDistance = Math.min(...selected.map(({ weekIndex }) => Math.abs(left.weekIndex - weekIndex)));
      const rightDistance = Math.min(...selected.map(({ weekIndex }) => Math.abs(right.weekIndex - weekIndex)));
      return rightDistance - leftDistance || candidateOrder(left, right);
    }).shift();
    if (!next) break;
    selected.push(next);
  }

  return selected.sort((left, right) => left.weekIndex - right.weekIndex || left.weekday - right.weekday).map((candidate, sequenceIndex) => ({
    date: candidate.date,
    count: candidate.count,
    level: candidate.level,
    weekIndex: candidate.weekIndex,
    weekday: candidate.weekday,
    x: candidate.x,
    y: candidate.y,
    sequenceIndex,
    startTime: sequenceIndex * TARGETING.targetSlotSeconds
  }));
}

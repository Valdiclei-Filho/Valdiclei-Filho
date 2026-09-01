import { getTargetingTiming, TARGETING } from "../design-system.js";
import type { BeamTarget, ProfileData } from "../model.js";

export function contributionCoordinates(weekIndex: number, weekday: number): { x: number; y: number } {
  return {
    x: TARGETING.gridX + weekIndex * (TARGETING.cell + TARGETING.gapX) + TARGETING.cell / 2,
    y: TARGETING.gridY + weekday * (TARGETING.cell + TARGETING.gapY) + TARGETING.cell / 2
  };
}

export function selectBeamTargets(data: ProfileData): BeamTarget[] {
  const weeks = data.contributionWeeks.slice(-TARGETING.columns);
  const candidates = weeks.flatMap((week, weekIndex) => week.days
    .filter((day) => day.count > 0)
    .map((day) => ({ ...day, weekIndex, ...contributionCoordinates(weekIndex, day.weekday) })))
    .sort((left, right) => left.weekIndex - right.weekIndex || left.weekday - right.weekday || left.date.localeCompare(right.date));
  const timing = getTargetingTiming(candidates.length);
  return candidates.map((candidate, sequenceIndex) => ({
    date: candidate.date,
    count: candidate.count,
    level: candidate.level,
    weekIndex: candidate.weekIndex,
    weekday: candidate.weekday,
    x: candidate.x,
    y: candidate.y,
    sequenceIndex,
    startTime: timing.initialDelayDuration + sequenceIndex * timing.slotDuration
  }));
}

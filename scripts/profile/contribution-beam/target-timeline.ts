import { FONT, PHASE, TARGETING, TYPE } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

type PhaseEntry = { label: string; start: number; end: number; color: string };

export function renderTargetTimeline(targets: BeamTarget[], theme: ProfileTheme): string {
  const total = TARGETING.totalDurationSeconds;
  const phases: PhaseEntry[] = [
    { label: "SCAN", start: 0, end: PHASE.scanEnd, color: theme.cyan },
    { label: "TARGET ACQUIRED", start: PHASE.scanEnd, end: PHASE.acquireEnd, color: theme.cyan },
    { label: "CORE CHARGE", start: PHASE.acquireEnd, end: PHASE.chargeEnd, color: theme.green },
    { label: "TARGET LOCK", start: PHASE.chargeEnd, end: PHASE.lockEnd, color: theme.cyan },
    { label: "FIRE", start: PHASE.lockEnd, end: PHASE.fireEnd, color: theme.orange },
    { label: "IMPACT", start: PHASE.fireEnd, end: PHASE.impactEnd, color: theme.orange },
    { label: "RESIDUAL ENERGY", start: PHASE.impactEnd, end: PHASE.residualEnd, color: theme.green },
    { label: "COOLDOWN", start: PHASE.residualEnd, end: PHASE.cooldownEnd, color: theme.muted }
  ];
  return targets.flatMap((target) => phases.map((phase) => {
    const duration = (phase.end - phase.start) / total;
    return `<g opacity="0"><circle cx="42" cy="327" r="4" fill="${phase.color}"/><text x="56" y="332" fill="${phase.color}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${phase.label}</text>
      <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${duration.toFixed(4)};${Math.min(1, duration + 0.001).toFixed(4)};1" begin="${(target.startTime + phase.start).toFixed(2)}s" dur="${total}s" repeatCount="indefinite"/></g>`;
  })).join("\n");
}

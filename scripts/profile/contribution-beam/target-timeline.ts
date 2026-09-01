import { FONT, PHASE, TYPE, type TargetingTiming } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

type PhaseEntry = { label: string; start: number; end: number; color: string };

function repeatedPhaseAnimation(targets: BeamTarget[], phase: PhaseEntry, timing: TargetingTiming): string {
  const times: number[] = [];
  const values: number[] = [];
  for (const target of targets) {
    const start = (target.startTime + timing.slotDuration * phase.start) / timing.cycleDuration;
    const end = (target.startTime + timing.slotDuration * phase.end) / timing.cycleDuration;
    if (times.length === 0) {
      times.push(0);
      values.push(start === 0 ? 1 : 0);
      if (start > 0) {
        times.push(start);
        values.push(1);
      }
    } else {
      times.push(start);
      values.push(1);
    }
    times.push(end);
    values.push(0);
  }
  if ((times.at(-1) ?? 0) < 1) {
    times.push(1);
    values.push(0);
  }
  return `<animate attributeName="opacity" values="${values.join(";")}" keyTimes="${times.map((time) => time.toFixed(5)).join(";")}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

export function renderTargetTimeline(targets: BeamTarget[], theme: ProfileTheme, timing: TargetingTiming): string {
  if (targets.length === 0) return `<g><circle cx="42" cy="327" r="4" fill="${theme.muted}"/><text x="56" y="332" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">NO ACTIVE TARGET</text></g>`;
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
  const lastTarget = targets.at(-1);
  const completionStart = lastTarget ? lastTarget.startTime + timing.slotDuration * PHASE.impactEnd : timing.firingDuration;
  const completionTimes = `0;${(completionStart / timing.cycleDuration).toFixed(5)};${(timing.restoreStart / timing.cycleDuration).toFixed(5)};1`;
  const restoreTimes = `0;${(timing.restoreStart / timing.cycleDuration).toFixed(5)};1`;
  const resetEnd = (timing.initialDelayDuration / timing.cycleDuration).toFixed(5);
  return `<g opacity="0"><circle cx="42" cy="327" r="4" fill="${theme.green}"/><text x="56" y="332" fill="${theme.green}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">MATRIX ONLINE • PROGRESS RESET TO 0%</text><animate attributeName="opacity" values="1;0;0" keyTimes="0;${resetEnd};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/></g>
    ${phases.map((phase) => `<g opacity="0"><circle cx="42" cy="327" r="4" fill="${phase.color}"/><text x="56" y="332" fill="${phase.color}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${phase.label}</text>${repeatedPhaseAnimation(targets, phase, timing)}</g>`).join("\n")}
    <g opacity="0"><circle cx="42" cy="327" r="4" fill="${theme.green}"/><text x="56" y="332" fill="${theme.green}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">CYCLE COMPLETE • 100%</text><animate attributeName="opacity" values="0;1;0;0" keyTimes="${completionTimes}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/></g>
    <g opacity="0"><circle cx="42" cy="327" r="4" fill="${theme.orange}"/><text x="56" y="332" fill="${theme.orange}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">RESTORING MATRIX • REVERSE PROGRESS</text><animate attributeName="opacity" values="0;1;1" keyTimes="${restoreTimes}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/></g>`;
}

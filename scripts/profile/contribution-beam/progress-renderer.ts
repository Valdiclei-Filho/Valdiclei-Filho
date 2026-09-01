import { FONT, PHASE, TYPE, type TargetingTiming } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

const BAR_X = 250;
const BAR_Y = 276;
const BAR_WIDTH = 722;

function impactTimes(targets: BeamTarget[], timing: TargetingTiming): number[] {
  return targets.map((target) => target.startTime + timing.slotDuration * PHASE.impactEnd);
}

function stateVisibility(start: number, end: number, timing: TargetingTiming): string {
  const key = (seconds: number) => (seconds / timing.cycleDuration).toFixed(5);
  if (start === 0) return `<animate attributeName="opacity" values="1;0;0" keyTimes="0;${key(end)};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
  if (end === timing.cycleDuration) return `<animate attributeName="opacity" values="0;1;1" keyTimes="0;${key(start)};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
  return `<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;${key(start)};${key(end)};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

export function renderTargetProgress(targets: BeamTarget[], theme: ProfileTheme, timing: TargetingTiming): string {
  if (targets.length === 0) return `<g data-progress-total="0"><text x="250" y="260" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">ELIMINATION PROGRESS</text><text x="972" y="260" text-anchor="end" fill="${theme.text}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">0 / 0 • 0%</text><rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_WIDTH}" height="8" rx="4" fill="${theme.grid}"/></g>`;
  const hits = impactTimes(targets, timing);
  const widths = targets.map((_, index) => ((index + 1) / targets.length) * BAR_WIDTH);
  const widthValues = [0, ...widths, BAR_WIDTH];
  const widthTimes = [0, ...hits.map((time) => time / timing.cycleDuration), 1];
  const labels = Array.from({ length: targets.length + 1 }, (_, completed) => {
    const start = completed === 0 ? 0 : (hits[completed - 1] ?? 0);
    const end = completed === targets.length ? timing.cycleDuration : (hits[completed] ?? timing.cycleDuration);
    const percentage = targets.length === 0 ? 0 : (completed / targets.length) * 100;
    const formatted = completed === targets.length ? "100" : percentage.toFixed(1).replace(".0", "");
    return `<text x="972" y="260" text-anchor="end" fill="${completed === targets.length && targets.length > 0 ? theme.green : theme.text}" font-family="${FONT.interface}" font-size="${TYPE.metadata}" opacity="0" data-progress-step="${completed}">${completed} / ${targets.length} • ${formatted}%${stateVisibility(start, end, timing)}</text>`;
  }).join("\n");
  return `<g data-progress-total="${targets.length}">
    <text x="250" y="260" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">ELIMINATION PROGRESS</text>
    ${labels}
    <rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_WIDTH}" height="8" rx="4" fill="${theme.grid}"/>
    <rect x="${BAR_X}" y="${BAR_Y}" width="0" height="8" rx="4" fill="${theme.green}" filter="url(#impact-glow-${theme.name})" data-progress-bar="true">
      <animate attributeName="width" values="${widthValues.map((value) => value.toFixed(2)).join(";")}" keyTimes="${widthTimes.map((value) => value.toFixed(5)).join(";")}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
    </rect>
  </g>`;
}

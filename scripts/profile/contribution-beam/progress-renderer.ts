import { FONT, PHASE, TYPE, type TargetingTiming } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

const BAR_X = 250;
const BAR_Y = 276;
const BAR_WIDTH = 722;

function impactTimes(targets: BeamTarget[], timing: TargetingTiming): number[] {
  return targets.map((target) => target.startTime + timing.slotDuration * PHASE.impactEnd);
}

function restoreTimes(targets: BeamTarget[], timing: TargetingTiming): number[] {
  return targets.map((_, index) => timing.restoreStart + (index + 1) * timing.restoreSlotDuration);
}

function stateVisibility(start: number, end: number, timing: TargetingTiming): string {
  const key = (seconds: number) => (seconds / timing.cycleDuration).toFixed(5);
  if (start === 0) return `<animate attributeName="opacity" values="1;0;0" keyTimes="0;${key(end)};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
  if (end >= timing.cycleDuration) return `<animate attributeName="opacity" values="0;1;1" keyTimes="0;${key(start)};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
  return `<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;${key(start)};${key(end)};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

function progressLabel(completed: number, total: number, start: number, end: number, restoring: boolean, theme: ProfileTheme, timing: TargetingTiming): string {
  const percentage = (completed / total) * 100;
  const formatted = completed === total ? "100" : percentage.toFixed(1).replace(".0", "");
  const color = completed === total ? theme.green : restoring ? theme.orange : theme.text;
  return `<text x="972" y="260" text-anchor="end" fill="${color}" font-family="${FONT.interface}" font-size="${TYPE.metadata}" opacity="0" data-progress-step="${completed}" data-progress-direction="${restoring ? "restore" : "fire"}">${completed} / ${total} • ${formatted}%${stateVisibility(start, end, timing)}</text>`;
}

export function renderTargetProgress(targets: BeamTarget[], theme: ProfileTheme, timing: TargetingTiming): string {
  if (targets.length === 0) return `<g data-progress-total="0"><text x="250" y="260" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">TARGET MATRIX PROGRESS</text><text x="972" y="260" text-anchor="end" fill="${theme.text}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">0 / 0 • 0%</text><rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_WIDTH}" height="8" rx="4" fill="${theme.grid}"/></g>`;
  const hits = impactTimes(targets, timing);
  const restores = restoreTimes(targets, timing);
  const widths = targets.map((_, index) => ((index + 1) / targets.length) * BAR_WIDTH);
  const forwardValues = [0, ...widths, BAR_WIDTH, BAR_WIDTH];
  const forwardTimes = [0, ...hits.map((time) => time / timing.cycleDuration), timing.restoreStart / timing.cycleDuration, 1];
  const forwardLabels = Array.from({ length: targets.length + 1 }, (_, completed) => {
    const start = completed === 0 ? 0 : (hits[completed - 1] ?? 0);
    const end = completed === targets.length ? (restores[0] ?? timing.cycleDuration) : (hits[completed] ?? timing.cycleDuration);
    return progressLabel(completed, targets.length, start, end, false, theme, timing);
  });
  const restoreLabels = Array.from({ length: Math.max(0, targets.length - 1) }, (_, index) => {
    const completed = targets.length - index - 1;
    return progressLabel(completed, targets.length, restores[index] ?? timing.restoreStart, restores[index + 1] ?? timing.cycleDuration, true, theme, timing);
  });
  const restoreKey = (timing.restoreStart / timing.cycleDuration).toFixed(5);
  return `<g data-progress-total="${targets.length}" data-restore-duration="${timing.restoreDuration}">
    <text x="250" y="260" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">TARGET MATRIX PROGRESS</text>
    ${[...forwardLabels, ...restoreLabels].join("\n")}
    <rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_WIDTH}" height="8" rx="4" fill="${theme.grid}"/>
    <rect x="${BAR_X}" y="${BAR_Y}" width="0" height="8" rx="4" fill="${theme.green}" filter="url(#impact-glow-${theme.name})" data-progress-bar="fire">
      <animate attributeName="width" values="${forwardValues.map((value) => value.toFixed(2)).join(";")}" keyTimes="${forwardTimes.map((value) => value.toFixed(5)).join(";")}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;0" keyTimes="0;${restoreKey};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
    </rect>
    <rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_WIDTH}" height="8" rx="4" fill="${theme.orange}" filter="url(#impact-glow-${theme.name})" opacity="0" data-progress-bar="restore">
      <animate attributeName="width" values="${BAR_WIDTH};${BAR_WIDTH};0" keyTimes="0;${restoreKey};1" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;1" keyTimes="0;${restoreKey};1" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
    </rect>
  </g>`;
}

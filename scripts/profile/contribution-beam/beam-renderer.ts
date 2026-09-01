import { PHASE, TARGETING, type TargetingTiming } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

function keyTime(seconds: number, timing: TargetingTiming): string {
  return Math.min(1, Math.max(0, seconds / timing.cycleDuration)).toFixed(5);
}

function positionAnimation(attributeName: "x2" | "y2", targets: BeamTarget[], timing: TargetingTiming): string {
  const last = targets.at(-1);
  if (!last) return "";
  const coordinate = attributeName === "x2" ? "x" : "y";
  const values = [String(targets[0]?.[coordinate] ?? last[coordinate]), ...targets.map((target) => String(target[coordinate])), String(last[coordinate])];
  const times = ["0", ...targets.map((target) => keyTime(target.startTime, timing)), "1"];
  return `<animate attributeName="${attributeName}" values="${values.join(";")}" keyTimes="${times.join(";")}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

function pulseAnimation(attributeName: "opacity" | "stroke-dashoffset", targets: BeamTarget[], timing: TargetingTiming): string {
  const values = [attributeName === "opacity" ? "0" : "1"];
  const times = ["0"];
  for (const target of targets) {
    const phase = (ratio: number) => target.startTime + timing.slotDuration * ratio;
    times.push(keyTime(phase(PHASE.lockEnd), timing), keyTime(phase(PHASE.fireEnd), timing), keyTime(phase(PHASE.impactEnd), timing), keyTime(phase(PHASE.residualEnd), timing));
    values.push(...(attributeName === "opacity" ? ["0", "1", "1", "0"] : ["1", "0", "0", "1"]));
  }
  times.push("1");
  values.push(attributeName === "opacity" ? "0" : "1");
  return `<animate attributeName="${attributeName}" values="${values.join(";")}" keyTimes="${times.join(";")}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

function reticleOpacity(targets: BeamTarget[], timing: TargetingTiming): string {
  const values = ["0"];
  const times = ["0"];
  for (const target of targets) {
    const phase = (ratio: number) => target.startTime + timing.slotDuration * ratio;
    times.push(keyTime(phase(PHASE.scanEnd), timing), keyTime(phase(PHASE.acquireEnd), timing), keyTime(phase(PHASE.impactEnd), timing), keyTime(phase(PHASE.residualEnd), timing));
    values.push("0", "1", "1", "0");
  }
  times.push("1");
  values.push("0");
  return `<animate attributeName="opacity" values="${values.join(";")}" keyTimes="${times.join(";")}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

function reticlePosition(targets: BeamTarget[], timing: TargetingTiming): string {
  const last = targets.at(-1);
  if (!last) return "";
  const first = targets[0] ?? last;
  const values = [`${first.x} ${first.y}`, ...targets.map(({ x, y }) => `${x} ${y}`), `${last.x} ${last.y}`];
  const times = ["0", ...targets.map((target) => keyTime(target.startTime, timing)), "1"];
  return `<animateTransform attributeName="transform" type="translate" values="${values.join(";")}" keyTimes="${times.join(";")}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

export function renderTargetBeams(targets: BeamTarget[], theme: ProfileTheme, timing: TargetingTiming): string {
  const first = targets[0];
  if (!first) return "";
  return `<g data-target-count="${targets.length}">
    <line x1="${TARGETING.coreX}" y1="${TARGETING.coreY}" x2="${first.x}" y2="${first.y}" pathLength="1" stroke="${theme.cyan}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" opacity="0" filter="url(#beam-glow-${theme.name})">
      ${positionAnimation("x2", targets, timing)}${positionAnimation("y2", targets, timing)}${pulseAnimation("stroke-dashoffset", targets, timing)}${pulseAnimation("opacity", targets, timing)}
    </line>
    <line x1="${TARGETING.coreX}" y1="${TARGETING.coreY}" x2="${first.x}" y2="${first.y}" pathLength="1" stroke="${theme.orange}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" opacity="0">
      ${positionAnimation("x2", targets, timing)}${positionAnimation("y2", targets, timing)}${pulseAnimation("stroke-dashoffset", targets, timing)}${pulseAnimation("opacity", targets, timing)}
    </line>
    <g transform="translate(${first.x} ${first.y})" opacity="0">
      <circle r="8" fill="none" stroke="${theme.cyan}"/>
      <path d="M-11 0H-6M6 0H11M0-11V-6M0 6V11" stroke="${theme.cyan}"/>
      ${reticlePosition(targets, timing)}${reticleOpacity(targets, timing)}
    </g>
  </g>`;
}

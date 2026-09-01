import { PHASE, type TargetingTiming } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

function keyTime(seconds: number, timing: TargetingTiming): string {
  return Math.min(1, Math.max(0, seconds / timing.cycleDuration)).toFixed(5);
}

function coordinateAnimation(attributeName: "cx" | "cy", targets: BeamTarget[], timing: TargetingTiming, offset = 0): string {
  const coordinate = attributeName === "cx" ? "x" : "y";
  const last = targets.at(-1);
  if (!last) return "";
  const values = [...targets.map((target) => String(target[coordinate] + offset)), String(last[coordinate] + offset)];
  const times = [...targets.map((target) => keyTime(target.startTime, timing)), "1"];
  return `<animate attributeName="${attributeName}" values="${values.join(";")}" keyTimes="${times.join(";")}" calcMode="discrete" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>`;
}

function impactPulse(targets: BeamTarget[], timing: TargetingTiming): { times: string; opacity: string; radius: string } {
  const times = ["0"];
  const opacity = ["0"];
  const radius = ["4"];
  for (const target of targets) {
    const phase = (ratio: number) => target.startTime + timing.slotDuration * ratio;
    times.push(keyTime(phase(PHASE.fireEnd), timing), keyTime(phase(PHASE.impactEnd), timing), keyTime(phase(PHASE.residualEnd), timing));
    opacity.push("0", "1", "0");
    radius.push("4", String(11 + target.level), String(16 + target.level));
  }
  times.push("1");
  opacity.push("0");
  radius.push("4");
  return { times: times.join(";"), opacity: opacity.join(";"), radius: radius.join(";") };
}

export function renderTargetImpacts(targets: BeamTarget[], theme: ProfileTheme, timing: TargetingTiming): string {
  const first = targets[0];
  if (!first) return "";
  const pulse = impactPulse(targets, timing);
  return `<g data-impact-sequence="${targets.length}">
    <circle cx="${first.x}" cy="${first.y}" r="4" fill="none" stroke="${theme.green}" opacity="0" filter="url(#impact-glow-${theme.name})">
      ${coordinateAnimation("cx", targets, timing)}${coordinateAnimation("cy", targets, timing)}
      <animate attributeName="r" values="${pulse.radius}" keyTimes="${pulse.times}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="${pulse.opacity}" keyTimes="${pulse.times}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${first.x + 5}" cy="${first.y - 3}" r="1.5" fill="${theme.orange}" opacity="0">
      ${coordinateAnimation("cx", targets, timing, 5)}${coordinateAnimation("cy", targets, timing, -3)}
      <animate attributeName="opacity" values="${pulse.opacity}" keyTimes="${pulse.times}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
    </circle>
  </g>`;
}

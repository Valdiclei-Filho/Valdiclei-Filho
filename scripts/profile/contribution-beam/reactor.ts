import { PHASE, TARGETING, type TargetingTiming } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

function corePulse(targets: BeamTarget[], timing: TargetingTiming): { times: string; opacity: string; radius: string } {
  const times = ["0"];
  const opacity = ["0"];
  const radius = ["35"];
  for (const target of targets) {
    const phase = (ratio: number) => ((target.startTime + timing.slotDuration * ratio) / timing.cycleDuration).toFixed(5);
    times.push(phase(PHASE.acquireEnd), phase(PHASE.chargeEnd), phase(PHASE.fireEnd), phase(PHASE.residualEnd));
    opacity.push("0", ".85", "1", "0");
    radius.push("35", "43", "39", "35");
  }
  times.push("1");
  opacity.push("0");
  radius.push("35");
  return { times: times.join(";"), opacity: opacity.join(";"), radius: radius.join(";") };
}

export function renderVfCore(theme: ProfileTheme, targets: BeamTarget[], timing: TargetingTiming): string {
  const pulse = corePulse(targets, timing);
  const animation = targets.length > 0 ? `<circle r="35" fill="none" stroke="${theme.green}" stroke-width="2" opacity="0">
      <animate attributeName="r" values="${pulse.radius}" keyTimes="${pulse.times}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="${pulse.opacity}" keyTimes="${pulse.times}" calcMode="linear" dur="${timing.cycleDuration}s" repeatCount="indefinite"/>
    </circle>` : "";
  return `<g transform="translate(${TARGETING.coreX} ${TARGETING.coreY})">
    <circle r="47" fill="${theme.panel}" stroke="${theme.border}"/>
    <circle r="34" fill="none" stroke="${theme.cyan}" stroke-width="2"/>
    <path d="M-43 0H43M0-43V43" stroke="${theme.grid}"/>
    <text y="8" text-anchor="middle" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="24" font-weight="800">VF</text>
    ${animation}
  </g>`;
}

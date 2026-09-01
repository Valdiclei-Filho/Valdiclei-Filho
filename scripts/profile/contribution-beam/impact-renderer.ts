import { PHASE, TARGETING } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

function keyTime(seconds: number): string {
  return (seconds / TARGETING.totalDurationSeconds).toFixed(4);
}

export function renderTargetImpacts(targets: BeamTarget[], theme: ProfileTheme): string {
  const times = `0;${keyTime(PHASE.fireEnd)};${keyTime(PHASE.impactEnd)};${keyTime(PHASE.residualEnd)};${keyTime(PHASE.cooldownEnd)};1`;
  return targets.map((target) => {
    const growth = 1 + target.level * 0.6;
    const x = target.x - TARGETING.cell / 2;
    const y = target.y - TARGETING.cell / 2;
    return `<g data-impact-date="${target.date}">
      <rect x="${x}" y="${y}" width="${TARGETING.cell}" height="${TARGETING.cell}" rx="2" fill="none" stroke="${theme.orange}" stroke-width="1" opacity="0">
        <animate attributeName="x" values="${x};${x};${x - growth};${x};${x};${x}" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
        <animate attributeName="y" values="${y};${y};${y - growth};${y};${y};${y}" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
        <animate attributeName="width" values="${TARGETING.cell};${TARGETING.cell};${TARGETING.cell + growth * 2};${TARGETING.cell};${TARGETING.cell};${TARGETING.cell}" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
        <animate attributeName="height" values="${TARGETING.cell};${TARGETING.cell};${TARGETING.cell + growth * 2};${TARGETING.cell};${TARGETING.cell};${TARGETING.cell}" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0;1;.65;0;0" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
      </rect>
      <circle cx="${target.x}" cy="${target.y}" r="4" fill="none" stroke="${theme.green}" opacity="0" filter="url(#impact-glow-${theme.name})">
        <animate attributeName="r" values="4;4;${11 + target.level};${16 + target.level};4;4" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0;1;.35;0;0" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${target.x + 5}" cy="${target.y - 3}" r="1.5" fill="${theme.orange}" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0;0" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/></circle>
      <circle cx="${target.x - 4}" cy="${target.y + 5}" r="1.2" fill="${theme.green}" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0;0" keyTimes="${times}" begin="${target.startTime}s" dur="${TARGETING.totalDurationSeconds}s" repeatCount="indefinite"/></circle>
    </g>`;
  }).join("\n");
}

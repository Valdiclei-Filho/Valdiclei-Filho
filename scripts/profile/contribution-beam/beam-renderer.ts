import { FONT, PHASE, TARGETING, TYPE } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";
import { escapeXml } from "../svg.js";

function keyTime(seconds: number): string {
  return (seconds / TARGETING.totalDurationSeconds).toFixed(4);
}

export function renderTargetBeams(targets: BeamTarget[], theme: ProfileTheme): string {
  if (targets.length === 0) return `<text x="250" y="230" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.label}">NO ACTIVE TARGET</text>`;
  return targets.map((target) => {
    const length = Math.hypot(target.x - TARGETING.coreX, target.y - TARGETING.coreY).toFixed(2);
    const label = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(`${target.date}T00:00:00Z`)).replace(".", "").toUpperCase();
    const start = target.startTime;
    const total = TARGETING.totalDurationSeconds;
    const beamTimes = `0;${keyTime(PHASE.lockEnd)};${keyTime(PHASE.fireEnd)};${keyTime(PHASE.impactEnd)};${keyTime(PHASE.residualEnd)};1`;
    const reticleTimes = `0;${keyTime(PHASE.scanEnd)};${keyTime(PHASE.acquireEnd)};${keyTime(PHASE.impactEnd)};${keyTime(PHASE.residualEnd)};1`;
    return `<g data-target-date="${escapeXml(target.date)}" data-target-x="${target.x}" data-target-y="${target.y}">
      <g opacity="0">
        <circle cx="${target.x}" cy="${target.y}" r="8" fill="none" stroke="${theme.cyan}"/>
        <path d="M${target.x - 11} ${target.y}H${target.x - 6}M${target.x + 6} ${target.y}H${target.x + 11}M${target.x} ${target.y - 11}V${target.y - 6}M${target.x} ${target.y + 6}V${target.y + 11}" stroke="${theme.cyan}"/>
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${reticleTimes}" begin="${start}s" dur="${total}s" repeatCount="indefinite"/>
      </g>
      <line x1="${TARGETING.coreX}" y1="${TARGETING.coreY}" x2="${target.x}" y2="${target.y}" pathLength="1" stroke="${theme.cyan}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" opacity="0" filter="url(#beam-glow-${theme.name})">
        <animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="${beamTimes}" begin="${start}s" dur="${total}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0;.28;.28;0;0" keyTimes="${beamTimes}" begin="${start}s" dur="${total}s" repeatCount="indefinite"/>
      </line>
      <line x1="${TARGETING.coreX}" y1="${TARGETING.coreY}" x2="${target.x}" y2="${target.y}" pathLength="1" stroke="${theme.orange}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" opacity="0" data-beam-length="${length}">
        <animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="${beamTimes}" begin="${start}s" dur="${total}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${beamTimes}" begin="${start}s" dur="${total}s" repeatCount="indefinite"/>
      </line>
      <g opacity="0"><text x="250" y="274" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">TARGET LOCKED</text><text x="382" y="274" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">${label} • ${target.count} EVENT${target.count === 1 ? "" : "S"}</text>
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${reticleTimes}" begin="${start}s" dur="${total}s" repeatCount="indefinite"/></g>
    </g>`;
  }).join("\n");
}

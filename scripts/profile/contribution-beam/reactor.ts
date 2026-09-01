import { PHASE, TARGETING } from "../design-system.js";
import type { BeamTarget, ProfileTheme } from "../model.js";

export function renderVfCore(theme: ProfileTheme, targets: BeamTarget[]): string {
  const total = TARGETING.totalDurationSeconds;
  const chargeKey = (PHASE.chargeEnd / total).toFixed(4);
  const fireKey = (PHASE.fireEnd / total).toFixed(4);
  const cooldownKey = (PHASE.cooldownEnd / total).toFixed(4);
  return `<g transform="translate(${TARGETING.coreX} ${TARGETING.coreY})">
    <circle r="47" fill="${theme.panel}" stroke="${theme.border}"/>
    <circle r="34" fill="none" stroke="${theme.cyan}" stroke-width="2"/>
    <path d="M-43 0H43M0-43V43" stroke="${theme.grid}"/>
    <text y="8" text-anchor="middle" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="24" font-weight="800">VF</text>
    ${targets.map((target) => `<circle r="35" fill="none" stroke="${theme.green}" stroke-width="2" opacity="0">
      <animate attributeName="r" values="35;35;43;39;35;35" keyTimes="0;${(PHASE.acquireEnd / total).toFixed(4)};${chargeKey};${fireKey};${cooldownKey};1" begin="${target.startTime}s" dur="${total}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0;.85;1;0;0" keyTimes="0;${(PHASE.acquireEnd / total).toFixed(4)};${chargeKey};${fireKey};${cooldownKey};1" begin="${target.startTime}s" dur="${total}s" repeatCount="indefinite"/>
    </circle>`).join("\n")}
  </g>`;
}

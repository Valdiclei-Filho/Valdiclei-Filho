import { ANIMATION_DURATION_SECONDS } from "../config.js";
import type { ProfileTheme } from "../model.js";

export function renderVfCore(theme: ProfileTheme): string {
  return `<g transform="translate(91 139)">
    <circle r="49" fill="none" stroke="${theme.border}" stroke-width="1" stroke-dasharray="5 7">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite"/>
    </circle>
    <ellipse rx="57" ry="27" fill="none" stroke="${theme.cyan}" stroke-opacity=".55" transform="rotate(-24)">
      <animateTransform attributeName="transform" type="rotate" from="-24" to="336" dur="13s" repeatCount="indefinite"/>
    </ellipse>
    <circle r="35" fill="${theme.panel}" stroke="${theme.cyan}" stroke-width="1.5">
      <animate attributeName="stroke-opacity" values=".55;.55;1;1;.55" keyTimes="0;.08;.18;.76;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </circle>
    <circle r="25" fill="${theme.cyan}" fill-opacity=".08" stroke="${theme.green}">
      <animate attributeName="r" values="22;22;29;25;22" keyTimes="0;.08;.18;.76;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
      <animate attributeName="fill-opacity" values=".05;.05;.35;.18;.05" keyTimes="0;.08;.18;.76;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </circle>
    <text x="0" y="8" text-anchor="middle" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="22" font-weight="800">VF</text>
    <text x="0" y="72" text-anchor="middle" fill="${theme.cyan}" font-family="Consolas,monospace" font-size="9" letter-spacing="1.2">INTEGRATION CORE</text>
  </g>`;
}

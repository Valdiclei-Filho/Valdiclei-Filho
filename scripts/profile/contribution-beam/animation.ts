import { ANIMATION_DURATION_SECONDS } from "../config.js";
import type { ProfileTheme } from "../model.js";
import { GRID } from "./contribution-grid.js";

export function renderBeamAnimation(theme: ProfileTheme): string {
  const endX = GRID.x + (GRID.columns - 1) * (GRID.cell + GRID.gap) + GRID.cell;
  const travel = endX - GRID.x;
  const beamLength = endX - 120;
  return `<g>
    <path d="M120 139H${endX}" fill="none" stroke="${theme.cyan}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${beamLength}" stroke-dashoffset="${beamLength}" opacity=".32" filter="url(#beam-glow-${theme.name})">
      <animate attributeName="stroke-dashoffset" values="${beamLength};${beamLength};0;0;${beamLength}" keyTimes="0;.18;.78;.82;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </path>
    <path d="M120 139H${endX}" fill="none" stroke="url(#beam-line-${theme.name})" stroke-width="3" stroke-linecap="round" stroke-dasharray="${beamLength}" stroke-dashoffset="${beamLength}">
      <animate attributeName="stroke-dashoffset" values="${beamLength};${beamLength};0;0;${beamLength}" keyTimes="0;.18;.78;.82;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </path>
    <line x1="${GRID.x}" y1="82" x2="${GRID.x}" y2="194" stroke="${theme.text}" stroke-width="2.5" opacity=".85">
      <animate attributeName="x1" values="${GRID.x};${GRID.x};${endX};${endX}" keyTimes="0;.19;.78;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
      <animate attributeName="x2" values="${GRID.x};${GRID.x};${endX};${endX}" keyTimes="0;.19;.78;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </line>
    <circle cx="${GRID.x}" cy="139" r="5" fill="${theme.text}" stroke="${theme.green}" stroke-width="2" opacity=".9">
      <animate attributeName="cx" values="${GRID.x};${GRID.x};${endX};${endX}" keyTimes="0;.19;.78;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
      <animate attributeName="r" values="4;4;8;4;4" keyTimes="0;.19;.3;.78;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </circle>
    <g transform="translate(${GRID.x} 139)" opacity="0" filter="url(#impact-glow-${theme.name})">
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.19;.22;.78;.82" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="${GRID.x} 139;${GRID.x} 139;${endX} 139;${endX} 139" keyTimes="0;.19;.78;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
      <line x1="0" y1="-57" x2="0" y2="57" stroke="${theme.cyan}" stroke-width="1" opacity=".75"/>
      <circle r="8" fill="none" stroke="${theme.green}" stroke-width="2">
        <animate attributeName="r" values="4;12;5" dur=".55s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur=".55s" repeatCount="indefinite"/>
      </circle>
      <path d="M-17 0H17M0-17V17" stroke="${theme.text}"/>
      <circle cx="-8" cy="-10" r="2" fill="${theme.orange}"><animate attributeName="cy" values="-10;-22;-10" dur=".8s" repeatCount="indefinite"/></circle>
      <circle cx="9" cy="8" r="1.7" fill="${theme.green}"><animate attributeName="cx" values="9;19;9" dur=".65s" repeatCount="indefinite"/></circle>
    </g>
    <path d="M${GRID.x} 209h${travel}" stroke="${theme.grid}" stroke-width="2"/>
    <rect x="${GRID.x}" y="207" width="0" height="4" rx="2" fill="${theme.green}">
      <animate attributeName="width" values="0;0;${travel};${travel}" keyTimes="0;.19;.78;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.18;.22;.8;1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>
    </rect>
  </g>`;
}

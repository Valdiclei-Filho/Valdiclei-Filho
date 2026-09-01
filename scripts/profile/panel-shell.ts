import { FONT, LAYOUT, TYPE } from "./design-system.js";
import type { ProfileTheme } from "./model.js";
import { escapeXml } from "./svg.js";

export function renderPanelShell(theme: ProfileTheme, height: number, section: string, title: string, status = "SYSTEM ONLINE"): string {
  const gridId = `vf-grid-${section.replaceAll(/[^a-z0-9]/gi, "-").toLowerCase()}-${theme.name}`;
  return `<defs>
    <pattern id="${gridId}" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="${theme.grid}" stroke-width="1"/></pattern>
  </defs>
  <rect width="${LAYOUT.canvasWidth}" height="${height}" rx="${LAYOUT.panelRadius}" fill="${theme.background}"/>
  <rect x=".5" y=".5" width="999" height="${height - 1}" rx="${LAYOUT.panelRadius}" fill="url(#${gridId})" fill-opacity=".34" stroke="${theme.border}" stroke-width="${LAYOUT.borderWidth}"/>
  <text x="${LAYOUT.outerPadding}" y="33" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.eyebrow}" letter-spacing="1.2">${escapeXml(section)} // ${escapeXml(title)}</text>
  <circle cx="${LAYOUT.canvasWidth - 208}" cy="28" r="4" fill="${theme.green}"/>
  <text x="${LAYOUT.canvasWidth - LAYOUT.outerPadding}" y="33" text-anchor="end" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${escapeXml(status)}</text>
  <path d="M${LAYOUT.outerPadding} ${LAYOUT.panelHeaderHeight}H${LAYOUT.canvasWidth - LAYOUT.outerPadding}" stroke="${theme.border}" stroke-width="${LAYOUT.borderWidth}"/>`;
}

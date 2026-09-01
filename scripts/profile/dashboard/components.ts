import { FONT, TYPE } from "../design-system.js";
import type { ProfileTheme } from "../model.js";
import { escapeXml, formatNumber, truncate } from "../svg.js";

export function sectionLabel(theme: ProfileTheme, x: number, y: number, index: string, label: string): string {
  return `<text x="${x}" y="${y}" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.section}">${index} // ${escapeXml(label)}</text>`;
}

export function statMetric(theme: ProfileTheme, x: number, y: number, width: number, label: string, value: number, accent: string): string {
  return `<g><path d="M${x} ${y}H${x + width}" stroke="${accent}" stroke-width="2"/>
    <text x="${x}" y="${y + 27}" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${escapeXml(label)}</text>
    <text x="${x}" y="${y + 65}" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.value}" font-weight="700">${formatNumber(value)}</text></g>`;
}

export function languageBar(theme: ProfileTheme, x: number, y: number, name: string, percent: number, color: string): string {
  const width = 268;
  const barWidth = Math.max(3, Math.round(width * percent));
  return `<g><circle cx="${x + 5}" cy="${y - 5}" r="4" fill="${color}"/>
    <text x="${x + 17}" y="${y}" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">${escapeXml(truncate(name, 17))}</text>
    <text x="${x + width}" y="${y}" text-anchor="end" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${Math.round(percent * 100)}%</text>
    <rect x="${x}" y="${y + 12}" width="${width}" height="5" rx="2" fill="${theme.grid}"/><rect x="${x}" y="${y + 12}" width="${barWidth}" height="5" rx="2" fill="${color}"/></g>`;
}

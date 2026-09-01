import type { ProfileTheme } from "../model.js";
import { escapeXml, formatNumber, truncate } from "../svg.js";

export function panel(theme: ProfileTheme, x: number, y: number, width: number, height: number, label: string): string {
  return `<g>
    <path d="M${x + 14} ${y}H${x + width}V${y + height}H${x}V${y + 14}Z" fill="${theme.panel}" stroke="${theme.border}"/>
    <path d="M${x} ${y + 14}L${x + 14} ${y}M${x + width - 36} ${y}h36v36" fill="none" stroke="${theme.cyan}" opacity=".7"/>
    <text x="${x + 18}" y="${y + 27}" fill="${theme.cyan}" font-family="Consolas,monospace" font-size="12" letter-spacing="1">${escapeXml(label)}</text>
  </g>`;
}

export function statCard(theme: ProfileTheme, x: number, y: number, label: string, value: number, accent: string): string {
  return `<g>
    <rect x="${x}" y="${y}" width="166" height="72" rx="3" fill="${theme.panel}" stroke="${theme.grid}"/>
    <path d="M${x} ${y}h38" stroke="${accent}" stroke-width="2"/>
    <text x="${x + 15}" y="${y + 26}" fill="${theme.muted}" font-family="Consolas,monospace" font-size="11">${escapeXml(label)}</text>
    <text x="${x + 15}" y="${y + 56}" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="24" font-weight="700">${formatNumber(value)}</text>
  </g>`;
}

export function languageBar(theme: ProfileTheme, x: number, y: number, name: string, percent: number, color: string): string {
  const barWidth = Math.max(2, Math.round(250 * percent));
  return `<g>
    <circle cx="${x + 5}" cy="${y - 4}" r="4" fill="${color}"/>
    <text x="${x + 17}" y="${y}" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="12">${escapeXml(truncate(name, 15))}</text>
    <text x="${x + 280}" y="${y}" text-anchor="end" fill="${theme.muted}" font-family="Consolas,monospace" font-size="11">${Math.round(percent * 100)}%</text>
    <rect x="${x}" y="${y + 9}" width="280" height="5" rx="2" fill="${theme.grid}"/>
    <rect x="${x}" y="${y + 9}" width="${barWidth}" height="5" rx="2" fill="${color}"/>
  </g>`;
}

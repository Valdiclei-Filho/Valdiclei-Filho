import { ANIMATION_DURATION_SECONDS } from "../config.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { escapeXml } from "../svg.js";

export const GRID = { x: 190, y: 89, cell: 11, gap: 3, columns: 53, rows: 7 } as const;

export function renderContributionGrid(data: ProfileData, theme: ProfileTheme): string {
  const weeks = data.contributionWeeks.slice(-GRID.columns);
  return weeks.map((week, weekIndex) => week.days.map((day) => {
    const x = GRID.x + weekIndex * (GRID.cell + GRID.gap);
    const y = GRID.y + day.weekday * (GRID.cell + GRID.gap);
    const hit = 0.22 + (weekIndex / Math.max(1, weeks.length - 1)) * 0.56;
    const after = Math.min(0.96, hit + 0.045 + day.level * 0.007);
    const pulse = day.count > 0
      ? `<animate attributeName="fill-opacity" values=".88;.88;1;.88" keyTimes="0;${hit.toFixed(3)};${after.toFixed(3)};1" dur="${ANIMATION_DURATION_SECONDS}s" repeatCount="indefinite"/>`
      : "";
    return `<rect x="${x}" y="${y}" width="${GRID.cell}" height="${GRID.cell}" rx="2" fill="${theme.contribution[day.level]}" fill-opacity=".88" stroke="${day.level > 0 ? theme.green : theme.grid}" stroke-opacity="${day.level > 0 ? 0.24 + day.level * 0.12 : 0.35}">
      <title>${escapeXml(day.date)}: ${day.count} contribuição${day.count === 1 ? "" : "ões"}</title>${pulse}
    </rect>`;
  }).join("\n")).join("\n");
}

export function renderMonthMarkers(data: ProfileData, theme: ProfileTheme): string {
  const weeks = data.contributionWeeks.slice(-GRID.columns);
  let previousMonth = -1;
  return weeks.map((week, index) => {
    const date = new Date(`${week.firstDay}T00:00:00Z`);
    const month = date.getUTCMonth();
    if (month === previousMonth) return "";
    previousMonth = month;
    const name = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(date).replace(".", "").toUpperCase();
    return `<text x="${GRID.x + index * (GRID.cell + GRID.gap)}" y="76" fill="${theme.muted}" font-family="Consolas,monospace" font-size="9">${name}</text>`;
  }).join("");
}

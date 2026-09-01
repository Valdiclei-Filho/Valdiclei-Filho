import { FONT, TARGETING, TYPE } from "../design-system.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { escapeXml } from "../svg.js";

export const GRID = { ...TARGETING, x: TARGETING.gridX, y: TARGETING.gridY, gap: TARGETING.gapX } as const;

export function renderContributionGrid(data: ProfileData, theme: ProfileTheme): string {
  const weeks = data.contributionWeeks.slice(-TARGETING.columns);
  return weeks.map((week, weekIndex) => week.days.map((day) => {
    const x = TARGETING.gridX + weekIndex * (TARGETING.cell + TARGETING.gapX);
    const y = TARGETING.gridY + day.weekday * (TARGETING.cell + TARGETING.gapY);
    return `<rect x="${x}" y="${y}" width="${TARGETING.cell}" height="${TARGETING.cell}" rx="2" fill="${theme.contribution[day.level]}" fill-opacity=".9" stroke="${day.level > 0 ? theme.green : theme.grid}" stroke-opacity="${day.level > 0 ? 0.22 + day.level * 0.11 : 0.35}"><title>${escapeXml(day.date)}: ${day.count} contribuição${day.count === 1 ? "" : "ões"}</title></rect>`;
  }).join("\n")).join("\n");
}

export function renderMonthMarkers(data: ProfileData, theme: ProfileTheme): string {
  const weeks = data.contributionWeeks.slice(-TARGETING.columns);
  let previousMonth = -1;
  return weeks.map((week, index) => {
    const date = new Date(`${week.firstDay}T00:00:00Z`);
    const month = date.getUTCMonth();
    if (month === previousMonth) return "";
    previousMonth = month;
    const name = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(date).replace(".", "").toUpperCase();
    return `<text x="${TARGETING.gridX + index * (TARGETING.cell + TARGETING.gapX)}" y="82" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${name}</text>`;
  }).join("");
}

import { GENERATOR_VERSION } from "../config.js";
import { FONT, LAYOUT, TYPE } from "../design-system.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { renderPanelShell } from "../panel-shell.js";
import { escapeXml, formatNumber, svgDocument } from "../svg.js";
import { languageBar, sectionLabel, statMetric } from "./components.js";

function weeklyTotals(data: ProfileData): number[] {
  return data.contributionWeeks.map((week) => week.days.reduce((sum, day) => sum + day.count, 0));
}

function contributionChart(data: ProfileData, theme: ProfileTheme): string {
  const totals = weeklyTotals(data);
  const max = Math.max(1, ...totals);
  const left = 48;
  const top = 315;
  const width = 558;
  const height = 178;
  const points = totals.map((value, index) => {
    const x = left + (index / Math.max(1, totals.length - 1)) * width;
    const y = top + height - (value / max) * (height - 22);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = points.join(" ");
  const area = `${left},${top + height} ${line} ${left + width},${top + height}`;
  return `<defs><linearGradient id="chart-${theme.name}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${theme.green}" stop-opacity=".26"/><stop offset="1" stop-color="${theme.green}" stop-opacity="0"/></linearGradient></defs>
  <path d="M${left} ${top + 55}H${left + width}M${left} ${top + 110}H${left + width}" stroke="${theme.grid}" stroke-dasharray="3 7"/>
  <polygon points="${area}" fill="url(#chart-${theme.name})"/><polyline points="${line}" fill="none" stroke="${theme.green}" stroke-width="2" stroke-linejoin="round"/>
  <text x="${left}" y="${top + height + 26}" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">52 SEMANAS ATRÁS</text>
  <text x="${left + width}" y="${top + height + 26}" text-anchor="end" fill="${theme.green}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">AGORA</text>`;
}

function renderLanguages(data: ProfileData, theme: ProfileTheme): string {
  const displayed = data.languages.slice(0, 6);
  const total = Math.max(1, displayed.reduce((sum, language) => sum + language.bytes, 0));
  return displayed.map((language, index) => languageBar(theme, 672, 322 + index * 44, language.name, language.bytes / total, language.color)).join("\n");
}

export function renderDashboard(data: ProfileData, theme: ProfileTheme): string {
  const height = 620;
  const generatedDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" }).format(new Date(data.generatedAt));
  const stats = data.statistics;
  const metricWidth = 173;
  const metrics: Array<[string, number, string]> = [
    ["CONTRIBUIÇÕES / 12M", stats.contributions, theme.green], ["COMMITS / 12M", stats.commits, theme.cyan],
    ["PULL REQUESTS / 12M", stats.pullRequests, theme.orange], ["ISSUES / 12M", stats.issues, theme.cyan], ["REPOSITÓRIOS", stats.repositories, theme.green]
  ];
  const body = `${renderPanelShell(theme, height, "02", "GITHUB TELEMETRY", `SYNC ${generatedDate.toUpperCase()}`)}
  ${metrics.map(([label, value, accent], index) => statMetric(theme, 42 + index * 190, 79, metricWidth, label, value, accent)).join("\n")}
  <path d="M${LAYOUT.outerPadding} 174H${1000 - LAYOUT.outerPadding}" stroke="${theme.border}"/>
  ${sectionLabel(theme, 42, 213, "A", "CONTRIBUTION SIGNAL")}
  <text x="42" y="254" fill="${theme.text}" font-family="${FONT.content}" font-size="21" font-weight="700">${formatNumber(stats.contributions)} eventos registrados</text>
  <text x="42" y="280" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">AGREGAÇÃO OFICIAL • ÚLTIMOS 12 MESES</text>
  ${contributionChart(data, theme)}
  <path d="M638 198V568" stroke="${theme.border}"/>
  ${sectionLabel(theme, 672, 213, "B", "REPOSITORY LANGUAGES")}
  <text x="672" y="254" fill="${theme.text}" font-family="${FONT.content}" font-size="18" font-weight="650">Distribuição técnica</text>
  <text x="672" y="280" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">BYTES DOS REPOSITÓRIOS • NÃO COMMITS</text>
  ${renderLanguages(data, theme)}
  <path d="M${LAYOUT.outerPadding} 574H${1000 - LAYOUT.outerPadding}" stroke="${theme.border}"/>
  <circle cx="42" cy="597" r="4" fill="${theme.green}"/><text x="56" y="602" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">OFFICIAL GITHUB GRAPHQL DATA • ${escapeXml(GENERATOR_VERSION)}</text>`;
  return svgDocument(`GitHub Telemetry de ${data.displayName}`, `Telemetria oficial com ${stats.contributions} contribuições, ${stats.commits} commits, ${stats.pullRequests} pull requests, ${stats.issues} issues e ${stats.repositories} repositórios.`, 1000, height, body);
}

import { GENERATOR_VERSION } from "../config.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { escapeXml, formatNumber, svgDocument } from "../svg.js";
import { languageBar, panel, statCard } from "./components.js";

function weeklyTotals(data: ProfileData): number[] {
  return data.contributionWeeks.map((week) => week.days.reduce((sum, day) => sum + day.count, 0));
}

function contributionChart(data: ProfileData, theme: ProfileTheme): string {
  const totals = weeklyTotals(data);
  const max = Math.max(1, ...totals);
  const left = 49;
  const top = 265;
  const width = 545;
  const height = 150;
  const points = totals.map((value, index) => {
    const x = left + (index / Math.max(1, totals.length - 1)) * width;
    const y = top + height - (value / max) * (height - 18);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = points.join(" ");
  const area = `${left},${top + height} ${line} ${left + width},${top + height}`;
  return `<defs>
    <linearGradient id="chart-fill-${theme.name}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${theme.green}" stop-opacity=".38"/><stop offset="1" stop-color="${theme.green}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M${left} ${top + 38}H${left + width}M${left} ${top + 78}H${left + width}M${left} ${top + 118}H${left + width}" stroke="${theme.grid}" stroke-dasharray="3 5"/>
    <polygon points="${area}" fill="url(#chart-fill-${theme.name})"/>
    <polyline points="${line}" fill="none" stroke="${theme.green}" stroke-width="2" stroke-linejoin="round"/>
    <text x="${left}" y="${top + height + 22}" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">52 SEMANAS ATRÁS</text>
    <text x="${left + width}" y="${top + height + 22}" text-anchor="end" fill="${theme.green}" font-family="Consolas,monospace" font-size="10">AGORA</text>
  </g>`;
}

function renderLanguages(data: ProfileData, theme: ProfileTheme): string {
  const displayed = data.languages.slice(0, 6);
  const total = Math.max(1, displayed.reduce((sum, language) => sum + language.bytes, 0));
  return displayed.map((language, index) => languageBar(theme, 646, 280 + index * 43, language.name, language.bytes / total, language.color)).join("\n");
}

export function renderDashboard(data: ProfileData, theme: ProfileTheme): string {
  const generatedDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" }).format(new Date(data.generatedAt));
  const stats = data.statistics;
  const body = `
  <rect width="980" height="600" rx="8" fill="${theme.background}"/>
  <path d="M0 32H980M20 0V600M960 0V600" stroke="${theme.grid}" opacity=".55"/>
  <g opacity=".14" stroke="${theme.cyan}">${Array.from({ length: 25 }, (_, index) => `<path d="M${20 + index * 40} 0V600"/>`).join("")}</g>
  <text x="38" y="34" fill="${theme.cyan}" font-family="Consolas,monospace" font-size="13" letter-spacing="1.4">GITHUB COMMAND CENTER // ${GENERATOR_VERSION}</text>
  <text x="942" y="34" text-anchor="end" fill="${theme.muted}" font-family="Consolas,monospace" font-size="11">SYNC ${escapeXml(generatedDate.toUpperCase())}</text>
  ${panel(theme, 28, 54, 924, 112, "01 // TELEMETRIA DO PERFIL")}
  ${statCard(theme, 47, 82, "CONTRIBUIÇÕES / 1 ANO", stats.contributions, theme.green)}
  ${statCard(theme, 225, 82, "COMMITS / 1 ANO", stats.commits, theme.cyan)}
  ${statCard(theme, 403, 82, "PULL REQUESTS / 1 ANO", stats.pullRequests, theme.orange)}
  ${statCard(theme, 581, 82, "ISSUES / 1 ANO", stats.issues, theme.cyan)}
  ${statCard(theme, 759, 82, "REPOSITÓRIOS", stats.repositories, theme.green)}
  ${panel(theme, 28, 184, 592, 376, "02 // SINAL DE CONTRIBUIÇÕES")}
  <text x="49" y="241" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="18" font-weight="700">${formatNumber(stats.contributions)} eventos registrados</text>
  <text x="49" y="260" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">AGREGAÇÃO OFICIAL DO GITHUB • ÚLTIMOS 12 MESES</text>
  ${contributionChart(data, theme)}
  <circle cx="49" cy="522" r="5" fill="${theme.green}"/><text x="63" y="526" fill="${theme.muted}" font-family="Consolas,monospace" font-size="11">SINAL ATIVO // DADOS NORMALIZADOS</text>
  ${panel(theme, 632, 184, 320, 376, "03 // LINGUAGENS DOS REPOSITÓRIOS")}
  <text x="650" y="242" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">DISTRIBUIÇÃO POR BYTES • NÃO POR COMMITS</text>
  ${renderLanguages(data, theme)}
  <text x="650" y="535" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">FONTE: GITHUB GRAPHQL API</text>
  <path d="M8 8h25M8 8v25M972 8h-25M972 8v25M8 592h25M8 592v-25M972 592h-25M972 592v-25" stroke="${theme.cyan}"/>
  `;
  return svgDocument(
    `GitHub Command Center de ${data.displayName}`,
    `Dashboard atualizado com ${stats.contributions} contribuições, ${stats.commits} commits, ${stats.pullRequests} pull requests, ${stats.issues} issues e ${stats.repositories} repositórios.`,
    980,
    600,
    body
  );
}

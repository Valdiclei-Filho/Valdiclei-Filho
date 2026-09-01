import { GENERATOR_VERSION } from "../config.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { escapeXml, formatNumber, svgDocument } from "../svg.js";
import { renderBeamAnimation } from "./animation.js";
import { GRID, renderContributionGrid, renderMonthMarkers } from "./contribution-grid.js";
import { renderVfCore } from "./reactor.js";

export function renderContributionBeam(data: ProfileData, theme: ProfileTheme): string {
  const stats = data.statistics;
  const body = `
  <defs>
    <filter id="beam-glow-${theme.name}" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="impact-glow-${theme.name}" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="1.5"/></filter>
    <linearGradient id="beam-line-${theme.name}" gradientUnits="userSpaceOnUse" x1="120" y1="139" x2="930" y2="139"><stop stop-color="${theme.cyan}"/><stop offset=".74" stop-color="${theme.green}"/><stop offset="1" stop-color="${theme.text}"/></linearGradient>
  </defs>
  <rect width="980" height="330" rx="8" fill="${theme.background}"/>
  <g opacity=".18" stroke="${theme.cyan}">${Array.from({ length: 25 }, (_, index) => `<path d="M${20 + index * 40} 0V330"/>`).join("")}</g>
  <path d="M0 42H980M20 0V330M960 0V330" stroke="${theme.grid}"/>
  <text x="37" y="28" fill="${theme.cyan}" font-family="Consolas,monospace" font-size="13" letter-spacing="1.2">VF CONTRIBUTION ENGINE // ENERGY BEAM</text>
  <text x="943" y="28" text-anchor="end" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">${GENERATOR_VERSION} • MATRIZ REAL ${data.contributionWeeks.slice(-GRID.columns).length}×7</text>
  ${renderMonthMarkers(data, theme)}
  ${renderContributionGrid(data, theme)}
  ${renderBeamAnimation(theme)}
  ${renderVfCore(theme)}
  <g transform="translate(190 239)">
    <text x="0" y="0" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">CICLO DE ENERGIA</text>
    <path d="M0 21H738" stroke="${theme.grid}"/>
    ${["CARREGAR", "MIRAR", "DISPARAR", "ENERGIZAR", "RESFRIAR", "REINICIAR"].map((label, index) => {
      const x = index * 145;
      const color = index === 2 ? theme.orange : index === 3 ? theme.green : theme.cyan;
      return `<circle cx="${x}" cy="21" r="4" fill="${color}"/><text x="${x}" y="43" fill="${theme.muted}" font-family="Consolas,monospace" font-size="9">${label}</text>`;
    }).join("")}
  </g>
  <g transform="translate(38 300)">
    <circle r="4" fill="${theme.green}"/><text x="13" y="4" fill="${theme.text}" font-family="Segoe UI,Arial,sans-serif" font-size="11">${formatNumber(stats.contributions)} contribuições nos últimos 12 meses</text>
    <text x="905" y="4" text-anchor="end" fill="${theme.muted}" font-family="Consolas,monospace" font-size="10">INTENSIDADE = CONTAGEM OFICIAL • ${escapeXml(data.login.toUpperCase())}</text>
  </g>
  <path d="M8 8h25M8 8v25M972 8h-25M972 8v25M8 322h25M8 322v-25M972 322h-25M972 322v-25" stroke="${theme.cyan}"/>
  `;
  return svgDocument(
    `VF Energy Beam de ${data.displayName}`,
    `Matriz anual real de contribuições com feixe de energia animado. Células mais intensas representam mais contribuições; total atual de ${stats.contributions}.`,
    980,
    330,
    body
  );
}

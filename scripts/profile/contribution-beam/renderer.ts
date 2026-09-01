import { GENERATOR_VERSION } from "../config.js";
import { EFFECT, FONT, TARGETING, TYPE } from "../design-system.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { renderPanelShell } from "../panel-shell.js";
import { escapeXml, formatNumber, svgDocument } from "../svg.js";
import { renderTargetBeams } from "./beam-renderer.js";
import { renderContributionGrid, renderMonthMarkers } from "./contribution-grid.js";
import { renderTargetImpacts } from "./impact-renderer.js";
import { renderVfCore } from "./reactor.js";
import { selectBeamTargets } from "./target-selector.js";
import { renderTargetTimeline } from "./target-timeline.js";

export function renderContributionBeam(data: ProfileData, theme: ProfileTheme): string {
  const height = 360;
  const targets = selectBeamTargets(data);
  const stats = data.statistics;
  const body = `<defs>
    <filter id="beam-glow-${theme.name}" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="${EFFECT.beamGlow}"/></filter>
    <filter id="impact-glow-${theme.name}" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="${EFFECT.impactGlow}"/></filter>
  </defs>
  ${renderPanelShell(theme, height, "03", "CONTRIBUTION TARGETING", `${GENERATOR_VERSION} • ${targets.length} TARGETS`)}
  ${renderMonthMarkers(data, theme)}
  ${renderContributionGrid(data, theme)}
  ${renderTargetBeams(targets, theme)}
  ${renderTargetImpacts(targets, theme)}
  ${renderVfCore(theme, targets)}
  <text x="112" y="220" text-anchor="middle" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">VF INTEGRATION CORE</text>
  <path d="M28 298H972" stroke="${theme.border}"/>
  ${renderTargetTimeline(targets, theme)}
  <text x="972" y="332" text-anchor="end" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${formatNumber(stats.contributions)} CONTRIBUTIONS / 12M • REAL MATRIX ${data.contributionWeeks.slice(-TARGETING.columns).length}×7 • ${escapeXml(data.login.toUpperCase())}</text>`;
  return svgDocument(`Contribution Targeting System de ${data.displayName}`, `Sistema animado seleciona ${targets.length} contribuições reais, carrega o VF Core e dispara individualmente até o centro de cada célula.`, 1000, height, body);
}

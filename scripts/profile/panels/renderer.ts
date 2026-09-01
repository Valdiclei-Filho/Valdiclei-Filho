import { FONT, LAYOUT, TYPE } from "../design-system.js";
import type { ProfileData, ProfileTheme } from "../model.js";
import { renderPanelShell } from "../panel-shell.js";
import { escapeXml, svgDocument } from "../svg.js";

function statusDot(theme: ProfileTheme, x: number, y: number, label: string): string {
  return `<circle cx="${x}" cy="${y}" r="4" fill="${theme.green}"/><text x="${x + 12}" y="${y + 5}" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${escapeXml(label)}</text>`;
}

export function renderIdentityPanel(data: ProfileData, theme: ProfileTheme): string {
  const height = 300;
  const body = `${renderPanelShell(theme, height, "00", "IDENTITY", "CONNECTION AVAILABLE")}
  <g transform="translate(118 156)">
    <circle r="58" fill="${theme.panel}" stroke="${theme.border}"/>
    <circle r="43" fill="none" stroke="${theme.cyan}" stroke-width="2"/>
    <path d="M-52 0H52M0-52V52" stroke="${theme.grid}"/>
    <path d="M-35-35A50 50 0 0 1 38-31" fill="none" stroke="${theme.orange}" stroke-width="2"/>
    <text y="10" text-anchor="middle" fill="${theme.text}" font-family="${FONT.content}" font-size="34" font-weight="800">VF</text>
  </g>
  <text x="218" y="116" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.title}" font-weight="750">${escapeXml(data.displayName)}</text>
  <text x="220" y="154" fill="${theme.green}" font-family="${FONT.interface}" font-size="21" letter-spacing=".8">DESENVOLVEDOR DE INTEGRAÇÕES</text>
  <text x="220" y="190" fill="${theme.muted}" font-family="${FONT.content}" font-size="${TYPE.body}">APIs, sistemas corporativos e automação confiável.</text>
  <text x="220" y="226" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.label}">CONECTAR  &gt;  VALIDAR  &gt;  TRANSFORMAR  &gt;  ENTREGAR</text>
  <path d="M704 88V236" stroke="${theme.border}"/>
  <text x="738" y="112" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">OPERATION BASE</text>
  <text x="738" y="140" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">${escapeXml(data.location)}</text>
  ${statusDot(theme, 742, 179, "INTEGRATION SYSTEMS")}
  ${statusDot(theme, 742, 207, "OBSERVABILITY")}
  ${statusDot(theme, 742, 235, "DATA & REPORTING")}
  <text x="${LAYOUT.outerPadding}" y="278" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">CONECTANDO SISTEMAS. ENTREGANDO VALOR.</text>`;
  return svgDocument("VF Integration Command Center", `Identidade profissional de ${data.displayName}, desenvolvedor de integrações em ${data.location}.`, 1000, height, body);
}

export function renderStackPanel(theme: ProfileTheme): string {
  const height = 276;
  const rows: ReadonlyArray<readonly [string, string]> = [
    ["RUNTIME & DELIVERY", "Docker  •  Node.js  •  TypeScript  •  AWS Lambda"],
    ["INTEGRATION PROTOCOLS", "REST  •  SOAP"],
    ["DATA & REPORTING", "SQL  •  MySQL  •  JasperReports"],
    ["OBSERVABILITY", "CloudWatch  •  Dynatrace"]
  ];
  const body = `${renderPanelShell(theme, height, "01", "SYSTEM STACK")}
  ${rows.map(([label, values], index) => {
    const y = 86 + index * 40;
    return `<text x="42" y="${y}" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${escapeXml(label)}</text>
    <text x="278" y="${y}" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}" font-weight="600">${escapeXml(values)}</text>
    <path d="M42 ${y + 13}H958" stroke="${theme.grid}"/>`;
  }).join("\n")}
  <rect x="42" y="238" width="916" height="23" rx="3" fill="${theme.panelSecondary}"/>
  <text x="54" y="254" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">EVOLUTION TRACK</text>
  <text x="278" y="254" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">Python   FastAPI   PostgreSQL</text>`;
  return svgDocument("VF System Stack", "Stack principal com Docker, Node.js, TypeScript, AWS Lambda, REST, SOAP, SQL, MySQL, JasperReports, CloudWatch e Dynatrace; Python, FastAPI e PostgreSQL em evolução.", 1000, height, body);
}

export function renderModulesPanel(theme: ProfileTheme): string {
  const height = 426;
  const modules = [
    { number: "01", title: "INTEGRATION SYSTEMS", technologies: "ERP • CRM • API     REST • SOAP • SFTP", flow: "CONNECT > MAP > TRANSFORM > DELIVER" },
    { number: "02", title: "OBSERVABILITY", technologies: "CloudWatch • Dynatrace • Structured Logs", flow: "MONITOR > TRACE > DIAGNOSE > RECOVER" },
    { number: "03", title: "DATA & REPORTING", technologies: "SQL • MySQL • JasperReports     JSON • XML • JRXML", flow: "QUERY > STRUCTURE > REPORT > DELIVER" }
  ];
  const body = `${renderPanelShell(theme, height, "04", "OPERATION MODULES")}
  ${modules.map((module, index) => {
    const y = 70 + index * 111;
    return `<g>
      <text x="44" y="${y + 22}" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.section}">MODULE ${module.number}</text>
      ${statusDot(theme, 886, y + 17, "ONLINE")}
      <text x="196" y="${y + 22}" fill="${theme.text}" font-family="${FONT.content}" font-size="20" font-weight="700">${escapeXml(module.title)}</text>
      <text x="196" y="${y + 51}" fill="${theme.muted}" font-family="${FONT.content}" font-size="${TYPE.label}">${escapeXml(module.technologies)}</text>
      <text x="196" y="${y + 79}" fill="${theme.green}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${escapeXml(module.flow)}</text>
      <path d="M44 ${y + 96}H956" stroke="${theme.border}"/>
    </g>`;
  }).join("\n")}`;
  return svgDocument("VF Operation Modules", "Subsistemas de integrações corporativas, observabilidade, dados e relatórios.", 1000, height, body);
}

export function renderDirectivesProjectsPanel(theme: ProfileTheme): string {
  const height = 402;
  const directives = [
    "CLAREZA ANTES DA COMPLEXIDADE",
    "CÓDIGO LIMPO, OBSERVÁVEL E RESILIENTE",
    "AUTOMAÇÃO COM PROPÓSITO",
    "DOCUMENTAÇÃO QUE GERA VALOR",
    "EVOLUÇÃO CONTÍNUA"
  ];
  const channels: ReadonlyArray<readonly [string, string]> = [
    ["INTEGRATION & DATA", "IntegrationCSV_TXT  /  Book_Control"],
    ["APPLICATIONS", "Gestao_Viagem  /  park-ease"],
    ["LAB", "Banana_MQTT  /  SocialMedia"]
  ];
  const body = `${renderPanelShell(theme, height, "05", "SYSTEM DIRECTIVES + PROJECT CHANNELS")}
  <text x="42" y="82" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">SYSTEM DIRECTIVES</text>
  ${directives.map((directive, index) => {
    const y = 113 + index * 34;
    return `<text x="44" y="${y}" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${String(index + 1).padStart(2, "0")}</text><text x="84" y="${y}" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">${directive}</text>`;
  }).join("\n")}
  <path d="M560 76V246" stroke="${theme.border}"/>
  <text x="596" y="82" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">PROJECT CHANNELS</text>
  ${channels.map(([label, projects], index) => {
    const y = 121 + index * 54;
    return `<text x="596" y="${y}" fill="${theme.cyan}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">${escapeXml(label)}</text><text x="596" y="${y + 23}" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">${escapeXml(projects)}</text>`;
  }).join("\n")}
  <path d="M42 274H958" stroke="${theme.border}"/>
  <text x="42" y="307" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">OPERATING PRINCIPLE</text>
  <text x="42" y="342" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.body}">Integrações bem-feitas são invisíveis, mas essenciais.</text>
  <text x="42" y="372" fill="${theme.muted}" font-family="${FONT.content}" font-size="${TYPE.label}">Clareza, documentação e sistemas confiáveis que simplificam o dia a dia das pessoas.</text>`;
  return svgDocument("VF System Directives e Project Channels", "Princípios de trabalho e canais dos projetos públicos de Valdiclei Filho.", 1000, height, body);
}

export function renderTerminalPanel(data: ProfileData, theme: ProfileTheme): string {
  const height = 232;
  const body = `${renderPanelShell(theme, height, "06", "COMMUNICATION TERMINAL")}
  <text x="42" y="91" fill="${theme.green}" font-family="${FONT.interface}" font-size="${TYPE.body}">integracoes@vf:~$</text>
  <text x="220" y="91" fill="${theme.text}" font-family="${FONT.interface}" font-size="${TYPE.body}">conectar &gt; validar &gt; transformar &gt; entregar</text>
  <rect x="42" y="108" width="9" height="15" fill="${theme.cyan}"><animate attributeName="opacity" values="1;1;0;0" dur="1s" repeatCount="indefinite"/></rect>
  <path d="M42 144H958" stroke="${theme.border}"/>
  <text x="42" y="178" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">LOCATION</text>
  <text x="42" y="202" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">${escapeXml(data.location)}</text>
  <text x="350" y="178" fill="${theme.muted}" font-family="${FONT.interface}" font-size="${TYPE.metadata}">CHANNELS</text>
  <text x="350" y="202" fill="${theme.text}" font-family="${FONT.content}" font-size="${TYPE.label}">GitHub  /  LinkedIn  /  contato@valdiclei.dev</text>
  ${statusDot(theme, 866, 197, "ONLINE")}`;
  return svgDocument("VF Communication Terminal", `Terminal de contato de ${data.displayName} em ${data.location}.`, 1000, height, body);
}

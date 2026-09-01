export const LAYOUT = {
  canvasWidth: 1000,
  outerPadding: 28,
  sectionGap: 16,
  panelPadding: 24,
  gridUnit: 8,
  panelRadius: 10,
  borderWidth: 1,
  panelHeaderHeight: 52
} as const;

export const TYPE = {
  eyebrow: 13,
  section: 15,
  title: 44,
  value: 28,
  body: 17,
  label: 14,
  metadata: 12
} as const;

export const FONT = {
  interface: "Consolas,ui-monospace,monospace",
  content: "Segoe UI,Arial,sans-serif"
} as const;

export const EFFECT = {
  coreGlow: 3,
  beamGlow: 4,
  impactGlow: 2
} as const;

export const TARGETING = {
  targetCount: 4,
  targetSlotSeconds: 5,
  totalDurationSeconds: 20,
  coreX: 112,
  coreY: 151,
  gridX: 250,
  gridY: 96,
  cell: 10,
  gapX: 3,
  gapY: 3,
  columns: 53,
  rows: 7
} as const;

export const PHASE = {
  scanEnd: 0.7,
  acquireEnd: 1.2,
  chargeEnd: 2,
  lockEnd: 2.35,
  fireEnd: 2.7,
  impactEnd: 3.2,
  residualEnd: 4,
  cooldownEnd: 5
} as const;

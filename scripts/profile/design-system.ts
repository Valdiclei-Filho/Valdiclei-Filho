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
  minimumCycleSeconds: 20,
  maximumCycleSeconds: 60,
  secondsPerTarget: 0.85,
  initialDelaySeconds: 1,
  completionHoldSeconds: 2.5,
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
  scanEnd: 0.12,
  acquireEnd: 0.28,
  chargeEnd: 0.48,
  lockEnd: 0.6,
  fireEnd: 0.74,
  impactEnd: 0.84,
  residualEnd: 0.94,
  cooldownEnd: 1
} as const;

export type TargetingTiming = {
  cycleDuration: number;
  firingDuration: number;
  initialDelayDuration: number;
  completionHoldDuration: number;
  slotDuration: number;
};

export function getTargetingTiming(targetCount: number): TargetingTiming {
  const completionHoldDuration = TARGETING.completionHoldSeconds;
  const initialDelayDuration = TARGETING.initialDelaySeconds;
  const requestedCycle = initialDelayDuration + targetCount * TARGETING.secondsPerTarget + completionHoldDuration;
  const cycleDuration = Math.min(TARGETING.maximumCycleSeconds, Math.max(TARGETING.minimumCycleSeconds, requestedCycle));
  const firingDuration = cycleDuration - initialDelayDuration - completionHoldDuration;
  return {
    cycleDuration,
    firingDuration,
    initialDelayDuration,
    completionHoldDuration,
    slotDuration: targetCount > 0 ? firingDuration / targetCount : firingDuration
  };
}

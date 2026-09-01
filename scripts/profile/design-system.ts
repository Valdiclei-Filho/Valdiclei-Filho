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
  minimumFiringSeconds: 18,
  maximumFiringSeconds: 90,
  secondsPerTarget: 2,
  minimumRestoreSeconds: 4,
  maximumRestoreSeconds: 30,
  secondsPerRestoreTarget: 0.45,
  initialDelaySeconds: 1.5,
  completionHoldSeconds: 1.5,
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
  restoreDuration: number;
  restoreStart: number;
  slotDuration: number;
  restoreSlotDuration: number;
};

export function getTargetingTiming(targetCount: number): TargetingTiming {
  const completionHoldDuration = TARGETING.completionHoldSeconds;
  const initialDelayDuration = TARGETING.initialDelaySeconds;
  const firingDuration = Math.min(TARGETING.maximumFiringSeconds, Math.max(TARGETING.minimumFiringSeconds, targetCount * TARGETING.secondsPerTarget));
  const restoreDuration = Math.min(TARGETING.maximumRestoreSeconds, Math.max(TARGETING.minimumRestoreSeconds, targetCount * TARGETING.secondsPerRestoreTarget));
  const restoreStart = initialDelayDuration + firingDuration + completionHoldDuration;
  const cycleDuration = restoreStart + restoreDuration;
  return {
    cycleDuration,
    firingDuration,
    initialDelayDuration,
    completionHoldDuration,
    restoreDuration,
    restoreStart,
    slotDuration: targetCount > 0 ? firingDuration / targetCount : firingDuration,
    restoreSlotDuration: targetCount > 0 ? restoreDuration / targetCount : restoreDuration
  };
}

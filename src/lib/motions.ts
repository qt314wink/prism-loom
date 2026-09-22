export type MotionId = "drift" | "bloom" | "spin" | "pulse" | "lattice" | "storm" | "veil";

export type Motion = {
  id: MotionId;
  title: string;
  note: string;
  folds: number;
  spin: number;
  zoomAmp: number;
  zoomHz: number;
  breath: number;
};

export const MOTIONS: Motion[] = [
  {
    id: "drift",
    title: "Drift",
    note: "Slow orbital spin",
    folds: 8,
    spin: 0.14,
    zoomAmp: 0.045,
    zoomHz: 0.07,
    breath: 0.02,
  },
  {
    id: "bloom",
    title: "Bloom",
    note: "Petals breathe open",
    folds: 10,
    spin: 0.045,
    zoomAmp: 0.18,
    zoomHz: 0.11,
    breath: 0.08,
  },
  {
    id: "spin",
    title: "Spin",
    note: "Hard angular turn",
    folds: 12,
    spin: 0.62,
    zoomAmp: 0.025,
    zoomHz: 0.22,
    breath: 0,
  },
  {
    id: "pulse",
    title: "Pulse",
    note: "Core heartbeat",
    folds: 8,
    spin: 0.08,
    zoomAmp: 0.22,
    zoomHz: 0.52,
    breath: 0.12,
  },
  {
    id: "lattice",
    title: "Lattice",
    note: "High-fold crystal",
    folds: 16,
    spin: 0.055,
    zoomAmp: 0.06,
    zoomHz: 0.16,
    breath: 0.03,
  },
  {
    id: "storm",
    title: "Storm",
    note: "Violent fold weather",
    folds: 6,
    spin: 0.92,
    zoomAmp: 0.28,
    zoomHz: 0.38,
    breath: 0.16,
  },
  {
    id: "veil",
    title: "Veil",
    note: "Soft eight-fold drift",
    folds: 8,
    spin: 0.05,
    zoomAmp: 0.1,
    zoomHz: 0.08,
    breath: 0.05,
  },
];

export const MOTION_BY_ID: Record<MotionId, Motion> = Object.fromEntries(
  MOTIONS.map((m) => [m.id, m]),
) as Record<MotionId, Motion>;

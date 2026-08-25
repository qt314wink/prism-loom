import {
  KEYFRAME_EDITS,
  MORPHS,
  PLATE_BY_ID,
  type PlateId,
  type PlateTokens,
} from "./plates";

export type MotionId =
  | "spin-breathe"
  | "bloom"
  | "unfold"
  | "petal-wave"
  | "color-tide"
  | "gem-pulse"
  | "drift-morph"
  | "mirror-storm";

export type MotionRecipe = {
  id: MotionId;
  label: string;
  blurb: string;
  rotSpeed: number;
  zoomAmp: number;
  zoomHz: number;
  pulseAmp: number;
  offsetAmp: number;
  hueAmp: number;
  foldOsc: number;
  videoBeat: string;
};

export const MOTIONS: MotionRecipe[] = [
  {
    id: "spin-breathe",
    label: "Spin Breathe",
    blurb: "Slow clockwise rotation with a living zoom.",
    rotSpeed: 0.18,
    zoomAmp: 0.055,
    zoomHz: 0.35,
    pulseAmp: 0.35,
    offsetAmp: 0,
    hueAmp: 0,
    foldOsc: 0,
    videoBeat: "slowly rotates clockwise around its exact center while the whole mandala breathes in scale",
  },
  {
    id: "bloom",
    label: "Center Bloom",
    blurb: "Zoom into the nucleus, then pull back.",
    rotSpeed: 0.08,
    zoomAmp: 0.14,
    zoomHz: 0.22,
    pulseAmp: 0.8,
    offsetAmp: 0,
    hueAmp: 0,
    foldOsc: 0,
    videoBeat: "the core blooms brighter as the camera eases in and out from the exact center",
  },
  {
    id: "unfold",
    label: "Fold Unfold",
    blurb: "Wedge count swells and recedes.",
    rotSpeed: 0.1,
    zoomAmp: 0.03,
    zoomHz: 0.3,
    pulseAmp: 0.2,
    offsetAmp: 0,
    hueAmp: 0,
    foldOsc: 2.2,
    videoBeat: "kaleidoscope folds multiply and recede as if the flower is unfolding",
  },
  {
    id: "petal-wave",
    label: "Petal Wave",
    blurb: "A small offset drift makes petals swim.",
    rotSpeed: 0.12,
    zoomAmp: 0.04,
    zoomHz: 0.4,
    pulseAmp: 0.25,
    offsetAmp: 0.55,
    hueAmp: 0,
    foldOsc: 0,
    videoBeat: "petals swim in a slow radial wave while the camera stays locked on center",
  },
  {
    id: "color-tide",
    label: "Color Tide",
    blurb: "Hue drifts like a tide across the plate.",
    rotSpeed: 0.07,
    zoomAmp: 0.04,
    zoomHz: 0.25,
    pulseAmp: 0.2,
    offsetAmp: 0,
    hueAmp: 0.08,
    foldOsc: 0,
    videoBeat: "color temperature tides warmer then cooler across the same mandala",
  },
  {
    id: "gem-pulse",
    label: "Gem Pulse",
    blurb: "The core heartbeat. Outer ring holds.",
    rotSpeed: 0.05,
    zoomAmp: 0.02,
    zoomHz: 0.9,
    pulseAmp: 1,
    offsetAmp: 0,
    hueAmp: 0,
    foldOsc: 0,
    videoBeat: "the gem nucleus pulses like a heartbeat while the outer petals hold",
  },
  {
    id: "drift-morph",
    label: "Drift Morph",
    blurb: "Crossfade to the next plate on a continuing spin.",
    rotSpeed: 0.14,
    zoomAmp: 0.05,
    zoomHz: 0.3,
    pulseAmp: 0.3,
    offsetAmp: 0,
    hueAmp: 0,
    foldOsc: 0,
    videoBeat: "the mandala morphs into the next plate while rotation continues without a cut",
  },
  {
    id: "mirror-storm",
    label: "Mirror Storm",
    blurb: "Aggressive re-fold. Use sparingly.",
    rotSpeed: 0.28,
    zoomAmp: 0.08,
    zoomHz: 0.7,
    pulseAmp: 0.5,
    offsetAmp: 0.25,
    hueAmp: 0.03,
    foldOsc: 3.5,
    videoBeat: "mirror wedges flash and re-fold in a controlled storm around the still center",
  },
];

export const MOTION_BY_ID: Record<MotionId, MotionRecipe> = Object.fromEntries(
  MOTIONS.map((m) => [m.id, m]),
) as Record<MotionId, MotionRecipe>;

export type Handoff = {
  angleDeg: number;
  zoom: number;
  hue: number;
  folds: number;
};

export type ShotContext = {
  index: number;
  durationSec: number;
  plate: PlateTokens;
  nextPlate: PlateTokens | null;
  morphSrc: string | null;
  keyframes: { step: number; src: string; dAngle: number; note: string }[];
  motion: MotionRecipe;
  start: Handoff;
  end: Handoff;
  videoPrompt: string;
  editPrompt: string;
  continueFrom: string;
};

export type JsonContext = {
  studio: "Prism Loom";
  version: 1;
  sequenceId: string;
  handoffLaw: {
    rotationContinues: true;
    neverResetAngle: true;
    camera: "locked-center";
    shotSec: number;
    morphWindowSec: number;
    dAnglePerShot: number;
  };
  tokens: PlateTokens[];
  shots: ShotContext[];
};

const D_ANGLE = 12;
const SHOT_SEC = 6;
const MORPH_SEC = 2;

export function compileJsonContext(
  sequence: PlateId[],
  motionId: MotionId,
  sequenceId = "chromatic-journey",
): JsonContext {
  const motion = MOTION_BY_ID[motionId];
  let angle = 0;
  const shots: ShotContext[] = sequence.map((id, i) => {
    const plate = PLATE_BY_ID[id];
    const nextId = sequence[(i + 1) % sequence.length];
    const nextPlate = sequence.length > 1 ? PLATE_BY_ID[nextId] : null;
    const morph =
      nextPlate && i < sequence.length - 1
        ? (MORPHS.find((m) => m.from === id && m.to === nextPlate.id)?.src ?? null)
        : null;
    const start: Handoff = {
      angleDeg: round(angle),
      zoom: round(1 + 0.04 * Math.sin(i * 0.9)),
      hue: 0,
      folds: plate.symmetry,
    };
    angle += D_ANGLE;
    const end: Handoff = {
      angleDeg: round(angle),
      zoom: round(1 + 0.04 * Math.sin((i + 1) * 0.9)),
      hue: 0,
      folds: nextPlate ? nextPlate.symmetry : plate.symmetry,
    };
    const keyframes = KEYFRAME_EDITS.filter((k) => k.plateId === id).map((k) => ({
      step: k.step,
      src: k.src,
      dAngle: k.dAngle,
      note: k.note,
    }));
    const continueFrom =
      i === 0
        ? "Opens on a locked-center frame. No prior shot."
        : `Continues shot ${i} without a cut. Inherit rotation ${start.angleDeg}° and zoom ${start.zoom}. Same camera, same crop.`;

    const videoPrompt = buildVideoPrompt(plate, nextPlate, motion, start, end, i === sequence.length - 1);
    const editPrompt = plate.editStill;

    return {
      index: i + 1,
      durationSec: SHOT_SEC,
      plate,
      nextPlate,
      morphSrc: morph,
      keyframes,
      motion,
      start,
      end,
      videoPrompt,
      editPrompt,
      continueFrom,
    };
  });

  return {
    studio: "Prism Loom",
    version: 1,
    sequenceId,
    handoffLaw: {
      rotationContinues: true,
      neverResetAngle: true,
      camera: "locked-center",
      shotSec: SHOT_SEC,
      morphWindowSec: MORPH_SEC,
      dAnglePerShot: D_ANGLE,
    },
    tokens: sequence.map((id) => PLATE_BY_ID[id]),
    shots,
  };
}

function buildVideoPrompt(
  plate: PlateTokens,
  next: PlateTokens | null,
  motion: MotionRecipe,
  start: Handoff,
  end: Handoff,
  last: boolean,
): string {
  const morphBit =
    next && !last
      ? ` In the final two seconds, morph seamlessly into "${next.title}" (${next.energy}) while rotation continues.`
      : "";
  return (
    `${plate.videoStill} Camera locked on the exact center, square crop, no cuts. ` +
    `The mandala ${motion.videoBeat}. ` +
    `Rotation continues from ${start.angleDeg}° to ${end.angleDeg} clockwise. ` +
    `Zoom ${start.zoom} to ${end.zoom}. ${plate.symmetry}-fold ${plate.folds}. ` +
    `Palette ${plate.palette.primary.join(", ")} on ${plate.palette.ground}.` +
    morphBit
  );
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

export function promptList(ctx: JsonContext): string {
  return ctx.shots
    .map((s) => {
      return [
        `SHOT ${s.index}  ${s.plate.title}  ·  ${s.durationSec}s  ·  ${s.motion.label}`,
        `Handoff  ${s.start.angleDeg}° → ${s.end.angleDeg}°   zoom ${s.start.zoom} → ${s.end.zoom}`,
        s.continueFrom,
        s.videoPrompt,
        "",
      ].join("\n");
    })
    .join("\n");
}

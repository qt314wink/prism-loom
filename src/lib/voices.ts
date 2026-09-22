import type { IsolateId } from "@/lib/mechanisms";
import { PLATE_BY_ID, REELS, type PlateId, type ReelId } from "@/lib/plates";

export type Voice = {
  plateId: PlateId;
  foldSet: number[];
  legalBeats: string[];
  legalEdges: PlateId[];
  signature: IsolateId;
  optical: string;
  physical: string;
  unique: string;
};

export const VOICES: Record<PlateId, Voice> = {
  "orchid-veil": {
    plateId: "orchid-veil",
    foldSet: [8],
    legalBeats: ["Bloom", "Veil"],
    legalEdges: ["jewel-garden"],
    signature: "breath",
    optical: "Cyan–magenta lace, pistil as a small ruby well. Thin-film only on the veil, not the field.",
    physical: "Radial bloom as damped breath. Petals open, then return. No flare.",
    unique: "Concentric lace. Identity is the pistil, not the rim.",
  },
  "jewel-garden": {
    plateId: "jewel-garden",
    foldSet: [8],
    legalBeats: ["Spin", "Bloom"],
    legalEdges: ["orchid-veil", "night-crystal"],
    signature: "spin",
    optical: "Turquoise lotus, gold stigma. Purple ruff is the rim law.",
    physical: "Hard angular lock on spin; bloom is petal expansion around a fixed gold eye.",
    unique: "The gold eye must not wander. Spin is around that point.",
  },
  "night-lily": {
    plateId: "night-lily",
    foldSet: [10],
    legalBeats: ["Drift"],
    legalEdges: ["night-crystal"],
    signature: "vignette",
    optical: "Indigo pond, pale anthers. Almost no chroma shift.",
    physical: "Slow drift, deep vignette. A still Voice.",
    unique: "Velvet negative space. Do not add flare.",
  },
  "night-crystal": {
    plateId: "night-crystal",
    foldSet: [8],
    legalBeats: ["Flare"],
    legalEdges: ["jewel-garden", "spectrum-core"],
    signature: "flare",
    optical: "Iridescent iris, granulated gold ring, peach core that may flare then settle.",
    physical: "Center gaussian pulse. σ small. Never a white blowout.",
    unique: "Owns Flare. Other Voices may borrow a little; this one is the source.",
  },
  "sacred-lotus": {
    plateId: "sacred-lotus",
    foldSet: [12],
    legalBeats: ["Bloom"],
    legalEdges: ["solar-lotus"],
    signature: "fold",
    optical: "Peach and temple gold. Quiet pollen crown.",
    physical: "Twelve-fold temple ring. Slow breath only.",
    unique: "Museum calm. No storm, no difference blend.",
  },
  "solar-lotus": {
    plateId: "solar-lotus",
    foldSet: [12],
    legalBeats: ["Bloom"],
    legalEdges: ["frost-sun", "sacred-lotus", "sun-daisy"],
    signature: "breath",
    optical: "Molten gold unfolding from a white-hot core. Copper ring.",
    physical: "Unfold, do not explode. Core stays ivory, not white clip.",
    unique: "Solar inhale. Partner of frost as afterglow.",
  },
  "sun-daisy": {
    plateId: "sun-daisy",
    foldSet: [16],
    legalBeats: ["Spin"],
    legalEdges: ["solar-lotus"],
    signature: "fold",
    optical: "Rayed daisy, pollen disc, lemon tips.",
    physical: "High fold, tiny spin. Lattice-adjacent.",
    unique: "Rays, not petals. Do not chroma-shift into magenta.",
  },
  "spectrum-core": {
    plateId: "spectrum-core",
    foldSet: [8],
    legalBeats: ["Pulse"],
    legalEdges: ["night-crystal", "frost-sun", "violet-corona"],
    signature: "chroma",
    optical: "ROYGBIV rings around a white well. Crystal wedges.",
    physical: "Pulse is chroma + breath together. Well stays small.",
    unique: "Spectral rings. The only Voice allowed a wide hue walk, still bounded.",
  },
  "sapphire-bloom": {
    plateId: "sapphire-bloom",
    foldSet: [8],
    legalBeats: ["Bloom"],
    legalEdges: ["stained-ice", "frost-sun"],
    signature: "fold",
    optical: "Cobalt vault, silver vein, ice.",
    physical: "Cold bloom. No gold.",
    unique: "Ice family. Fuse only with stained-ice or frost-sun.",
  },
  "stained-ice": {
    plateId: "stained-ice",
    foldSet: [6],
    legalBeats: ["Drift"],
    legalEdges: ["sapphire-bloom", "frost-sun"],
    signature: "fold",
    optical: "Rose pane, teal lead, frost.",
    physical: "Six-fold glass. Lead lines must survive the fold.",
    unique: "Stained geometry. Difference blend is legal here as a structure test.",
  },
  "frost-sun": {
    plateId: "frost-sun",
    foldSet: [6, 12],
    legalBeats: ["Ember", "Storm"],
    legalEdges: ["solar-lotus", "spectrum-core", "sapphire-bloom", "stained-ice"],
    signature: "fold",
    optical: "Dendritic fern, twelve-point sun, magenta dew. Cobalt field.",
    physical: "Ember is slow ω, long τ. Storm is high ω, short τ, forced rest at T.",
    unique: "Ferns shear if fold is not 6 or 12. Never 8.",
  },
  "violet-corona": {
    plateId: "violet-corona",
    foldSet: [8],
    legalBeats: ["Pulse"],
    legalEdges: ["spectrum-core", "argus-wheel"],
    signature: "chroma",
    optical: "Electric magenta lotus, lime halo, cyan ring.",
    physical: "Pulse with a lime corona. Halo lives at r ≈ 0.7.",
    unique: "Lime is the signature, not the magenta. Do not lose the halo in mix.",
  },
  "argus-wheel": {
    plateId: "argus-wheel",
    foldSet: [10],
    legalBeats: ["Gaze"],
    legalEdges: ["violet-corona"],
    signature: "spin",
    optical: "Peacock eyes on a golden wheel. Rainbow starburst at hold.",
    physical: "Gaze is a fermata: low ω, long τ. Eyes must stay eyes.",
    unique: "Argus ocelli. Fold 10 only. Hold, do not storm.",
  },
};

export type ReelSignature = {
  reelId: ReelId;
  beat: string;
  signature: IsolateId;
  omega: number;
  tau: number;
  unique: string;
  codec: string;
};

export const REEL_SIGNATURE: Record<ReelId, ReelSignature> = {
  "orchid-veil-bloom": {
    reelId: "orchid-veil-bloom",
    beat: "Bloom",
    signature: "breath",
    omega: 0.11,
    tau: 3.4,
    unique: "Lace pistil inhale. Cyan field holds still; magenta veil breathes.",
    codec: "H.264 720² yuv420p · 10s · radial bloom, low translational motion",
  },
  "jewel-garden-spin": {
    reelId: "jewel-garden-spin",
    beat: "Spin",
    signature: "spin",
    omega: 0.62,
    tau: 99,
    unique: "Gold eye locked. Whole lotus turns as a rigid body.",
    codec: "H.264 720² · 6s · high angular, low radial — good luma-gate partner",
  },
  "jewel-garden-bloom": {
    reelId: "jewel-garden-bloom",
    beat: "Bloom",
    signature: "breath",
    omega: 0.1,
    tau: 3.8,
    unique: "Petals expand around a still gold stigma.",
    codec: "H.264 720² · 10s · radial only; mix with night-crystal on the rim",
  },
  "night-crystal-flare": {
    reelId: "night-crystal-flare",
    beat: "Flare",
    signature: "flare",
    omega: 0.22,
    tau: 2.1,
    unique: "Peach-gold well detonates, then settles to magenta-gold.",
    codec: "H.264 720² · 10s · center luma spike — isolate Flare before fusing",
  },
  "solar-lotus-bloom": {
    reelId: "solar-lotus-bloom",
    beat: "Bloom",
    signature: "breath",
    omega: 0.09,
    tau: 3.0,
    unique: "Molten unfold from ivory core. Copper ring is the hinge.",
    codec: "H.264 720² · 6s · warm radial; legal afterglow into frost-sun",
  },
  "frost-sun-ember": {
    reelId: "frost-sun-ember",
    beat: "Ember",
    signature: "fold",
    omega: 0.08,
    tau: 4.0,
    unique: "Fire arms walk the 12 ferns, then recede. Magenta dew stays.",
    codec: "H.264 720² · 10s · dendritic; fold must stay 12",
  },
  "frost-sun-storm": {
    reelId: "frost-sun-storm",
    beat: "Storm",
    signature: "fold",
    omega: 0.38,
    tau: 1.6,
    unique: "Lightning cracks along fern ridges. Forced rest at T so the loop closes.",
    codec: "H.264 720² · 10s · high-frequency ridges; clamp zoom or it meshes",
  },
  "spectrum-core-pulse": {
    reelId: "spectrum-core-pulse",
    beat: "Pulse",
    signature: "chroma",
    omega: 0.52,
    tau: 2.4,
    unique: "Spectral rings heartbeat. White well does not grow.",
    codec: "H.264 720² · 6s · hue-walk legal only inside this Voice",
  },
  "violet-corona-pulse": {
    reelId: "violet-corona-pulse",
    beat: "Pulse",
    signature: "chroma",
    omega: 0.48,
    tau: 2.2,
    unique: "Magenta lotus, lime halo at the outer ring.",
    codec: "H.264 720² · 6s · preserve lime at r≈0.7 in radial mix",
  },
  "argus-wheel-gaze": {
    reelId: "argus-wheel-gaze",
    beat: "Gaze",
    signature: "spin",
    omega: 0.06,
    tau: 8,
    unique: "Peacock eyes bloom, then hold. Fermata, not a storm.",
    codec: "H.264 720² · 6s · ocelli must remain disks under fold 10",
  },
};

export function voiceOf(plateId: PlateId): Voice {
  return VOICES[plateId];
}

export function legalPartnerReels(plateId: PlateId): ReelId[] {
  const v = VOICES[plateId];
  if (!v) return [];
  const plates = new Set(v.legalEdges);
  return REELS.filter((r) => plates.has(r.plateId)).map((r) => r.id);
}

export function isLegalEdge(a: PlateId, b: PlateId): boolean {
  if (a === b) return true;
  return VOICES[a]?.legalEdges.includes(b) ?? false;
}

export function nearestFold(plateId: PlateId, folds: number): number {
  const set = VOICES[plateId]?.foldSet ?? [PLATE_BY_ID[plateId]?.folds ?? 8];
  let best = set[0] ?? 8;
  let d = Math.abs(folds - best);
  for (const f of set) {
    const n = Math.abs(folds - f);
    if (n < d) {
      best = f;
      d = n;
    }
  }
  return best;
}

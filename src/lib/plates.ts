export type PlateId =
  | "orchid-veil"
  | "jewel-garden"
  | "night-lily"
  | "night-crystal"
  | "sacred-lotus"
  | "solar-lotus"
  | "sun-daisy"
  | "spectrum-core"
  | "sapphire-bloom"
  | "stained-ice"
  | "frost-sun"
  | "violet-corona"
  | "argus-wheel";

export type ReelId =
  | "orchid-veil-bloom"
  | "jewel-garden-spin"
  | "jewel-garden-bloom"
  | "night-crystal-flare"
  | "solar-lotus-bloom"
  | "frost-sun-ember"
  | "frost-sun-storm"
  | "spectrum-core-pulse"
  | "violet-corona-pulse"
  | "argus-wheel-gaze";

export type Plate = {
  id: PlateId;
  title: string;
  epithet: string;
  src: string;
  folds: number;
  motif: string;
  palette: string[];
};

export type Reel = {
  id: ReelId;
  plateId: PlateId;
  title: string;
  beat: string;
  src: string;
  poster: string;
  duration: number;
};

export const PLATES: Plate[] = [
  {
    id: "orchid-veil",
    title: "Orchid Veil",
    epithet: "Lace bloom over a cyan field",
    src: "/plates/orchid-veil.png",
    folds: 8,
    motif: "concentric orchid, lace veil, radial pistil",
    palette: ["cyan", "hot-pink", "magenta", "leaf", "ruby-core"],
  },
  {
    id: "jewel-garden",
    title: "Jewel Garden",
    epithet: "Turquoise lotus, gold eye",
    src: "/plates/jewel-garden.jpg",
    folds: 8,
    motif: "jeweled lotus, amber stigma, purple ruff",
    palette: ["turquoise", "gold", "violet", "peach", "leaf"],
  },
  {
    id: "night-lily",
    title: "Night Lily",
    epithet: "Dark water lily, indigo pond",
    src: "/plates/night-lily.png",
    folds: 10,
    motif: "nocturnal lily, velvet pond, pale anthers",
    palette: ["indigo", "violet", "pearl", "ink"],
  },
  {
    id: "night-crystal",
    title: "Night Crystal",
    epithet: "Iridescent iris in a dark nave",
    src: "/plates/night-crystal.png",
    folds: 8,
    motif: "crystal iris, granulated gold ring, peach core",
    palette: ["navy", "teal", "peach", "gold", "magenta"],
  },
  {
    id: "sacred-lotus",
    title: "Sacred Lotus",
    epithet: "Peach mandala, temple gold",
    src: "/plates/sacred-lotus.png",
    folds: 12,
    motif: "sacred lotus, temple ring, pollen crown",
    palette: ["peach", "gold", "cream", "rose"],
  },
  {
    id: "solar-lotus",
    title: "Solar Lotus",
    epithet: "Molten gold unfolding from a white sun",
    src: "/plates/solar-lotus.png",
    folds: 12,
    motif: "solar lotus, white-hot core, copper ring",
    palette: ["gold", "amber", "copper", "ivory"],
  },
  {
    id: "sun-daisy",
    title: "Sun Daisy",
    epithet: "Rayed daisy, pollen heart",
    src: "/plates/sun-daisy.png",
    folds: 16,
    motif: "rayed daisy, pollen disc, lemon tips",
    palette: ["lemon", "amber", "cream", "chartreuse"],
  },
  {
    id: "spectrum-core",
    title: "Spectrum Core",
    epithet: "Chromatic rings around a white well",
    src: "/plates/spectrum-core.png",
    folds: 8,
    motif: "spectral well, ROYGBIV rings, crystal wedges",
    palette: ["violet", "blue", "green", "gold", "crimson"],
  },
  {
    id: "sapphire-bloom",
    title: "Sapphire Bloom",
    epithet: "Deep ice flower, cobalt vault",
    src: "/plates/sapphire-bloom.png",
    folds: 8,
    motif: "sapphire bloom, ice vault, silver vein",
    palette: ["cobalt", "ice", "silver", "navy"],
  },
  {
    id: "stained-ice",
    title: "Stained Ice",
    epithet: "Frosted glass, rose and teal",
    src: "/plates/stained-ice.jpg",
    folds: 6,
    motif: "stained ice, rose pane, teal lead",
    palette: ["rose", "teal", "frost", "lead"],
  },
  {
    id: "frost-sun",
    title: "Frost Sun",
    epithet: "Hoarfrost ferns around a yellow sun",
    src: "/plates/frost-sun.jpg",
    folds: 12,
    motif: "dendritic fern, twelve-point sun, magenta dew",
    palette: ["cobalt", "hoarfrost", "sun-gold", "magenta-dew"],
  },
  {
    id: "violet-corona",
    title: "Violet Corona",
    epithet: "Electric magenta lotus, lime halo",
    src: "/plates/violet-corona.jpg",
    folds: 8,
    motif: "electric lotus, lime corona, cyan ring",
    palette: ["magenta", "violet", "cyan", "lime"],
  },
  {
    id: "argus-wheel",
    title: "Argus Wheel",
    epithet: "Peacock eyes on a golden wheel",
    src: "/plates/argus-wheel.jpg",
    folds: 10,
    motif: "argus eyes, gold petal, rainbow starburst",
    palette: ["peacock", "gold", "magenta", "orange"],
  },
];

export const REELS: Reel[] = [
  {
    id: "orchid-veil-bloom",
    plateId: "orchid-veil",
    title: "Orchid Veil Bloom",
    beat: "Bloom",
    src: "/videos/orchid-veil-bloom.mp4",
    poster: "/posters/orchid-veil-bloom.jpg",
    duration: 10,
  },
  {
    id: "jewel-garden-spin",
    plateId: "jewel-garden",
    title: "Jewel Garden Spin",
    beat: "Spin",
    src: "/videos/jewel-garden-spin.mp4",
    poster: "/posters/jewel-garden-spin.jpg",
    duration: 6,
  },
  {
    id: "jewel-garden-bloom",
    plateId: "jewel-garden",
    title: "Jewel Garden Bloom",
    beat: "Bloom",
    src: "/videos/jewel-garden-bloom.mp4",
    poster: "/posters/jewel-garden-bloom.jpg",
    duration: 10,
  },
  {
    id: "night-crystal-flare",
    plateId: "night-crystal",
    title: "Night Crystal Flare",
    beat: "Flare",
    src: "/videos/night-crystal-flare.mp4",
    poster: "/posters/night-crystal-flare.jpg",
    duration: 10,
  },
  {
    id: "solar-lotus-bloom",
    plateId: "solar-lotus",
    title: "Solar Lotus Bloom",
    beat: "Bloom",
    src: "/videos/solar-lotus-bloom.mp4",
    poster: "/posters/solar-lotus-bloom.jpg",
    duration: 6,
  },
  {
    id: "frost-sun-ember",
    plateId: "frost-sun",
    title: "Frost Sun Ember",
    beat: "Ember",
    src: "/videos/frost-sun-ember.mp4",
    poster: "/posters/frost-sun-ember.jpg",
    duration: 10,
  },
  {
    id: "frost-sun-storm",
    plateId: "frost-sun",
    title: "Frost Sun Storm",
    beat: "Storm",
    src: "/videos/frost-sun-storm.mp4",
    poster: "/posters/frost-sun-storm.jpg",
    duration: 10,
  },
  {
    id: "spectrum-core-pulse",
    plateId: "spectrum-core",
    title: "Spectrum Core Pulse",
    beat: "Pulse",
    src: "/videos/spectrum-core-pulse.mp4",
    poster: "/posters/spectrum-core-pulse.jpg",
    duration: 6,
  },
  {
    id: "violet-corona-pulse",
    plateId: "violet-corona",
    title: "Violet Corona Pulse",
    beat: "Pulse",
    src: "/videos/violet-corona-pulse.mp4",
    poster: "/posters/violet-corona-pulse.jpg",
    duration: 6,
  },
  {
    id: "argus-wheel-gaze",
    plateId: "argus-wheel",
    title: "Argus Wheel Gaze",
    beat: "Gaze",
    src: "/videos/argus-wheel-gaze.mp4",
    poster: "/posters/argus-wheel-gaze.jpg",
    duration: 6,
  },
];

export const PLATE_BY_ID: Record<PlateId, Plate> = Object.fromEntries(
  PLATES.map((p) => [p.id, p]),
) as Record<PlateId, Plate>;

export const REEL_BY_ID: Record<ReelId, Reel> = Object.fromEntries(
  REELS.map((r) => [r.id, r]),
) as Record<ReelId, Reel>;

export const DEFAULT_SEQUENCE: PlateId[] = PLATES.map((p) => p.id);

export function firstReelForPlate(plateId: PlateId): Reel | undefined {
  return REELS.find((r) => r.plateId === plateId);
}

export function reelsForPlate(plateId: PlateId): Reel[] {
  return REELS.filter((r) => r.plateId === plateId);
}

export function reelOrdinal(id: ReelId): number {
  const i = REELS.findIndex((r) => r.id === id);
  return i < 0 ? 0 : i + 1;
}

export function nextReel(id: ReelId): Reel {
  const i = REELS.findIndex((r) => r.id === id);
  return REELS[(i + 1) % REELS.length] ?? REELS[0];
}

export function prevReel(id: ReelId): Reel {
  const i = REELS.findIndex((r) => r.id === id);
  return REELS[(i - 1 + REELS.length) % REELS.length] ?? REELS[0];
}

export function formatTimecode(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "00:00.00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const whole = Math.floor(s);
  const frac = Math.floor((s - whole) * 100);
  return `${String(m).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${String(frac).padStart(2, "0")}`;
}

export function loopLabel(mode: "one" | "all" | "off"): string {
  if (mode === "all") return "Loop all";
  if (mode === "one") return "Loop one";
  return "Loop off";
}

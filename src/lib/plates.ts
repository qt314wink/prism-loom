export type PlateId =
  | "night-lily"
  | "orchid-veil"
  | "jewel-garden"
  | "stained-ice"
  | "sapphire-bloom"
  | "night-crystal"
  | "sacred-lotus"
  | "solar-lotus"
  | "sun-daisy"
  | "spectrum-core";

export type PlateTokens = {
  id: PlateId;
  index: number;
  title: string;
  sourceFile: string;
  src: string;
  symmetry: 4 | 6 | 8;
  folds: string;
  energy: string;
  temperature: "nocturnal" | "cool" | "temperate" | "warm" | "electric";
  center: {
    motif: string;
    energy: string;
  };
  motifs: string[];
  texture: string;
  palette: {
    ground: string;
    primary: string[];
    accent: string[];
  };
  motionNative: string;
  videoStill: string;
  editStill: string;
};

export const PLATES: PlateTokens[] = [
  {
    id: "night-lily",
    index: 0,
    title: "Night Lily",
    sourceFile: "12089.png",
    src: "/plates/night-lily.png",
    symmetry: 6,
    folds: "hexagonal snowflake",
    energy: "theatrical, nocturnal, glassy",
    temperature: "nocturnal",
    center: {
      motif: "red hexagon with cyan lobes and a teal radial gem",
      energy: "hot-cold dual core",
    },
    motifs: ["pink lilies", "star points", "yellow-green bokeh orbs"],
    texture: "glassy petals on a black void",
    palette: {
      ground: "#0a0814",
      primary: ["#f4b8d0", "#e85a7a", "#3ee0d0"],
      accent: ["#d4e060", "#ffffff"],
    },
    motionNative: "slow clockwise spin, lily points ticking like a star",
    videoStill: "Pink lily kaleidoscope on black slowly rotating around a red-cyan gem core.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise around the precise center. Center gem pulses a little brighter. Same crop, no new elements.",
  },
  {
    id: "orchid-veil",
    index: 1,
    title: "Orchid Veil",
    sourceFile: "12075.png",
    src: "/plates/orchid-veil.png",
    symmetry: 8,
    folds: "octagonal orchid wheel",
    energy: "romantic, aquatic, veiled",
    temperature: "cool",
    center: {
      motif: "turquoise jeweled disc with a pearl nucleus",
      energy: "cool water-light",
    },
    motifs: ["magenta orchids", "blue-white wings", "beaded turquoise ring"],
    texture: "soft satin petals, jeweled mosaic core",
    palette: {
      ground: "#2a1850",
      primary: ["#e8a0d0", "#6b2a88", "#4ec8e0"],
      accent: ["#f4f0ff", "#80d0f0"],
    },
    motionNative: "petals breathe open, core pearls rotate as a slow clock",
    videoStill: "Magenta orchid kaleidoscope breathing while a turquoise jewel core turns.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Orchid wings unfurl slightly. Turquoise core brightens. Same crop, no new elements.",
  },
  {
    id: "jewel-garden",
    index: 2,
    title: "Jewel Garden",
    sourceFile: "12094.jpg",
    src: "/plates/jewel-garden.jpg",
    symmetry: 8,
    folds: "organic octad",
    energy: "tropical jewel, lush",
    temperature: "temperate",
    center: {
      motif: "lavender rose with a pale violet nucleus",
      energy: "soft bloom",
    },
    motifs: ["teal petals", "magenta flashes", "lime ribs", "yellow flares"],
    texture: "wet botanical, crystalline pollen",
    palette: {
      ground: "#1a3040",
      primary: ["#3ec8d0", "#c060c8", "#70c050"],
      accent: ["#f0c050", "#d8a0c8"],
    },
    motionNative: "teal petals breathe, lavender heart blooms",
    videoStill:
      "Teal and magenta jewel-garden mandala rotating while the lavender rose core blooms.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Lavender center glow increases. Teal petals breathe more open. Same crop, no new elements.",
  },
  {
    id: "stained-ice",
    index: 3,
    title: "Stained Ice",
    sourceFile: "12101.jpg",
    src: "/plates/stained-ice.jpg",
    symmetry: 4,
    folds: "cardinal cross, eight-point star",
    energy: "frozen cathedral",
    temperature: "cool",
    center: {
      motif: "violet glass flower",
      energy: "cold fire",
    },
    motifs: ["ice-blue stained glass", "four gold dots at cardinals", "lilac blades"],
    texture: "leaded glass, liquid light",
    palette: {
      ground: "#203040",
      primary: ["#7ec8e8", "#a090e0", "#f0d040"],
      accent: ["#6a40a0", "#e8b0d0"],
    },
    motionNative: "gold dots pulse in sequence, glass panes shift like ice",
    videoStill:
      "Ice-blue stained-glass mandala rotating; four gold dots pulse at the cardinals.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Gold cardinal dots glow a little warmer. Violet center sharpens. Same crop, no new elements.",
  },
  {
    id: "sapphire-bloom",
    index: 4,
    title: "Sapphire Bloom",
    sourceFile: "12095.png",
    src: "/plates/sapphire-bloom.png",
    symmetry: 8,
    folds: "crystal octad",
    energy: "mineral, cool, lucid",
    temperature: "cool",
    center: {
      motif: "peach-tan flower with a cyan gem nucleus",
      energy: "warm heart in cold stone",
    },
    motifs: ["sapphire petals", "peach inner bloom", "gold-green flecks"],
    texture: "cut crystal, frosted mineral",
    palette: {
      ground: "#1a2050",
      primary: ["#4a80e0", "#d0a080", "#40e0f0"],
      accent: ["#f0f8ff", "#70c070"],
    },
    motionNative: "crystal facets turn, cyan gem pulses",
    videoStill:
      "Sapphire crystal kaleidoscope rotating around a peach flower with a cyan gem.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Cyan gem brightens. Peach inner petals unfurl. Same crop, no new elements.",
  },
  {
    id: "night-crystal",
    index: 5,
    title: "Night Crystal",
    sourceFile: "12086.png",
    src: "/plates/night-crystal.png",
    symmetry: 8,
    folds: "mineral octad",
    energy: "nocturnal mineral, regal",
    temperature: "nocturnal",
    center: {
      motif: "cream eight-petal flower with a pale blue eye",
      energy: "moonlit",
    },
    motifs: ["navy iris blades", "gold crystal ring", "teal flashes"],
    texture: "faceted gold grit around liquid glass",
    palette: {
      ground: "#050820",
      primary: ["#0a1460", "#d4a060", "#80e0f0"],
      accent: ["#f0e8d8", "#c060a0"],
    },
    motionNative: "gold ring turns like a setting, cream flower holds still then breathes",
    videoStill:
      "Navy and gold night-crystal mandala rotating; cream flower core breathes.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Gold ring brightens. Cream center glows. Same crop, no new elements.",
  },
  {
    id: "sacred-lotus",
    index: 6,
    title: "Sacred Lotus",
    sourceFile: "12084.png",
    src: "/plates/sacred-lotus.png",
    symmetry: 8,
    folds: "lotus mandala",
    energy: "sacred, botanical, still",
    temperature: "temperate",
    center: {
      motif: "gold seed pod ringed with blue gems",
      energy: "solar seed",
    },
    motifs: ["pink lotus", "deep green ruff", "outer jewel petals"],
    texture: "velvet stamen, wet petal, enamel gems",
    palette: {
      ground: "#2a1840",
      primary: ["#e8b0c8", "#1a6040", "#f0c040"],
      accent: ["#4060c0", "#80d0e8"],
    },
    motionNative: "green ruff pulses, gold seeds tick around the sun",
    videoStill:
      "Sacred lotus kaleidoscope rotating; gold seed core ticks and the green ruff pulses.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Gold seed core flares. Green ruff breathes. Same crop, no new elements.",
  },
  {
    id: "solar-lotus",
    index: 7,
    title: "Solar Lotus",
    sourceFile: "12092.png",
    src: "/plates/solar-lotus.png",
    symmetry: 8,
    folds: "solar octad",
    energy: "solar, warm, generous",
    temperature: "warm",
    center: {
      motif: "yellow-gold sun-seed in a violet ring",
      energy: "star fire",
    },
    motifs: ["teal lotus leaves", "gold-orange wings", "deep blue gems"],
    texture: "warm mineral dust, enamel blue, living gold",
    palette: {
      ground: "#102060",
      primary: ["#e8b060", "#40c0c8", "#2040c0"],
      accent: ["#f0d040", "#f0c8a0"],
    },
    motionNative: "sun-seed flares, gold wings rotate, teal leaves unfurl",
    videoStill:
      "Golden solar-lotus kaleidoscope rotating; the seed-sun pulses and teal leaves unfurl.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Gold petals warm. Center sun-seed flares. Teal leaves unfurl. Same crop, no new elements.",
  },
  {
    id: "sun-daisy",
    index: 8,
    title: "Sun Daisy",
    sourceFile: "12091.png",
    src: "/plates/sun-daisy.png",
    symmetry: 6,
    folds: "hex daisy wheel",
    energy: "electric, joyful, graphic",
    temperature: "electric",
    center: {
      motif: "green-gold hexagonal inner star",
      energy: "spark",
    },
    motifs: ["electric yellow daisies", "royal blue field", "green eyes"],
    texture: "high-chroma enamel, night-club jewel",
    palette: {
      ground: "#0a0a20",
      primary: ["#f0d020", "#1a2080", "#40a040"],
      accent: ["#f0f0f0", "#c04080"],
    },
    motionNative: "daisies tick around a hex star, yellow flares strobe softly",
    videoStill:
      "Electric yellow daisies on royal blue rotating around a hexagonal green-gold star.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Yellow petals flare. Hex star brightens. Same crop, no new elements.",
  },
  {
    id: "spectrum-core",
    index: 9,
    title: "Spectrum Core",
    sourceFile: "12065.png",
    src: "/plates/spectrum-core.png",
    symmetry: 8,
    folds: "spectral octad",
    energy: "full-spectrum climax",
    temperature: "electric",
    center: {
      motif: "radiating sunburst: orange, yellow, lime",
      energy: "heart of the spectrum",
    },
    motifs: ["purple blades", "cyan-green outer ring", "coral clusters"],
    texture: "neon enamel, radial hatch, wet gem",
    palette: {
      ground: "#101020",
      primary: ["#f06020", "#f0d020", "#40c040"],
      accent: ["#4060e0", "#c040e0", "#20e0d0"],
    },
    motionNative: "sunburst heartbeat, outer petals pulse, hue tide",
    videoStill:
      "Neon rainbow kaleidoscope rotating; the sunburst core expands and contracts like a heartbeat.",
    editStill:
      "Keep this exact kaleidoscope. Rotate eight degrees clockwise. Sunburst core expands. Outer cyan and magenta petals pulse outward. Same crop, no new elements.",
  },
];

export const PLATE_BY_ID: Record<PlateId, PlateTokens> = Object.fromEntries(
  PLATES.map((p) => [p.id, p]),
) as Record<PlateId, PlateTokens>;

export const DEFAULT_SEQUENCE: PlateId[] = PLATES.map((p) => p.id);

export type MorphLink = {
  from: PlateId;
  to: PlateId;
  src: string;
};

export const MORPHS: MorphLink[] = [
  { from: "night-lily", to: "orchid-veil", src: "/morphs/night-lily--orchid-veil.jpg" },
  { from: "orchid-veil", to: "jewel-garden", src: "/morphs/orchid-veil--jewel-garden.jpg" },
  { from: "jewel-garden", to: "stained-ice", src: "/morphs/jewel-garden--stained-ice.jpg" },
  { from: "stained-ice", to: "sapphire-bloom", src: "/morphs/stained-ice--sapphire-bloom.jpg" },
  { from: "sapphire-bloom", to: "night-crystal", src: "/morphs/sapphire-bloom--night-crystal.jpg" },
  { from: "night-crystal", to: "sacred-lotus", src: "/morphs/night-crystal--sacred-lotus.jpg" },
  { from: "sacred-lotus", to: "solar-lotus", src: "/morphs/sacred-lotus--solar-lotus.jpg" },
  { from: "solar-lotus", to: "sun-daisy", src: "/morphs/solar-lotus--sun-daisy.jpg" },
  { from: "sun-daisy", to: "spectrum-core", src: "/morphs/sun-daisy--spectrum-core.jpg" },
];

export function morphBetween(from: PlateId, to: PlateId): MorphLink | undefined {
  return MORPHS.find((m) => m.from === from && m.to === to);
}

export type KeyframeEdit = {
  plateId: PlateId;
  step: 1 | 2;
  src: string;
  dAngle: number;
  note: string;
};

export const KEYFRAME_EDITS: KeyframeEdit[] = [
  {
    plateId: "jewel-garden",
    step: 1,
    src: "/edits/jewel-garden-e1.jpg",
    dAngle: 8,
    note: "center bloom, teal open",
  },
  {
    plateId: "jewel-garden",
    step: 2,
    src: "/edits/jewel-garden-e2.jpg",
    dAngle: 16,
    note: "further bloom, magenta richer",
  },
  {
    plateId: "solar-lotus",
    step: 1,
    src: "/edits/solar-lotus-e1.jpg",
    dAngle: 8,
    note: "gold warms, sun-seed flares",
  },
  {
    plateId: "solar-lotus",
    step: 2,
    src: "/edits/solar-lotus-e2.jpg",
    dAngle: 16,
    note: "leaves unfurl further",
  },
  {
    plateId: "spectrum-core",
    step: 1,
    src: "/edits/spectrum-core-e1.jpg",
    dAngle: 8,
    note: "sunburst expands",
  },
  {
    plateId: "spectrum-core",
    step: 2,
    src: "/edits/spectrum-core-e2.jpg",
    dAngle: 16,
    note: "outer pulse, rays longer",
  },
];

export type Reel = {
  id: string;
  plateId: PlateId;
  src: string;
  motionId: string;
  title: string;
  prompt: string;
};

export const REELS: Reel[] = [
  {
    id: "jewel-garden-spin",
    plateId: "jewel-garden",
    src: "/videos/jewel-garden-spin.mp4",
    motionId: "spin-breathe",
    title: "Jewel Garden · spin breathe",
    prompt:
      "The kaleidoscope mandala slowly rotates clockwise around its exact center while the lavender core gently blooms brighter and teal petals breathe open. Camera locked on center, seamless loop, no cuts.",
  },
  {
    id: "solar-lotus-bloom",
    plateId: "solar-lotus",
    src: "/videos/solar-lotus-bloom.mp4",
    motionId: "bloom",
    title: "Solar Lotus · bloom",
    prompt:
      "The golden lotus kaleidoscope slowly rotates clockwise around its exact center. The seed-sun in the middle pulses with warm light and teal petals unfurl. Camera locked, seamless loop, no cuts.",
  },
  {
    id: "spectrum-core-pulse",
    plateId: "spectrum-core",
    src: "/videos/spectrum-core-pulse.mp4",
    motionId: "gem-pulse",
    title: "Spectrum Core · pulse",
    prompt:
      "The neon rainbow kaleidoscope slowly rotates clockwise around its exact center. The sunburst core expands and contracts like a heartbeat while outer petals pulse. Camera locked, seamless loop, no cuts.",
  },
];

export function plateById(id: PlateId): PlateTokens {
  return PLATE_BY_ID[id];
}

export type TraceRole = "envelope" | "carrier" | "result" | "companion";

export type ScoreTrace = {
  expr: string;
  role: TraceRole;
  fill?: boolean;
};

export type ScoreView = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type Score = {
  id: string;
  label: string;
  family: string;
  law: string;
  math: string;
  see: string;
  play?: boolean;
  view: ScoreView;
  traces: ScoreTrace[];
};

const PI = Math.PI;

export const SCORES: Score[] = [
  {
    id: "damped",
    label: "Damped",
    family: "decay",
    law: "A dying oscillator. Amplitude is absorbed; frequency holds.",
    math: "A e^{−x/τ} sin(ωx)",
    see: "Champagne is the envelope. Green is the carrier. Blue is the product — the breath.",
    view: { xMin: 0, xMax: 6 * PI, yMin: -1.7, yMax: 1.7 },
    traces: [
      { expr: "exp(-x/8)", role: "envelope" },
      { expr: "sin(3x)", role: "carrier" },
      { expr: "exp(-x/8)*sin(3x)", role: "result", fill: true },
    ],
  },
  {
    id: "tangent",
    label: "Tangent",
    family: "shadow",
    law: "A ratio that goes to infinity when cosine is zero. Poles, not a wave.",
    math: "tan x = sin x / cos x",
    see: "The vertical breaks are asymptotes. tanh is the same gesture, bounded — a refraction analog.",
    view: { xMin: -2 * PI, xMax: 2 * PI, yMin: -6, yMax: 6 },
    traces: [
      { expr: "tan(x)", role: "result" },
      { expr: "tanh(x)", role: "companion" },
    ],
  },
  {
    id: "beats",
    label: "Beats",
    family: "sound",
    law: "Two close frequencies. The slow envelope is the beat you hear.",
    math: "sin ω₁x + sin ω₂x",
    see: "Neither note is the pulse. The pulse is their interference.",
    view: { xMin: 0, xMax: 18 * PI, yMin: -2.4, yMax: 2.4 },
    traces: [
      { expr: "sin(x)", role: "carrier" },
      { expr: "sin(1.15x)", role: "companion" },
      { expr: "sin(x)+sin(1.15x)", role: "result", fill: true },
    ],
  },
  {
    id: "flare",
    label: "Flare",
    family: "light",
    law: "A gaussian well. Brightness as a localized pulse, not a blowout.",
    math: "e^{−x²/σ²}",
    see: "The bell is intensity. The odd companion is its slope — how light falls off.",
    view: { xMin: -5, xMax: 5, yMin: -0.7, yMax: 1.25 },
    traces: [
      { expr: "exp(-x^2 / 4)", role: "result", fill: true },
      { expr: "x*exp(-x^2 / 4)", role: "companion" },
    ],
  },
  {
    id: "diffraction",
    label: "Diffraction",
    family: "optics",
    law: "Aperture as sinc. Intensity is the square — the thing a screen records.",
    math: "sinc x  and  (sinc x)²",
    see: "Amplitude crosses zero and changes sign. Intensity never does. Nodes stay nodes.",
    view: { xMin: -8 * PI, xMax: 8 * PI, yMin: -0.45, yMax: 1.2 },
    traces: [
      { expr: "sinc(x)", role: "carrier" },
      { expr: "sinc(x)^2", role: "result", fill: true },
    ],
  },
  {
    id: "standing",
    label: "Standing",
    family: "wave",
    law: "Two traveling waves, opposite directions. Energy sloshes; nodes hold.",
    math: "sin x · cos t",
    see: "Press play. Blue is the standing mode. Green is the quadrature. They trade amplitude.",
    play: true,
    view: { xMin: -2 * PI, xMax: 2 * PI, yMin: -1.6, yMax: 1.6 },
    traces: [
      { expr: "sin(x)*cos(t)", role: "result", fill: true },
      { expr: "cos(x)*sin(t)", role: "carrier" },
      { expr: "sin(x)", role: "envelope" },
    ],
  },
  {
    id: "pulse",
    label: "Pulse",
    family: "signal",
    law: "A gaussian packet that breathes along x with time. No wrap jump.",
    math: "e^{−(x − 5 sin t)²}",
    see: "Press play. One well slides. The dimmer well is its opposite phase.",
    play: true,
    view: { xMin: -8, xMax: 8, yMin: -0.15, yMax: 1.2 },
    traces: [
      { expr: "exp(-(x - 5*sin(t))^2)", role: "result", fill: true },
      { expr: "0.55*exp(-(x - 5*sin(t - pi))^2)", role: "companion" },
    ],
  },
  {
    id: "absorb",
    label: "Absorb",
    family: "decay",
    law: "Beer–Lambert. Light through a density. Transmission falls; absorption saturates.",
    math: "e^{−αx}   and   1 − e^{−αx}",
    see: "Blue is what remains. Champagne is what was taken. They always sum to 1.",
    view: { xMin: 0, xMax: 8, yMin: -0.15, yMax: 1.2 },
    traces: [
      { expr: "exp(-x)", role: "result", fill: true },
      { expr: "1 - exp(-x)", role: "envelope" },
      { expr: "exp(-x/3)", role: "companion" },
    ],
  },
  {
    id: "bend",
    label: "Bend",
    family: "refraction",
    law: "Three bounded maps of the same approach: a ray entering a denser medium.",
    math: "tanh x,  atan x,  x/√(1+x²)",
    see: "All three leave the line y=x and flatten. Different stiffness, same confession.",
    view: { xMin: -6, xMax: 6, yMin: -2.1, yMax: 2.1 },
    traces: [
      { expr: "tanh(x)", role: "result" },
      { expr: "atan(x)", role: "carrier" },
      { expr: "x / sqrt(1 + x^2)", role: "companion" },
    ],
  },
  {
    id: "harmonic",
    label: "Harmonic",
    family: "structure",
    law: "Partial sums of a Fourier saw. Pattern from repetition, not from a closed form.",
    math: "sin x + sin(2x)/2 + sin(3x)/3",
    see: "Each added overtone steepens the rise. The Gibbs ripple is the price of a sharp edge.",
    view: { xMin: -2 * PI, xMax: 2 * PI, yMin: -2.1, yMax: 2.1 },
    traces: [
      { expr: "sin(x)", role: "envelope" },
      { expr: "sin(x)+sin(2x)/2", role: "carrier" },
      { expr: "sin(x)+sin(2x)/2+sin(3x)/3", role: "result" },
    ],
  },
];

export const SCORE_BY_ID: Record<string, Score> = Object.fromEntries(SCORES.map((s) => [s.id, s]));

export const DEFAULT_SCORE = SCORES[0]!;

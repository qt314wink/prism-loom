import type { Domain } from "@/lib/mechanisms";

export type KnobId =
  | "folds"
  | "spin"
  | "zoom"
  | "breath"
  | "chroma"
  | "vignette"
  | "flare"
  | "mix"
  | "blend"
  | "omega"
  | "tau"
  | "weather";

export type Knob = {
  id: KnobId;
  title: string;
  uniform: string;
  domain: Domain;
  math: string;
  range: string;
  glsl: string;
  hlsl: string;
  r3f: string;
  unity: string;
  wgsl: string;
  codec: string;
  nle: string;
};

export const KNOBS: Knob[] = [
  {
    id: "folds",
    title: "Fold",
    uniform: "uFolds",
    domain: "geometry",
    math: "θ' = |mod(θ, 2π/N) − π/N|",
    range: "Voice.foldSet only",
    glsl: "float sector = PI / max(uFolds, 2.0);",
    hlsl: "float sector = PI / max(_Folds, 2.0);",
    r3f: "uFolds: { value: N }",
    unity: "_Folds on FullScreenPass",
    wgsl: "let sector = PI / max(folds, 2.0);",
    codec: "Polar unwrap; count repeating sectors in one revolution",
    nle: "Resolve Polarizer → count identical wedges. Never keyframe N off the Voice set.",
  },
  {
    id: "spin",
    title: "Spin",
    uniform: "uSpin",
    domain: "observer",
    math: "θ(t) = θ₀ + ω t",
    range: "radians, monotonic",
    glsl: "a = atan(p.y,p.x) + uSpin;",
    hlsl: "a = atan2(p.y,p.x) + _Spin;",
    r3f: "uSpin: { value: 0 }  // += omega * dt",
    unity: "_Spin += omega * Time.deltaTime",
    wgsl: "a = atan2(p.y, p.x) + spin;",
    codec: "ffmpeg mestimate angular flow; rigid body if radial flow ≈ 0",
    nle: "Rotation keyframes on a circular mask. Jewel Spin is the rigid-body reference.",
  },
  {
    id: "zoom",
    title: "Zoom",
    uniform: "uZoom",
    domain: "field",
    math: "r' = r · zoom, zoom ∈ [0.55, 1.85]",
    range: "0.55–1.85",
    glsl: "uv = dir * r * uZoom * 0.5 + 0.5;",
    hlsl: "uv = dir * r * _Zoom * 0.5 + 0.5;",
    r3f: "uZoom: { value: 1 }",
    unity: "_Zoom",
    wgsl: "uv = dir * r * zoom * 0.5 + 0.5;",
    codec: "Radial scale vs first frame. Clamp or the loop meshes.",
    nle: "Transform scale, anchor at stigma. Do not crop the disc.",
  },
  {
    id: "breath",
    title: "Breath",
    uniform: "uBreath",
    domain: "field",
    math: "r(t) = r0 + A e^{−t/τ} sin(ω t)",
    range: "A from Voice, rest at T",
    glsl: "zoom += uBreath * exp(-t/tau) * sin(omega*t);",
    hlsl: "zoom += _Breath * exp(-t/_Tau) * sin(_Omega*t);",
    r3f: "uBreath driven by the same envelope as uZoom",
    unity: "_Breath * DampedSin(t, _Omega, _Tau)",
    wgsl: "zoom += breath * exp(-t/tau) * sin(omega*t);",
    codec: "Radius of the stigma vs time; envelope must return at T",
    nle: "Scale envelope, easy-ease rest on last frame. Bloom reels are the reference.",
  },
  {
    id: "chroma",
    title: "Chroma",
    uniform: "uChroma",
    domain: "receiver",
    math: "c' = R_YIQ(α) c,  α ≤ 0.12 turns",
    range: "0–0.12",
    glsl: "c = hueShift(c, uChroma * TAU);",
    hlsl: "c = HueShift(c, _Chroma * 6.2831853);",
    r3f: "uChroma: { value: 0.04 }",
    unity: "_Chroma — YIQ matrix, not HSV",
    wgsl: "c = hue_shift(c, chroma * TAU);",
    codec: "Vectorscope angle. Spectrum Core is the only wide walk.",
    nle: "Hue Rotate, scoped. If the plate leaves its family, back off.",
  },
  {
    id: "vignette",
    title: "Vignette",
    uniform: "uVignette",
    domain: "observer",
    math: "V = smoothstep(1.02, 0.42, |p|)",
    range: "0–1, default 1",
    glsl: "c *= mix(1.0, smoothstep(1.02,0.42,r), uVignette);",
    hlsl: "c *= lerp(1, smoothstep(1.02,0.42,r), _Vignette);",
    r3f: "uVignette: { value: 1 }",
    unity: "_Vignette circular, not a film grade",
    wgsl: "c *= mix(1.0, smoothstep(1.02, 0.42, r), vignette);",
    codec: "Edge luma vs center. Makes the disc, not a mood.",
    nle: "Circular mask, feathered. Night Lily owns the deep falloff.",
  },
  {
    id: "flare",
    title: "Flare",
    uniform: "uFlare",
    domain: "emitter",
    math: "F = e^{−(r/σ)²} · A(t)",
    range: "0–0.28, Night Crystal owns it",
    glsl: "c += uFlare * exp(-r*r*14.0) * vec3(1.0,0.86,0.62);",
    hlsl: "c += _Flare * exp(-r*r*14.0) * half3(1,0.86,0.62);",
    r3f: "uFlare: { value: 0.08 }",
    unity: "_Flare gaussian well, never a bloom stack",
    wgsl: "c += flare * exp(-r*r*14.0) * vec3f(1.0, 0.86, 0.62);",
    codec: "Center waveform. Reject if luma > 0.96 for > 4 frames",
    nle: "Center glow, tiny radius. Isolate Flare on Night Crystal before mixing.",
  },
  {
    id: "mix",
    title: "Mix A→B",
    uniform: "uMix",
    domain: "post",
    math: "depends on uBlend",
    range: "0–1",
    glsl: "c = fuse(ca, cb, uMix, uBlend, r);",
    hlsl: "c = Fuse(ca, cb, _Mix, _Blend, r);",
    r3f: "uMix: { value: 0.42 }",
    unity: "_Mix — opacity of B under the blend law",
    wgsl: "c = fuse(ca, cb, mixv, blend, r);",
    codec: "Two-layer composite. A is always the playing reel.",
    nle: "B opacity. Blend mode must match uBlend (not a random overlay).",
  },
  {
    id: "blend",
    title: "Blend",
    uniform: "uBlend",
    domain: "post",
    math: "0 lerp · 1 add · 2 multiply · 3 |A−B| · 4 radial · 5 luma gate",
    range: "enum 0–5",
    glsl: "fuse() branch on uBlend",
    hlsl: "Fuse() switch(_Blend)",
    r3f: "uBlend: { value: 4 } // radial",
    unity: "_Blend int, same branch order",
    wgsl: "same six-way fuse",
    codec: "Not a codec property — a composite law. Radial = A well, B rim.",
    nle: "Cross=Normal, Add=Add, Multiply=Multiply, Difference=Difference, Radial=radial gradient mask, Luma=luma key of A.",
  },
  {
    id: "omega",
    title: "Omega",
    uniform: "omega",
    domain: "field",
    math: "ω in the damped packet, Hz",
    range: "per-reel signature",
    glsl: "sin(uTime * omega * TAU)",
    hlsl: "sin(_Time * _Omega * 6.2831853)",
    r3f: "drive from clock, not performance.now() jumps",
    unity: "_Omega, seconds not frames",
    wgsl: "sin(time * omega * TAU)",
    codec: "Peak frequency of radial envelope. Ember 0.08, Storm 0.38, Pulse 0.52",
    nle: "Loop duration T must fit integer-ish cycles, then rest.",
  },
  {
    id: "tau",
    title: "Tau",
    uniform: "tau",
    domain: "field",
    math: "decay time of e^{−t/τ}",
    range: "per-reel, seconds",
    glsl: "exp(-min(t, tau*4.0) / tau)",
    hlsl: "exp(-min(t, _Tau*4) / _Tau)",
    r3f: "tau from ReelSignature",
    unity: "_Tau",
    wgsl: "exp(-min(t, tau * 4.0) / tau)",
    codec: "Envelope half-life. Gaze τ=8 is a fermata; Storm τ=1.6 must rest at T.",
    nle: "Last-frame hold. If the loop pops, τ is too long for T.",
  },
  {
    id: "weather",
    title: "Weather",
    uniform: "weather",
    domain: "projection",
    math: "scales A, spin, chroma, flare together",
    range: "0–1",
    glsl: "A *= weather;  // before isolate",
    hlsl: "_Weather master",
    r3f: "multiply amplitudes, not time",
    unity: "_Weather",
    wgsl: "amp *= weather;",
    codec: "Global amplitude. 0 = still plate. 1 = full packet.",
    nle: "Master of all animated properties. Isolate still works at any weather.",
  },
];

export const KNOB_BY_ID: Record<KnobId, Knob> = Object.fromEntries(KNOBS.map((k) => [k.id, k])) as Record<
  KnobId,
  Knob
>;

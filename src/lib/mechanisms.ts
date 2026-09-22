export type IsolateId = "all" | "fold" | "spin" | "breath" | "chroma" | "vignette" | "flare";
export type BlendId = "cross" | "add" | "multiply" | "difference" | "radial" | "luma";
export type Domain =
  | "geometry"
  | "field"
  | "emitter"
  | "projection"
  | "receiver"
  | "observer"
  | "post";

export type Mechanism = {
  id: IsolateId;
  title: string;
  domain: Domain;
  law: string;
  math: string;
  isolate: string;
  see: string;
  glsl: string;
  hlsl: string;
  uniform: string;
};

export const MECHANISMS: Mechanism[] = [
  {
    id: "all",
    title: "Composite",
    domain: "post",
    law: "Every live uniform at once. The disc as the instrument actually plays.",
    math: "C = V(H(K(p; folds, spin, zoom)))",
    isolate: "Nothing soloed. Use this to check the full packet before copying a score.",
    see: "The whole mandala. If you cannot name a law, go back and solo it.",
    glsl: "frag = vignette(hue(kaleido(uv)))",
    hlsl: "return Vignette(HueShift(Kaleido(uv)));",
    uniform: "uIsolate=0",
  },
  {
    id: "fold",
    title: "Fold",
    domain: "geometry",
    law: "Polar kaleidoscope. Angle is folded into a sector of π/N and mirrored.",
    math: "θ' = |mod(θ, 2π/N) − π/N|",
    isolate: "Spin, breath, chroma, flare off. Only the native fold of this Voice.",
    see: "Wedges of this Voice’s N. Frost must be 6 or 12. Argus 10. No extras.",
    glsl: "a = abs(mod(atan(p.y,p.x), 2.0*sector) - sector);",
    hlsl: "a = abs(fmod(atan2(p.y,p.x), 2.0*sector) - sector);",
    uniform: "uFolds",
  },
  {
    id: "spin",
    title: "Spin",
    domain: "observer",
    law: "Rigid angular velocity of the observer around the disc. Fold held at 2 so rotation is visible as itself.",
    math: "θ(t) = θ₀ + ω t",
    isolate: "No kaleidoscope. You are watching the camera turn, not petals multiply.",
    see: "The plate turns as a rigid body. Jewel Garden Spin is the reference.",
    glsl: "uv = rotate(p, uSpin) * 0.5 + 0.5;",
    hlsl: "uv = mul(Rotate2(uSpin), p) * 0.5 + 0.5;",
    uniform: "uSpin",
  },
  {
    id: "breath",
    title: "Breath",
    domain: "field",
    law: "Damped radial inhale. Zoom oscillates and decays so a beat can close.",
    math: "r(t) = r₀ + A e^{−t/τ} sin(ω t)",
    isolate: "Fold held at 2. Only the radius breathes. If it does not return, the packet is illegal.",
    see: "The image inhales and returns. No wedges. Rest at T.",
    glsl: "zoom = 1.0 + uBreath * sin(uTime * omega);",
    hlsl: "zoom = 1.0 + uBreath * sin(uTime * omega);",
    uniform: "uBreath",
  },
  {
    id: "chroma",
    title: "Chroma",
    domain: "receiver",
    law: "Thin-film hue rotation, clamped to the Voice palette. Not a free rainbow.",
    math: "c' = R_YIQ(α) c,  α ∈ [0, 0.12] turns",
    isolate: "No fold. Hue only. If the plate leaves its family, chroma is too high.",
    see: "Hue walks, geometry still. Spectrum Core is the only wide walk.",
    glsl: "c = hueShift(c, uChroma * 6.28318);",
    hlsl: "c = HueShift(c, uChroma * TWO_PI);",
    uniform: "uChroma",
  },
  {
    id: "vignette",
    title: "Vignette",
    domain: "observer",
    law: "Circular falloff that makes the disc, not a mood filter.",
    math: "V = smoothstep(1.02, 0.42, |p|)",
    isolate: "Unfolded image in a true circle. Edge law only.",
    see: "A circle. Edge goes dark. Center holds. Night Lily owns the deep falloff.",
    glsl: "c *= smoothstep(1.02, 0.42, r);",
    hlsl: "c *= smoothstep(1.02, 0.42, r);",
    uniform: "uVignette",
  },
  {
    id: "flare",
    title: "Flare",
    domain: "emitter",
    law: "Center luma pulse. Night Crystal owns this; other Voices may borrow a little, never a blowout.",
    math: "F = e^{−(r/σ)²} · A(t)",
    isolate: "No fold. A gaussian well at the stigma. If the well goes white, reject.",
    see: "A peach-gold well. Nothing else moves. Reject if it clips white.",
    glsl: "c += uFlare * exp(-r*r*14.0);",
    hlsl: "c += uFlare * exp(-r*r*14.0);",
    uniform: "uFlare",
  },
];

export const MECHANISM_BY_ID: Record<IsolateId, Mechanism> = Object.fromEntries(
  MECHANISMS.map((m) => [m.id, m]),
) as Record<IsolateId, Mechanism>;

export const ISOLATE_INDEX: Record<IsolateId, number> = {
  all: 0,
  fold: 1,
  spin: 2,
  breath: 3,
  chroma: 4,
  vignette: 5,
  flare: 6,
};

export const BLENDS: { id: BlendId; title: string; law: string; nle: string; index: number }[] = [
  { id: "cross", title: "Cross", law: "lerp(A, B, mix)", nle: "Normal opacity", index: 0 },
  { id: "add", title: "Add", law: "A + B · mix", nle: "Add / Linear Dodge", index: 1 },
  { id: "multiply", title: "Multiply", law: "A · mix(1, B, mix)", nle: "Multiply", index: 2 },
  { id: "difference", title: "Difference", law: "|A − B|  structure test", nle: "Difference", index: 3 },
  { id: "radial", title: "Radial", law: "A in the well, B on the rim", nle: "Radial gradient mask", index: 4 },
  { id: "luma", title: "Luma gate", law: "mix by luminance of A", nle: "Luma key of A", index: 5 },
];

export const BLEND_INDEX: Record<BlendId, number> = Object.fromEntries(
  BLENDS.map((b) => [b.id, b.index]),
) as Record<BlendId, number>;

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

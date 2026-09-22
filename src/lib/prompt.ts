import { fusionOf } from "@/lib/fusions";
import { KNOBS } from "@/lib/knobs";
import { BLENDS, MECHANISM_BY_ID, type BlendId, type IsolateId } from "@/lib/mechanisms";
import { REEL_BY_ID, type ReelId } from "@/lib/plates";
import { REEL_SIGNATURE, VOICES, type Voice } from "@/lib/voices";

export type PromptState = {
  reelA: ReelId | null;
  reelB: ReelId | null;
  plateId: Voice["plateId"];
  isolate: IsolateId;
  blend: BlendId;
  mix: number;
  folds: number;
  spin: number;
  zoom: number;
  breath: number;
  chroma: number;
  vignette: number;
  flare: number;
  weather: number;
  omega: number;
  tau: number;
  duration: number;
  seed: number;
};

export type EngineId = "json" | "prose" | "glsl" | "hlsl" | "r3f" | "unity" | "wgsl" | "knobs";

export const ENGINES: { id: EngineId; title: string }[] = [
  { id: "json", title: "JSON" },
  { id: "prose", title: "Prose" },
  { id: "glsl", title: "GLSL" },
  { id: "hlsl", title: "HLSL" },
  { id: "r3f", title: "R3F" },
  { id: "unity", title: "Unity" },
  { id: "wgsl", title: "WGSL" },
  { id: "knobs", title: "Knobs" },
];

export function compilePrompt(s: PromptState) {
  const a = s.reelA ? REEL_BY_ID[s.reelA] : null;
  const b = s.reelB ? REEL_BY_ID[s.reelB] : null;
  const sigA = s.reelA ? REEL_SIGNATURE[s.reelA] : null;
  const sigB = s.reelB ? REEL_SIGNATURE[s.reelB] : null;
  const voice = VOICES[s.plateId];
  const mech = MECHANISM_BY_ID[s.isolate];
  const blend = BLENDS.find((x) => x.id === s.blend)!;
  const fusion = Boolean(b);
  const fuse = fusion && a ? fusionOf(a.id, b!.id) : null;

  const uniforms = {
    uFolds: s.folds,
    uSpin: Number(s.spin.toFixed(4)),
    uZoom: Number(s.zoom.toFixed(4)),
    uBreath: Number(s.breath.toFixed(4)),
    uChroma: Number(s.chroma.toFixed(4)),
    uVignette: Number(s.vignette.toFixed(4)),
    uFlare: Number(s.flare.toFixed(4)),
    uMix: fusion ? Number(s.mix.toFixed(3)) : 0,
    uBlend: blend.index,
    uIsolate: mech.id,
    omega: Number(s.omega.toFixed(4)),
    tau: Number(s.tau.toFixed(3)),
    T: s.duration,
    weather: Number(s.weather.toFixed(3)),
  };

  const json = {
    id: fusion && a && b ? `${a.id}×${b.id}` : (a?.id ?? s.plateId),
    engine_live: "webgl2-kaleido",
    engines_export: ["glsl-300es", "hlsl-unity", "r3f-three", "wgsl-webgpu"],
    journey: fusion ? "fuse" : s.isolate === "all" ? "watch" : "isolate",
    unique: fuse?.unique ?? sigA?.unique ?? voice.unique,
    voice: {
      plate: s.plateId,
      foldSet: voice.foldSet,
      optical: voice.optical,
      physical: voice.physical,
      unique: voice.unique,
    },
    sourceA: a
      ? { reel: a.id, beat: a.beat, unique: sigA?.unique, codec: sigA?.codec, omega: sigA?.omega, tau: sigA?.tau }
      : { plate: s.plateId },
    sourceB: b
      ? { reel: b.id, beat: b.beat, unique: sigB?.unique, codec: sigB?.codec, omega: sigB?.omega, tau: sigB?.tau }
      : null,
    isolate: {
      id: mech.id,
      domain: mech.domain,
      law: mech.law,
      math: mech.math,
      see: mech.see,
    },
    fusion: fusion
      ? {
          name: fuse?.name ?? `${a?.title} × ${b?.title}`,
          blend: blend.id,
          law: blend.law,
          nle: blend.nle,
          mix: uniforms.uMix,
          edge: `${s.plateId}→${b?.plateId}`,
          unique: fuse?.unique,
          optical: fuse?.optical,
          physical: fuse?.physical,
          why: fuse?.why,
          keep: fuse?.keep,
          reject: fuse?.reject,
        }
      : null,
    time: {
      model: "damped-harmonic",
      omega: uniforms.omega,
      tau: uniforms.tau,
      T: uniforms.T,
      closure: "C0 required — envelope must rest at T",
      formula: "r(t) = r0 + A * exp(-t/tau) * sin(omega * t)",
    },
    uniforms,
    knobs: KNOBS.map((k) => ({
      id: k.id,
      uniform: k.uniform,
      math: k.math,
      glsl: k.glsl,
      hlsl: k.hlsl,
      r3f: k.r3f,
      unity: k.unity,
      wgsl: k.wgsl,
      codec: k.codec,
      nle: k.nle,
    })),
    seed: s.seed,
    reject_if: [
      fuse?.reject ?? "center luma > 0.96 for more than 4 frames",
      "fold not in Voice.foldSet",
      "hue walk on a non-spectrum Voice above uChroma 0.12",
      "loop end state not within envelope rest",
      ...(fuse ? [`identity lock: ${fuse.keep}`] : []),
    ],
  };

  const prose = fusion
    ? [
        `TESTABLE MOTION PACKET — ${fuse?.name ?? `${a?.title} × ${b?.title}`}.`,
        `A ${a?.title}: ${sigA?.unique ?? voice.unique}`,
        `B ${b?.title}: ${sigB?.unique}`,
        fuse ? `Unique: ${fuse.unique} Optical: ${fuse.optical} Physical: ${fuse.physical}` : "",
        `Why legal: ${fuse?.why ?? "Voice edge."}`,
        `Keep: ${fuse?.keep ?? voice.unique} Reject: ${fuse?.reject ?? "white well, fold fight."}`,
        `Blend ${blend.title} (${blend.nle}): ${blend.law}, mix ${uniforms.uMix}.`,
        `Native fold ${s.folds}. Isolate ${mech.title} (${mech.domain}): ${mech.math}.`,
        `Damped packet ω=${uniforms.omega} τ=${uniforms.tau} T=${uniforms.T}s, weather ${uniforms.weather}.`,
        `Same uniforms on WebGL2, HLSL/Unity, R3F/three.js, WGSL/WebGPU. Time in seconds.`,
        `Circular disc, kaleidoscopic mandala, no text, no watermark.`,
      ]
        .filter(Boolean)
        .join(" ")
    : [
        `TESTABLE MOTION PACKET — solo ${mech.title} on ${a?.title ?? s.plateId}.`,
        `${sigA?.unique ?? voice.unique}`,
        `${mech.law} You should see: ${mech.see}`,
        `${mech.math}`,
        `folds=${s.folds} spin=${uniforms.uSpin} zoom=${uniforms.uZoom} breath=${uniforms.uBreath} chroma=${uniforms.uChroma} flare=${uniforms.uFlare}.`,
        `ω=${uniforms.omega} τ=${uniforms.tau} T=${uniforms.T}. Rest at T. Circular mandala, no text.`,
      ].join(" ");

  const glsl = `// WebGL2 / GLSL 300 es — Prism Loom packet
// unique: ${fuse?.unique ?? sigA?.unique ?? voice.unique}
uniform sampler2D uTexA; uniform sampler2D uTexB;
uniform float uFolds, uSpin, uZoom, uMix, uBreath, uChroma, uFlare, uTime;
// isolate ${mech.id}  blend ${blend.id}  mix ${uniforms.uMix}
vec2 kaleido(vec2 p) {
  float r = length(p);
  float sector = 3.14159265 / max(uFolds, 2.0);
  float a = abs(mod(atan(p.y,p.x) + uSpin, 2.0*sector) - sector);
  return clamp(vec2(cos(a), sin(a)) * r * uZoom * 0.5 + 0.5, 0.001, 0.999);
}`;

  const hlsl = `// HLSL — Unity URP FullScreenPass / Custom Render Feature
// Bind _TexA, _TexB. Time in seconds, not frames.
// unique: ${fuse?.unique ?? sigA?.unique ?? voice.unique}
float2 Kaleido(float2 p, float folds, float spin, float zoom) {
  float r = length(p);
  float sector = 3.14159265 / max(folds, 2.0);
  float a = abs(fmod(atan2(p.y, p.x) + spin, 2.0 * sector) - sector);
  return saturate(float2(cos(a), sin(a)) * r * zoom * 0.5 + 0.5);
}
// _Folds=${s.folds} _Spin=${uniforms.uSpin} _Zoom=${uniforms.uZoom}
// _Mix=${uniforms.uMix} _Blend=${blend.index} _Chroma=${uniforms.uChroma} _Flare=${uniforms.uFlare}
// _Omega=${uniforms.omega} _Tau=${uniforms.tau}  rest at T=${uniforms.T}`;

  const r3f = `// R3F / three.js ShaderMaterial — uniforms only, not a new scene graph
// unique: ${fuse?.unique ?? sigA?.unique ?? voice.unique}
uniforms: {
  uTexA: { value: texA }, uTexB: { value: texB },
  uFolds: { value: ${s.folds} }, uSpin: { value: ${uniforms.uSpin} },
  uZoom: { value: ${uniforms.uZoom} }, uMix: { value: ${uniforms.uMix} },
  uBlend: { value: ${blend.index} },
  uBreath: { value: ${uniforms.uBreath} }, uChroma: { value: ${uniforms.uChroma} },
  uFlare: { value: ${uniforms.uFlare} }, uTime: { value: 0 }
}
// Drive uTime from a monotonic clock. Do not use performance.now() jumps on pause.
// Same fragment as public/GLSL. three.js is an export target, not the live instrument.`;

  const unity = `// Unity URP 17 — Full Screen Pass Renderer Feature
// Texture2D _TexA, _TexB;  float _Folds, _Spin, _Zoom, _Mix, _Blend, _Chroma, _Flare, _Omega, _Tau;
half3 Frag(Varyings i) : SV_Target {
  float2 p = i.uv * 2 - 1;
  float2 uv = Kaleido(p, _Folds, _Spin, _Zoom);
  half3 A = SAMPLE_TEXTURE2D(_TexA, sampler_TexA, uv).rgb;
  half3 B = SAMPLE_TEXTURE2D(_TexB, sampler_TexB, uv).rgb;
  half3 C = Fuse(A, B, _Mix, _Blend, length(p));
  return half4(C, 1);
}
// Map NLE: ${blend.nle}. Keep: ${fuse?.keep ?? voice.unique}
// Reject: ${fuse?.reject ?? "white well; fold not in foldSet."}`;

  const wgsl = `// WGSL / WebGPU fragment — same packet, not the live instrument
@group(0) @binding(0) var texA: texture_2d<f32>;
@group(0) @binding(1) var texB: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;
struct Packet { folds: f32, spin: f32, zoom: f32, mix: f32, blend: f32, chroma: f32, flare: f32, time: f32 }
@group(0) @binding(3) var<uniform> u: Packet;
fn kaleido(p: vec2f) -> vec2f {
  let r = length(p);
  let sector = 3.14159265 / max(u.folds, 2.0);
  let a = abs((atan2(p.y, p.x) + u.spin) % (2.0 * sector) - sector);
  return clamp(vec2f(cos(a), sin(a)) * r * u.zoom * 0.5 + 0.5, vec2f(0.001), vec2f(0.999));
}
// folds=${s.folds} mix=${uniforms.uMix} blend=${blend.index} omega=${uniforms.omega} tau=${uniforms.tau}`;

  const knobs = [
    `Prism Loom — aligned knobs for this ${fusion ? "fusion" : "reel"}`,
    `id  ${json.id}`,
    `unique  ${fuse?.unique ?? sigA?.unique ?? voice.unique}`,
    ``,
    `id          uniform     live        hlsl/unity     r3f          wgsl         nle / codec`,
    ...KNOBS.map((k) => {
      const live =
        k.id === "folds"
          ? String(s.folds)
          : k.id === "spin"
            ? String(uniforms.uSpin)
            : k.id === "zoom"
              ? String(uniforms.uZoom)
              : k.id === "breath"
                ? String(uniforms.uBreath)
                : k.id === "chroma"
                  ? String(uniforms.uChroma)
                  : k.id === "vignette"
                    ? String(uniforms.uVignette)
                    : k.id === "flare"
                      ? String(uniforms.uFlare)
                      : k.id === "mix"
                        ? String(uniforms.uMix)
                        : k.id === "blend"
                          ? blend.id
                          : k.id === "omega"
                            ? String(uniforms.omega)
                            : k.id === "tau"
                              ? String(uniforms.tau)
                              : String(uniforms.weather);
      return `${k.id.padEnd(12)}${k.uniform.padEnd(12)}${live.padEnd(12)}${k.unity.padEnd(15)}${k.r3f.slice(0, 14).padEnd(13)}${k.wgsl.slice(0, 12).padEnd(13)}${k.nle}`;
    }),
    ``,
    `Time model  r(t)=r0 + A e^{-t/τ} sin(ωt)   ω=${uniforms.omega} τ=${uniforms.tau} T=${uniforms.T}`,
    `Keep  ${fuse?.keep ?? voice.unique}`,
    `Reject  ${fuse?.reject ?? "white well; fold fight; missed rest."}`,
  ].join("\n");

  return { json, prose, glsl, hlsl, r3f, unity, wgsl, knobs, fusion, fuse };
}

export function packetText(
  packet: ReturnType<typeof compilePrompt>,
  engine: EngineId,
): string {
  if (engine === "json") return JSON.stringify(packet.json, null, 2);
  return packet[engine];
}

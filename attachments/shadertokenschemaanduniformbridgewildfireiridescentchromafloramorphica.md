# Shader Token Schema + Uniform Bridge

**Wildfire Iridescent / Chromaflora / Morphica**  
Architecture for bridging CSS design tokens to GLSL uniforms.

---

## The Problem This Solves

CSS custom properties and GLSL uniforms live in entirely separate execution contexts.
CSS runs on the CPU, resolved by the browser style engine. GLSL runs on the GPU,
compiled by the driver, with zero awareness of CSS. There is no native bridge.

This system creates a deliberate translation layer: **CSS is the authoring interface,
GLSL is the execution environment, and the UniformBridge is the translator.**

---

## Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1 — Design Tokens  (tokens/shader.css)                │
│  Human-readable CSS vars. Designer-friendly units.          │
│  --shader-refraction-index: 1.52                            │
│  --shader-irid-shift: 180deg                                │
│  --shader-color-primary: #01696f                            │
└────────────────────────┬────────────────────────────────────┘
                         │ getComputedStyle()
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 2 — UniformBridge  (lib/shaders/UniformBridge.ts)     │
│  Reads CSS vars, converts types, pushes to WebGL context.   │
│  hex → vec3    deg → radians    ms → seconds                │
│  nm → 0-1      px → normalized  int → int                   │
└────────────────────────┬────────────────────────────────────┘
                         │ material.uniforms[name].value = ...
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 3 — GLSL Uniforms  (shaders/chunks/_uniforms.glsl)    │
│  GPU-native types. Physics-accurate.                         │
│  uniform float u_refractionIndex;   // 1.52                 │
│  uniform float u_iridShift;         // 3.14159 (π rad)      │
│  uniform vec3  u_colorPrimary;      // vec3(0.004, 0.412..) │
└─────────────────────────────────────────────────────────────┘
```

---

## File Index

| File | Purpose |
|------|---------|
| `tokens_shader.css` | CSS custom properties — all shader inputs, authored in human units |
| `UniformBridge.ts` | Core bridge: TokenDef registry, type converters, bridge class |
| `uniforms.glsl` | GLSL declarations + utility functions (fresnel, iridescence, colorGrade) |
| `useUniformBridge.ts` | React hook: wires material, runs rAF loop, watches theme changes |
| `IridescentSphere_example.tsx` | Full R3F usage example |

---

## Type Conversion Table

| CSS Unit | UniformType | GLSL Type | Conversion |
|----------|-------------|-----------|------------|
| `1.52` (unitless) | `float` | `float` | Direct passthrough |
| `180deg` | `float_deg` | `float` | `× π/180` |
| `400ms` | `float_ms` | `float` | `÷ 1000` |
| `550nm` | `float_nm` | `float` | `(nm−380)/400` → 0–1 |
| `48px` | `float_px_x` | `float` | `÷ canvas.width` |
| `4` | `int` | `int` | `Math.round()` |
| `#01696f` | `vec3_hex` | `vec3` | `/255` each channel |

---

## Dark Mode / Theme Switching

The `UniformBridge.observe()` method attaches a `MutationObserver` to
`document.documentElement`. When `data-theme="dark"` is set (your existing
dark mode toggle), the observer fires, re-reads all CSS vars, reconverts,
and pushes updated uniforms. The shader receives a new palette on the
next rendered frame — zero manual wiring required.

---

## Adding a New Token

1. Add the CSS var to `tokens_shader.css` under `:root`
2. Add a `TokenDef` entry to `SHADER_TOKENS` in `UniformBridge.ts`
3. Declare the uniform in `uniforms.glsl`
4. Use it in your GLSL shader

---

## Physics Tokens Are Most at Home in GLSL

Unlike CSS approximations (e.g. `filter: brightness()` for exposure),
physics constants map directly to shader math:

```glsl
// Fresnel reflectance at normal incidence — Schlick approximation
// F0 = ((n1 - n2) / (n1 + n2))² where n1=1.0 (air), n2=u_refractionIndex
float F0 = pow((1.0 - u_refractionIndex) / (1.0 + u_refractionIndex), 2.0);
float fresnelReflectance = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
```

`u_refractionIndex` is consumed directly as a physical optical constant —
this is the token's most natural home.

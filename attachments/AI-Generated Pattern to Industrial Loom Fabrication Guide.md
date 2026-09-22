# AI-Generated Pattern to Industrial Loom Fabrication
### A Technical Reference Guide for the Generative-to-Woven Pipeline

---

## 1. Purpose and Scope

This guide defines the technical infrastructure needed to take pattern output from a generative model (diffusion, GAN, or transformer-based image/sequence synthesis) and turn it into physically weavable, machine-executable instructions on shaft/dobby or Jacquard-class industrial looms. It covers four layers:

1. **Schema** — the intermediate data contract between "AI pattern" and "weave structure."
2. **Constraints** — material and loom-hardware limits that bound what the compiler is allowed to emit.
3. **Compiler logic** — the transformation pipeline from inference output to machine instructions (WIF / dobby peg-plan / Jacquard bitmap-equivalent).
4. **Troubleshooting** — a diagnostic framework for the failure modes unique to AI-to-loom translation.

The reference format target is the **Weaving Information File (WIF) 1.1** standard for dobby/shaft looms, since it is the most widely supported non-proprietary interchange format across weaving software and dobby controllers ([WIF 1.1 Specification](http://www.tantradharma.com/maplehill/wif/wifspec.txt), [Interweave WIF FAQ](https://www.interweave.com/wp-content/uploads/WIF_FAQs.pdf)), and the **pixel-per-thread bitmap model** used by industrial Jacquard systems such as the TC2, where every pixel is tagged to one thread and one pick ([Digital Weaving Norway, TC2 Loom](https://digitalweaving.no/en/tc2-loom/), [TC2 technical overview](https://www.digitalweaving.no/wp-content/uploads/2021/01/TC2-Loom.pdf)). Both targets are treated as compiler backends in Section 4.

---

## 2. System Architecture Overview

```
┌─────────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│  Generative Model    │     │  Intermediate Pattern │     │   Pattern Compiler     │     │  Loom-Native Output  │
│  (diffusion / GAN /  │ --> │  Schema (JSON, this   │ --> │  (structure resolver,  │ --> │  WIF / dobby peg-plan │
│  transformer)        │     │  guide, Sec. 3)        │     │  constraint solver,    │     │  / Jacquard bitmap +  │
│  raw RGB / latent /  │     │                        │     │  liftplan generator)   │     │  drive-file for       │
│  attribute vector    │     │                        │     │                        │     │  controller           │
└─────────────────────┘     └──────────────────────┘     └───────────────────────┘     └─────────────────────┘
                                                                    ▲
                                                                    │
                                                     ┌──────────────┴───────────────┐
                                                     │ Material & Loom Constraint DB │
                                                     │ (fiber, tension, shaft count,  │
                                                     │  shed geometry, sett tables)   │
                                                     └────────────────────────────────┘
```

The critical design principle: **generative models must never emit loom instructions directly.** They emit a *design intent* (color/structure map, density map, or attribute vector). The compiler is the only component permitted to emit machine-executable geometry, because it is the only layer with visibility into physical constraints (Section 4).

---

## 3. Pattern Attribute Schema

### 3.1 Design Rationale

AI pattern generators typically output one of three representations:

- **Raster/pixel output** (diffusion or GAN image, RGB or grayscale) — maps naturally to Jacquard-style pixel-per-thread control.
- **Vector/attribute output** (structured JSON describing motif, repeat, symmetry group, palette) — needs explicit structure-assignment before it can drive a loom.
- **Latent/parametric output** (a vector in a trained design space) — must first be decoded into one of the above before compilation.

The schema below is the canonical intermediate representation ("Pattern Interchange Object", **PIO**) that all three upstream forms must be normalized into before entering the compiler. It deliberately mirrors WIF's section structure (`WEAVING`, `WARP`, `WEFT`, `THREADING`, `TIEUP`, `TREADLING`, `COLOR PALETTE`) so downstream conversion is close to 1:1 ([WIF spec](http://www.tantradharma.com/maplehill/wif/wifspec.txt)), while adding the fields a generative pipeline needs that a human-authored draft never has to declare: provenance, confidence, and constraint hints.

### 3.2 JSON Schema — Pattern Interchange Object (PIO)

```json
{
  "$schema": "https://schemas.example.org/pio/v1.0/pattern-interchange-object.json",
  "type": "object",
  "required": ["meta", "canvas", "structure_map", "palette", "material_intent", "loom_target"],
  "properties": {

    "meta": {
      "type": "object",
      "required": ["source_model", "generation_id", "confidence", "created_at"],
      "properties": {
        "source_model": { "type": "string", "description": "Model name/version that produced the pattern, e.g. 'diffusion-textile-v3'" },
        "generation_id": { "type": "string", "format": "uuid" },
        "confidence": { "type": "number", "minimum": 0, "maximum": 1, "description": "Model-reported or post-hoc structure-classification confidence per region" },
        "seed": { "type": ["integer", "null"] },
        "created_at": { "type": "string", "format": "date-time" },
        "human_reviewed": { "type": "boolean", "default": false }
      }
    },

    "canvas": {
      "type": "object",
      "required": ["width_px", "height_px", "repeat_x", "repeat_y"],
      "properties": {
        "width_px": { "type": "integer", "minimum": 1, "description": "Pattern width in design pixels; will be mapped to ends via aspect-ratio resolution (Sec 4.3)" },
        "height_px": { "type": "integer", "minimum": 1, "description": "Pattern height in design pixels; maps to picks" },
        "repeat_x": { "type": "integer", "minimum": 1, "description": "Number of horizontal repeats intended across fabric width" },
        "repeat_y": { "type": "integer", "minimum": 1, "description": "Number of vertical repeats along fabric length" },
        "symmetry_group": { "type": "string", "enum": ["none", "mirror_x", "mirror_y", "mirror_xy", "rotational_2", "rotational_4", "p4m", "pmm"], "default": "none" }
      }
    },

    "structure_map": {
      "type": "array",
      "description": "Region-to-weave-structure assignment. Each region is a mask over the canvas plus the requested binary/weave structure. This is the field that differentiates 'image' from 'weavable design'.",
      "items": {
        "type": "object",
        "required": ["region_id", "mask_ref", "requested_structure", "layer_role"],
        "properties": {
          "region_id": { "type": "string" },
          "mask_ref": { "type": "string", "description": "Pointer to a binary mask (same dims as canvas) selecting pixels belonging to this region" },
          "requested_structure": {
            "type": "string",
            "enum": ["plain", "twill_2_2", "twill_3_1", "satin_5", "satin_8", "basket_2_2", "waffle", "honeycomb", "doubleweave", "leno", "float_supplementary"],
            "description": "Weave structure the compiler should attempt to bind to this region; compiler may substitute (Sec 4.4) if constraints forbid it"
          },
          "layer_role": { "type": "string", "enum": ["face", "back", "binder", "float"], "description": "Relevant for doubleweave/multi-layer structures" },
          "float_max_hint": { "type": ["integer", "null"], "description": "AI-suggested max float length; compiler validates against Sec 4.2 fabric-stability limits" }
        }
      }
    },

    "palette": {
      "type": "array",
      "description": "Maps pattern colors to warp/weft yarn assignments. Mirrors WIF's COLOR PALETTE / COLOR TABLE sections.",
      "items": {
        "type": "object",
        "required": ["color_id", "rgb", "assigned_yarn_ref"],
        "properties": {
          "color_id": { "type": "integer" },
          "rgb": { "type": "array", "items": { "type": "integer", "minimum": 0, "maximum": 255 }, "minItems": 3, "maxItems": 3 },
          "assigned_yarn_ref": { "type": "string", "description": "Foreign key into the material constraint DB (Sec 4.1)" }
        }
      }
    },

    "material_intent": {
      "type": "object",
      "required": ["warp_fiber", "weft_fiber", "target_gsm"],
      "properties": {
        "warp_fiber": { "type": "string", "description": "Foreign key into fiber constraint table, e.g. 'cotton_combed_ne40'" },
        "weft_fiber": { "type": "string" },
        "target_gsm": { "type": "number", "description": "Desired fabric weight, grams/m^2, used to back-solve sett and pick density" },
        "target_hand": { "type": "string", "enum": ["crisp", "soft_drape", "structured", "sheer"], "default": "structured" }
      }
    },

    "loom_target": {
      "type": "object",
      "required": ["loom_class", "max_shafts_or_hooks", "width_mm"],
      "properties": {
        "loom_class": { "type": "string", "enum": ["dobby_shaft", "jacquard_pixel", "tappet_cam"] },
        "max_shafts_or_hooks": { "type": "integer", "description": "Physical shaft count for dobby, or independently controlled hook/heddle count for Jacquard" },
        "width_mm": { "type": "number" },
        "shed_geometry": { "type": "string", "enum": ["bottom_closed", "center_closed", "semi_open", "open"], "default": "center_closed" }
      }
    },

    "compiler_hints": {
      "type": "object",
      "description": "Optional. Lets the generative layer pass soft preferences without dictating machine code.",
      "properties": {
        "prefer_structure_substitution": { "type": "boolean", "default": true },
        "allow_palette_reduction": { "type": "boolean", "default": true },
        "max_color_count": { "type": ["integer", "null"] }
      }
    }
  }
}
```

### 3.3 Why This Schema Shape

- **Separation of `structure_map` from `palette`** mirrors the standard Jacquard CAD workflow, where a designer paints regions in flat color and then assigns a weave structure to each color via "paint by numbers" — the loom driver then replaces every pixel of a given color with the corresponding structure's own pixel grid ([Tien Chiu, TC2 vs shaft loom comparison](https://tienchiu.com/how-tos/weaving/a-comparison-of-jacquard-looms/how-a-tc-2-jacquard-loom-differs-from-a-shaft-loom/)). AI models are good at proposing regions and colors; they are unreliable at proposing physically valid structures unconstrained, so this must be a distinct, independently-validated field.
- **`confidence` at the meta level and `float_max_hint` at the region level** exist because generative models hallucinate structural plausibility the same way they hallucinate facts — a diffusion model can produce a visually convincing weave-like texture that does not correspond to any physically realizable interlacement. The compiler must treat every `requested_structure` as a proposal, not a command.
- **`repeat_x` / `repeat_y` and `symmetry_group`** are required because looms weave repeats, not one-off images at full fabric size — Jacquard modules are built in fixed-width increments (e.g. TC2 modules are 220 threads / 14.5 in at 15 epi) so an arbitrary generative canvas must be resolved to an integer repeat count against loom width ([Digital Weaving Norway](https://digitalweaving.no/en/tc2-loom/)).

---

## 4. Constraint Layer

### 4.1 Material Constraints

Every yarn referenced in `material_intent` or `palette.assigned_yarn_ref` must resolve to a row in the fiber constraint table before the compiler will accept a pattern. Minimum required fields:

| Field | Description | Typical Use in Compiler |
|---|---|---|
| `fiber_type` | Cotton, wool, silk, linen, polyester, nylon, viscose/rayon, aramid, glass, metallic | Determines abrasion tolerance, heat-set behavior, and legal float length |
| `yarn_count` | Linear density (Ne, Nm, Tex, or Denier) | Drives sett (EPI) and pick density (PPI) calculation |
| `tenacity` | Breaking tenacity, typically cN/tex or g/den | Sets maximum warp tension the yarn can carry without failure |
| `elongation_at_break` | % | Determines take-up allowance and shed-stress tolerance |
| `twist_direction_tpi` | S/Z twist, turns per inch | Affects binding stability of floats and interlock points |
| `moisture_regain` | % | Relevant for natural fibers; affects tension drift during a run |
| `abrasion_cycles_to_failure` | Martindale or equivalent cycle count | Bounds how many heddle/reed passes the yarn tolerates before compiler must flag downtime risk |

**Representative tenacity/elongation ranges** (used as default sanity bounds when a specific yarn spec sheet is unavailable):

| Fiber | Typical Tenacity (cN/tex) | Typical Elongation at Break (%) | Notes |
|---|---|---|---|
| Cotton (combed) | 20–30 | 5–10 | Moderate strength, low elasticity — floats must stay short |
| Wool | 10–17 | 25–40 | High elongation tolerates more shed stress but low abrasion resistance |
| Silk | 25–40 | 15–25 | High tenacity, fine denier — good for high EPI Jacquard work |
| Linen | 25–35 | 2–4 | Very low elongation — tight tension tolerance, prone to warp breaks under vibration |
| Polyester (filament) | 35–55 | 15–30 | High strength and abrasion resistance — good warp candidate for dense repeats |
| Nylon | 40–65 | 20–35 | Highest elongation of common synthetics — needs tension compensation in take-up |
| Viscose/Rayon | 18–24 | 15–25 | Weak when wet — avoid as warp in humid production environments |

Values are indicative ranges compiled from standard textile fiber property references and should be replaced with mill-verified yarn test data before production compilation ([Textile fiber property reference](https://www.scribd.com/document/956827950/Table-of-Properties-of-Textile-Fibers)).

**Hard constraint rules the compiler enforces:**

1. `tenacity(warp_yarn) × yarn_count_correction ≥ required_warp_tension(loom_class, width_mm)` — reject or down-tension if false.
2. `elongation_at_break(warp_yarn) ≥ minimum_shed_depth_elongation(shed_geometry)` — center-closed and open sheds impose more cyclic strain than bottom-closed; low-elongation fibers (linen, high-twist cotton) are restricted to bottom-closed or semi-open shedding.
3. `float_max_hint ≤ f(tenacity, abrasion_cycles_to_failure)` — long floats on low-tenacity/low-abrasion yarns are auto-shortened or rejected (see Section 4.2).
4. Warp and weft fibers with mismatched `moisture_regain` beyond a defined delta trigger a tension-drift warning, since differential shrinkage during weaving distorts the pixel-to-thread mapping over a long run.

### 4.2 Structural/Fabric Constraints

These bound what `requested_structure` values are legal for a given material + density combination.

- **Sett (EPI) and pick density (PPI)** are derived, not chosen freely. Standard practice: `EPI ≈ WPI ÷ 2` for a balanced plain weave, `EPI ≈ WPI × 2⁄3` for twill, with structure-specific WPI factors (plain 50%, twill 42%, basket 45%, lace 33%) ([Weaving loom sett calculator](https://usecalcpro.com/crafts/weaving-loom-sett-calculator), [Gist Yarn WPI/EPI guide](https://www.gistyarn.com/blogs/how-to-weave/what-is-wpi-how-do-i-use-it-to-calculate-sett-or-epi-for-weaving)). The compiler must compute sett from `yarn_count` and `requested_structure` rather than accepting an AI-proposed density directly, since generative models routinely propose pixel densities with no physical sett behind them.
- **Maximum float length**: a float (thread skipping over multiple opposing threads without interlacing) beyond ~5–8 ends for typical apparel-weight yarns creates snagging risk and reduces abrasion resistance. Satin/sateen structures (`satin_5`, `satin_8`) are the only `requested_structure` values permitted to carry floats at their nominal repeat length; all others cap float length at the region's local WPI-derived firmness factor.
- **Balance and skew**: pixel aspect ratio in the source pattern will not equal 1:1 on the loom unless `ppi/epi = 1`. The compiler must apply `Pixel Aspect Ratio = PPI ÷ EPI` and resample the pattern canvas accordingly before generating threading/treadling, or the woven output will appear stretched or squashed relative to the AI-generated design ([Handweaving.net, Image Into Weave](http://media.handweaving.net/DigitalArchive/books/wp_Chapter_04.pdf)).
- **Take-up and shrinkage allowance**: warp length and finished dimensions must include a take-up allowance (typically 5–15%) and shrinkage allowance (5–10%, fiber dependent) — the compiler must expand `canvas.height_px × repeat_y` accordingly when computing total picks and warp length, or the finished pattern repeat will run short ([George Weil warp measurement guide](https://www.georgeweil.com/blog/how-to-measure-warp-for-weaving/)).

### 4.3 Loom Compatibility Constraints

| Parameter | Dobby/Shaft Loom | Jacquard-class Loom |
|---|---|---|
| **Addressable unit** | Shaft (frame of heddles); typically 4–48 shafts, practically capped near 24–36 for natural fibers, up to 28 on standard dobby heads | Individual hook/heddle, addressed per-thread; e.g. TC2 modules give independent control of up to 10,560 threads across width |
| **Pattern resolution ceiling** | Number of *distinct sheds* = combinatorial function of shaft count (an 8-shaft loom yields up to 254 distinct sheds; 16 shafts yields up to 65,534) — this bounds design complexity, not just repeat size | Resolution = 1 pixel : 1 thread : 1 pick; ceiling is module count × width, not a combinatorial shed limit |
| **Shed geometry** | Bottom-closed, center-closed, semi-open, or open — dobby mechanism type determines which are available | N/A in the shaft sense; each hook independently raised/lowered per pick |
| **Re-sleying** | Possible; EPI can be changed by moving heddles/reed | Not possible on fixed-heddle systems (e.g., TC2) — heddles are fixed top/bottom in modules; sett is changed only by adding/removing modules or casting out ends |
| **Repeat handling** | Threading is physically limited by shaft count and tie-up combinations; dobby chain/peg-plan length limits treadling sequence length | Full-image variation possible every pick with no combinatorial shed penalty — trades off against module/data-processing bandwidth |

Sources: [Dobby loom shed-count reference](https://en.wikipedia.org/wiki/Dobby_loom), [Dobby shedding mechanism classification](https://www.textilesphere.com/2020/12/dobby-shedding-mechanism-weaving.html), [TC2 loom technical specification](https://www.digitalweaving.no/wp-content/uploads/2021/01/TC2-Loom.pdf), [Tien Chiu TC2 vs shaft loom](https://tienchiu.com/how-tos/weaving/a-comparison-of-jacquard-looms/how-a-tc-2-jacquard-loom-differs-from-a-shaft-loom/).

**Compiler-enforced compatibility rules:**

1. If `loom_target.loom_class == "dobby_shaft"`: the number of *unique threading columns* implied by `structure_map` must not exceed `max_shafts_or_hooks`. If it does, the compiler must either (a) request palette/structure reduction, or (b) fall back to a Jacquard target, since dobby cannot exceed physical shaft count regardless of pattern complexity.
2. If `loom_target.loom_class == "dobby_shaft"`: `shed_geometry` must be validated against low-elongation warp yarns per Section 4.1 rule 2.
3. If `loom_target.loom_class == "jacquard_pixel"`: `canvas.width_px` after aspect-ratio correction must equal an integer multiple of the module width in threads (e.g., 220-thread increments for TC2-class systems); the compiler pads or crops rather than silently distorting scale.
4. Re-sleying assumptions are only valid for `dobby_shaft`; any `material_intent.target_gsm` back-solve that implies a sett change on a fixed-heddle Jacquard system must be rejected at compile time, not caught at the loom.

---

## 5. Pattern Compiler Logic

### 5.1 Pipeline Stages

```
Stage 0  Ingest & Normalize        raw generative output -> PIO (Sec 3)
Stage 1  Structural Validation     enforce Sec 4.1–4.3 hard constraints; reject or flag PIO
Stage 2  Structure Resolution      bind requested_structure -> concrete threading/tie-up/treadling unit per region
Stage 3  Geometry Reconciliation   aspect-ratio correction, repeat tiling, take-up/shrinkage expansion
Stage 4  Palette-to-Yarn Binding   resolve colors -> physical shuttle/yarn-carrier assignments
Stage 5  Machine Code Emission     emit WIF (dobby) or bitmap+drive-file (Jacquard)
Stage 6  Simulation & Drawdown QA  render predicted drawdown, run interlock/float/tension checks before send-to-loom
```

### 5.2 Stage 1 — Structural Validation

For every region in `structure_map`, the compiler runs the constraint checks from Section 4 in this order (fail-fast, but collect all violations for a single report rather than stopping at the first):

1. Fiber-tenacity-vs-tension check (4.1.1)
2. Elongation-vs-shed-geometry check (4.1.2)
3. Float-length-vs-abrasion check (4.1.3, 4.2)
4. Sett/PPI derivation from `yarn_count` and `requested_structure` (4.2)
5. Shaft-count / addressable-unit check (4.3.1)
6. Module-width integer-multiple check for Jacquard targets (4.3.3)

Any failed check produces a structured `ConstraintViolation` object: `{region_id, rule_id, severity, proposed_remediation}`. Severity `blocking` halts compilation; severity `advisory` proceeds but is logged for the QA stage.

### 5.3 Stage 2 — Structure Resolution (the core translation step)

This is where `requested_structure` (a symbolic label from the AI) becomes an actual threading/tie-up/treadling unit (or, for Jacquard, an actual weave-structure pixel block).

**Resolution algorithm:**

```
for region in structure_map:
    candidate = STRUCTURE_LIBRARY.lookup(region.requested_structure)
    if candidate is None:
        candidate = nearest_neighbor_structure(region.requested_structure, STRUCTURE_LIBRARY)
        log_substitution(region.region_id, region.requested_structure, candidate.name)

    if not passes_constraints(candidate, region, material_intent, loom_target):
        candidate = degrade_structure(candidate)   # e.g. satin_8 -> satin_5 -> twill_3_1 -> plain
        if candidate is None:
            raise BlockingViolation(region.region_id, "no viable structure under current constraints")

    region.resolved_unit = candidate.threading_block, candidate.tieup_block, candidate.treadling_block
```

`STRUCTURE_LIBRARY` stores each named structure (`plain`, `twill_2_2`, `satin_5`, etc.) as a minimal repeat unit exactly the way handweaving references define it — e.g. plain weave as a 2×2 matrix, a 2/2 twill as a 4×4 matrix, satin/sateen as their float-based repeat — so the compiler is always assembling from validated minimal repeats, never inventing interlacement patterns from pixel data directly ([Handweaving.net, Image Into Weave, Ch. 4](http://media.handweaving.net/DigitalArchive/books/wp_Chapter_04.pdf)).

`degrade_structure` implements an explicit fallback ladder (Section 4.2's float-length rule is the most common trigger): a generative model requesting `satin_8` in a region using low-tenacity, low-abrasion-resistance yarn (e.g. viscose weft) is automatically stepped down to `satin_5`, then `twill_3_1`, then `plain`, logging each step, rather than either failing outright or weaving an unstable float.

### 5.4 Stage 3 — Geometry Reconciliation

1. Compute `Pixel Aspect Ratio = target_PPI / target_EPI` from the sett/PPI values derived in Stage 1.
2. Resample `canvas` dimensions using nearest-neighbor interpolation (not bicubic) so that weave-structure pixel blocks are not blurred or partially blended across a threading boundary — bicubic resampling on a structure-encoded bitmap silently corrupts binary risers/sinkers ([Handweaving.net, Image Into Weave](http://media.handweaving.net/DigitalArchive/books/wp_Chapter_04.pdf)).
3. Tile `repeat_x` × `repeat_y` and apply `symmetry_group` transforms.
4. Apply take-up/shrinkage expansion to total pick count and warp length.
5. Snap final width to the nearest valid loom-width unit (integer shaft count for dobby; integer module-width multiple for Jacquard, per Section 4.3.3).

### 5.5 Stage 4 — Palette-to-Yarn Binding

Each `palette` entry's `assigned_yarn_ref` is resolved against the material constraint DB (Section 4.1). If `compiler_hints.allow_palette_reduction` is true and the resolved yarn count exceeds available shuttle/carrier slots on the target loom, the compiler performs a nearest-color merge (CIE ΔE-based) to collapse colors down to `max_color_count`, logging every merge for the design record.

### 5.6 Stage 5 — Machine Code Emission

**Dobby/shaft backend (WIF emission):**

- `[WEAVING]` section: `Shafts`, `Treadles`, `Rising Shed` (yes/no per shed geometry).
- `[THREADING]`: one shaft assignment per warp end, generated from the tiled `resolved_unit.threading_block` sequences of Stage 2/3.
- `[TIEUP]`: shaft-to-treadle bindings per resolved structure.
- `[TREADLING]`: one treadle (or comma-separated treadle set) per weft pick — for looms without a physical treadle (direct dobby drive), this is emitted as a liftplan instead, per WIF's liftplan mode ([WIF spec](http://www.tantradharma.com/maplehill/wif/wifspec.txt), [PyWeaving docs on liftplan conversion](https://pyweaving.readthedocs.io/_/downloads/en/latest/pdf/)).
- `[COLOR PALETTE]` / `[COLOR TABLE]` / `[WARP]` / `[WEFT]`: emitted directly from Stage 4 bindings and material thickness/spacing values.
- For dobby chain-driven (non-computer) looms, the compiler additionally emits a **peg-plan**: convert each `TIEUP` column into a dobby-bar peg pattern, one bar per pick, matching the standard tie-up-to-peg-plan conversion (transpose treadle/shaft rows into bar/hole positions) ([Woven Dream, dobby peg-plan conversion](https://wovendream.wordpress.com/2011/07/11/the-new-old-dobby-loom/)).

**Jacquard backend (pixel-driven emission):**

- Flatten the resolved, geometry-reconciled canvas to a single-layer bilevel (black/white) bitmap: black = warp riser, white = sinker, matching standard TC2/Jacquard convention (invert if the target controller's convention is reversed) ([Handweaving.net](http://media.handweaving.net/DigitalArchive/books/wp_Chapter_04.pdf), [AdaCAD TC2 tutorial](https://docs.adacad.org/docs/learn/tutorials/weave_tc2/)).
- Verify final bit depth is exactly 2 colors (true bilevel) — an indexed-color intermediate with >2 colors after Stage 4 binding is a compiler error, not a loom error, and must be caught before emission.
- Export as TIFF/BMP (uncompressed, no color-management profile embedded) at the resolution matching the physical thread count, or as WIF if the target Jacquard driver accepts it.
- Emit a companion drive-file/manifest recording module width, thread count, and casted-out ends (ends threaded but intentionally left non-weaving to hit a target EPI below full sett density) ([Tien Chiu, casting out ends](https://tienchiu.com/how-tos/weaving/a-comparison-of-jacquard-looms/how-a-tc-2-jacquard-loom-differs-from-a-shaft-loom/)).

### 5.7 Stage 6 — Simulation & Drawdown QA (mandatory gate before send-to-loom)

Before any file reaches the loom controller, the compiler renders a predicted drawdown/interlacement simulation and runs:

- **Interlock continuity check**: every warp end must interlace with weft at an interval ≤ the region's validated max float length (Section 4.2) across the *entire tiled repeat*, not just the base unit — tiling and symmetry transforms can create unintended long floats at seam boundaries between repeats.
- **Selvedge check**: first/last N ends across the width must resolve to a plain-weave or basket-weave structure regardless of the AI-requested pattern, to prevent edge unraveling — this is a hard override the compiler applies after Stage 2, not a suggestion.
- **Balance check**: confirm final `PPI/EPI` ratio is within the tolerance band implied by `target_hand`.
- **Weight check**: confirm computed GSM from final sett + pick density + yarn count is within tolerance of `material_intent.target_gsm`.

Only a PIO that passes all Stage 6 checks is allowed to produce a "release" WIF/bitmap artifact; anything else is returned with a structured diagnostic (Section 6).

---

## 6. Troubleshooting Framework

### 6.1 Diagnostic Model

Classify every fabrication failure along three axes before treating it:

1. **Layer of origin** — did the fault originate in the generative model's output, the compiler's translation logic, or the physical loom/material setup?
2. **Observability point** — was it caught in Stage 6 simulation (cheap), at first-pick physical weaving (moderate cost), or only after significant yardage was produced (expensive)?
3. **Determinism** — is the fault reproducible from the same PIO/seed (compiler or schema bug) or does it vary run to run on identical input (physical/environmental)?

Use this triage table first:

| Symptom | Likely Layer | First Diagnostic Action |
|---|---|---|
| Pattern looks stretched/squashed vs. source design | Compiler (Stage 3) | Check PPI/EPI aspect ratio computation |
| Repeat seams show visible misalignment or a doubled/missing row | Compiler (Stage 3/5) | Check tiling and repeat-boundary interlock re-validation |
| Fabric puckers, bows, or has wavy selvedges | Material + Loom | Check tension balance and take-up assumptions (Sec 4.1, 4.2) |
| Threads breaking during weaving | Material | Check tenacity vs. required tension (Sec 4.1 rule 1) |
| Floats snagging or fraying after limited handling | Material + Compiler | Check float length vs. abrasion cycles (Sec 4.1 rule 3, Sec 4.2) |
| Loom throws an "invalid lift" / shaft-limit error | Compiler + Loom | Check shaft/addressable-unit count validation (Sec 4.3.1) |
| Woven structure doesn't match requested structure at all | Compiler (Stage 2) | Check for silent structure substitution/degrade-ladder trigger |
| Fabric fine near start of run, degrades over length | Material + Environment | Check moisture regain mismatch / tension drift (Sec 4.1 rule 4) |

### 6.2 Failure Mode: Pattern Distortion

**Definition**: woven output geometry (proportions, angles, motif shape) does not match the source generative pattern.

**Root causes, in order of likelihood:**

1. **Aspect ratio not reconciled.** The single most common cause — pixels are not square on a loom; `Pixel Aspect Ratio = PPI/EPI` and if the compiler skipped Stage 3's resample step, a square motif in the source pattern will weave as a rectangle. Diagnostic: weave a short sample length and directly measure PPI and EPI on the physical cloth, then compare the ratio to the value the compiler used ([Handweaving.net](http://media.handweaving.net/DigitalArchive/books/wp_Chapter_04.pdf)).
2. **Resampling method corrupted structure pixels.** Bicubic or bilinear resampling blends adjacent structure-encoded pixels, producing intermediate gray values that get thresholded unpredictably. Fix: re-run Stage 3 with nearest-neighbor resampling only, never blend structure-map canvases.
3. **Take-up/shrinkage not modeled**, so the finished pattern repeat runs short lengthwise relative to what was intended, appearing "compressed." Fix: verify Stage 3 applied the fiber-appropriate take-up (5–15%) and shrinkage (5–10%, or sample-tested) allowances before the loom length was finalized ([George Weil warp guide](https://www.georgeweil.com/blog/how-to-measure-warp-for-weaving/)).
4. **Symmetry-group transform applied incorrectly** (e.g., mirrored on the wrong axis before tiling), producing a globally coherent but locally flipped motif. Fix: validate `symmetry_group` transform order — apply before tiling, not after — and re-render a full-repeat simulation, not just the base unit, in Stage 6.

**Remediation sequence:** re-simulate in Stage 6 with corrected aspect ratio → weave a physical test swatch of at least 2–3 pattern repeats → measure directly → only then commit to full-length production.

### 6.3 Failure Mode: Structural Instability (fabric-level)

**Definition**: the woven fabric is physically unsound — excessive skew, bowing, puckering, uneven hand, or premature wear — even though the pattern geometry rendered correctly.

**Root causes:**

1. **Warp tension mismatch across differing yarns in the same warp.** If `palette` binds multiple yarns with different `elongation_at_break` into the same warp (common when an AI palette-reduction step merges colors but not their underlying yarn assignments), differential stretch during weaving causes some ends to ride slack, producing pattern misregistration and fabric bowing. Fix: enforce a rule that all ends within one warp share a compatible elongation band, or apply individually tensioned let-off if the loom supports it.
2. **Float length exceeded the abrasion/stability threshold** for the actual yarn used (not just the nominal structure repeat). This produces loose, poorly anchored floats that shift under handling, distorting the visible pattern even though the file was compiled "correctly." Fix: re-check Section 4.1 rule 3/4.2 with the *actual* mill-tested tenacity and abrasion data for the yarn lot in use — default ranges in Section 4.1 are a starting point, not a substitute for lot-specific testing.
3. **Sett too open or too closed for the structure.** An overly open sett (low EPI for the yarn's WPI) produces a loose, unstable fabric that shifts and distorts; an overly closed sett produces excessive take-up, warp breakage, and reed marks. Fix: recompute sett from the WPI-derived factor table (plain 50%, twill 42%, basket 45%, lace 33% of WPI) rather than accepting an arbitrary AI-implied density ([Weaving loom sett calculator](https://usecalcpro.com/crafts/weaving-loom-sett-calculator)).
4. **Shed geometry mismatched to warp elongation.** Open and center-closed sheds impose more cyclic strain per pick than bottom-closed sheds; low-elongation fibers (linen, high-twist cotton) run under these geometries will show progressive warp fatigue, visible as increasing thread breakage and pattern skew over the length of a run. Fix: re-validate Section 4.1 rule 2, consider switching to bottom-closed or semi-open shedding for low-elongation warps.

### 6.4 Failure Mode: Weave-Interlock Errors (translation-layer errors)

**Definition**: the machine-executable file itself encodes an invalid or unintended interlacement — e.g., a warp end that never interlaces within a repeat (a true structural float outside the intended structure), duplicated/missing picks, or a threading-tieup-treadling mismatch that produces a different structure than the one specified in `structure_map`.

**Root causes:**

1. **Threading/tie-up/treadling inconsistency.** WIF and dobby peg-plans are three linked but independently-editable data blocks; if Stage 5 emission writes a treadling sequence referencing a treadle number not defined in `[TIEUP]`, or a threading referencing a shaft beyond `Shafts=`, the loom will either fault or silently weave a garbage structure. Fix: add a Stage 5 post-emission linter that validates every treadling/threading reference resolves to a defined tie-up/shaft before the file is released — do not rely on the loom controller to catch this.
2. **Repeat-boundary float creation.** Even if the base structure unit is valid, tiling repeats end-to-end can create a float that spans the boundary between two repeats (e.g., a satin float that lands adjacent to another satin float from the next repeat, doubling the effective float length). Fix: Stage 6's interlock check must run across at least two full tiled repeats, not just the base unit, specifically to catch this class of error.
3. **Structure substitution silently changed visual intent without flagging severity correctly.** If Stage 2's `degrade_structure` ladder fired (e.g., `satin_8` silently became `plain`) but was logged as `advisory` rather than surfaced to the operator, the woven fabric will show a structural/textural error that looks like a translation bug but is actually a suppressed, working-as-intended fallback. Fix: any structure substitution that changes the *visual family* of the structure (satin family → twill family → plain) should be `blocking` by default, not `advisory`, unless `compiler_hints.prefer_structure_substitution` was explicitly set true with full logging surfaced to the reviewer.
4. **Rising-shed vs. sinking-shed convention mismatch.** WIF's `Rising Shed=yes/no` flag and the black/white riser convention on Jacquard bitmaps are easy to invert between systems — the same file interpreted with the wrong convention produces the exact photographic negative of the intended structure (every riser becomes a sinker). Fix: Stage 6 simulation must explicitly state which convention it assumed, and this must be visually confirmed against a known reference weave (e.g., a plain-weave calibration strip) before a new loom/controller pairing is trusted.

### 6.5 Escalation Path

```
Stage 6 simulation flags a violation
        │
        ▼
Blocking?  ──Yes──> Return to Stage 2/3 with diagnostic; do not emit file
        │No
        ▼
Advisory logged, file emitted ──> Weave short test swatch (2-3 repeats)
        │
        ▼
Swatch inspection: measure PPI/EPI, float length, selvedge integrity
        │
        ├─ Pass ──> Commit to full production run, re-check GSM/hand at intervals
        │
        └─ Fail ──> Classify against Sec 6.2/6.3/6.4 table ──> Patch PIO or constraint DB ──> Re-run from Stage 1
```

No PIO should proceed to full-length production weaving without a physical test-swatch pass — Stage 6 simulation catches file-level and geometric errors, but yarn-lot-specific tensile and abrasion behavior can only be confirmed physically.

---

## 7. Summary Checklist

Before releasing any AI-generated pattern to an industrial loom:

- [ ] PIO validated against schema (Sec 3.2) with no missing required fields.
- [ ] All `structure_map` regions passed Stage 1 constraint checks or were explicitly, non-silently degraded (Sec 5.3, 6.4.3).
- [ ] Aspect ratio (`PPI/EPI`) computed and applied with nearest-neighbor resampling (Sec 5.4, 6.2).
- [ ] Take-up and shrinkage allowances applied to warp length and pick count (Sec 4.2, 6.2).
- [ ] Shaft count or module-width constraints validated against `loom_target` (Sec 4.3).
- [ ] Selvedge override applied regardless of AI pattern intent (Sec 5.7).
- [ ] Full tiled-repeat interlock check run (not just base unit) (Sec 5.7, 6.4.2).
- [ ] Rising/sinking shed convention explicitly confirmed against a calibration weave (Sec 6.4.4).
- [ ] Physical test swatch woven and measured before full production commitment (Sec 6.5).

---

### Sources

- [WIF 1.0/1.1 Specification](http://www.tantradharma.com/maplehill/wif/wifspec.txt)
- [Interweave — WIF FAQs](https://www.interweave.com/wp-content/uploads/WIF_FAQs.pdf)
- [WeavePoint 8 Manual — WIF implementation](http://www.avlusa.com/downloads/WeavePoint%208%20Manual.pdf)
- [PyWeaving Documentation](https://pyweaving.readthedocs.io/_/downloads/en/latest/pdf/)
- [Digital Weaving Norway — TC2 Loom](https://digitalweaving.no/en/tc2-loom/)
- [Digital Weaving Norway — TC2 Technical PDF](https://www.digitalweaving.no/wp-content/uploads/2021/01/TC2-Loom.pdf)
- [Tien Chiu — TC2 vs. Shaft Loom Comparison](https://tienchiu.com/how-tos/weaving/a-comparison-of-jacquard-looms/how-a-tc-2-jacquard-loom-differs-from-a-shaft-loom/)
- [AdaCAD — Generate Files and Weave on a TC2](https://docs.adacad.org/docs/learn/tutorials/weave_tc2/)
- [Handweaving.net — Image Into Weave (Ch. 4)](http://media.handweaving.net/DigitalArchive/books/wp_Chapter_04.pdf)
- [Woven Dream — Dobby Peg-Plan Conversion](https://wovendream.wordpress.com/2011/07/11/the-new-old-dobby-loom/)
- [Wikipedia — Dobby Loom (shed-count reference)](https://en.wikipedia.org/wiki/Dobby_loom)
- [TextileSphere — Dobby Shedding Mechanism Classification](https://www.textilesphere.com/2020/12/dobby-shedding-mechanism-weaving.html)
- [Weaving Loom Sett Calculator](https://usecalcpro.com/crafts/weaving-loom-sett-calculator)
- [Gist Yarn — WPI, EPI, PPI & Sett Guide](https://www.gistyarn.com/blogs/how-to-weave/what-is-wpi-how-do-i-use-it-to-calculate-sett-or-epi-for-weaving)
- [George Weil — Determining Correct Sett and PPI](https://www.georgeweil.com/blog/how-to-determine-the-correct-sett-epi-and-ppi-for-weaving-yarns/)
- [George Weil — How to Measure Warp](https://www.georgeweil.com/blog/how-to-measure-warp-for-weaving/)
- [Textile Fiber Property Reference Table](https://www.scribd.com/document/956827950/Table-of-Properties-of-Textile-Fibers)

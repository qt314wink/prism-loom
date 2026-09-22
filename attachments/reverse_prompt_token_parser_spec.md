# Reverse Prompt → Token Parser Specification
## v1.0.0 | Seed-Loom Visual Grammar Engine Integration

### Purpose
Feed Reverse Prompt Engineer outputs into the Visual Grammar Engine automatically, closing the image → text → token → system loop.

### Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Input Image    │────▶│ Reverse Prompt       │────▶│  Raw Prompt     │
│  (URL / File)   │     │ Engineer (LLM)       │     │  Text           │
└─────────────────┘     └──────────────────────┘     └────────┬────────┘
                                                                │
                                                                ▼
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  design_plan    │◀────│ Token Parser         │◀────│  Prompt Text    │
│  .json          │     │ (This Spec)            │     │                 │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Visual Grammar  │
│ Engine          │
└─────────────────┘
```

### Stage 1: Prompt Text Segmentation

The raw prompt text from Reverse Prompt Engineer is segmented into semantic chunks:

| Chunk Type | Regex Pattern | Example |
|---|---|---|
| Subject | `^(.*?)(?:,|\.\s)` | "macro photography of copper patina" |
| Material | `(matte|glazed|oxidized|embroidered|polished|etched|woven)` | "oxidized copper" |
| Light | `(subsurface scattering|iridescent|chromatic aberration|specular)` | "subsurface scattering" |
| Technique | `(fbm noise|domain warping|voronoi|sdf|reaction diffusion)` | "fbm noise ribbons" |
| Negative | `negative[s]?:\s*(.+)` | "clean metal, studio lighting" |
| Camera | `(macro|wide angle|35mm|f/\d+\.?\d*)` | "macro photography" |
| Color | `(#[0-9a-fA-F]{6}|copper|denim|sage|cyan|magenta|violet)` | "copper patina" |
| Composition | `(rule of thirds|centered|asymmetric|diagonal)` | "centered" |

### Stage 2: Token Extraction & Normalization

Each chunk is mapped to `image_semantics.json` paths:

```yaml
subject:
  extract: "dominant noun phrase"
  map_to: "semantic_layers.material_grammar.surface"
  normalization: "lemmatize → match enum"

material:
  extract: "adjective + material noun"
  map_to: "semantic_layers.material_grammar.surface"
  fallback: "semantic_layers.material_grammar.tactile_quality"

light_response:
  extract: "light behavior descriptors"
  map_to: "semantic_layers.material_grammar.light_response"

technique:
  extract: "shader or generative technique names"
  map_to: "semantic_layers.shader_technique.primary_technique"

color:
  extract: "named colors or hex values"
  map_to: "token_bindings.color_primitives"
  resolution: |
    If named color matches Omni-Loom token (--copper, --denim, etc.),
    bind directly. If hex, compute nearest OKLCH neighbor in token set.

negative:
  extract: "exclusion descriptors"
  map_to: "prompt_grammar.negative_prompt"
  inversion_rule: |
    "clean metal" → surface: oxidized (confirmed)
    "studio lighting" → light_response: remove "specular" if present
```

### Stage 3: Corruption State Inference

From prompt sentiment and negative constraints, infer ChromaFlora narrative state:

| Prompt Signal | Inferred State | Confidence |
|---|---|---|
"fracture", "broken", "corrupted", "glitch" | `corruption_level: 0.6-1.0` | 0.85 |
"pristine", "clean", "perfect", "verified" | `corruption_level: 0.0-0.2` | 0.80 |
"blooming", "growing", "organic decay" | `entropy_signature: ["bloom", "growth"]` | 0.75 |
"silent", "void", "empty" | `narrative_phase: "silence"` | 0.60 |
"regeneration", "healing", "restoration" | `narrative_phase: "regeneration"` | 0.70 |

### Stage 4: Morphism Classification

Map visual descriptors to Morphica Family class:

| Descriptor Set | morphism_class | Visual Mode |
|---|---|---|
"glass", "blur", "translucent", "frosted", "backdrop-filter" | `glassmorphism` | `aurora` or `holographic` |
"wood grain", "oak", "warm", "organic", "material honesty" | `woodmorphism` | `editorial` |
"paper", "linen", "stack", "layer", "annotatable" | `papermorphism` | `editorial` |
"silicon", "precision", "industrial", "machine", "circuit" | `siliconmorphism` | `brutalist` |
"clay", "soft", "round", "squishy", "3D", "haptic" | `claymorphism` | `aurora` |
"crystal", "gem", "jewel", "prismatic", "chromatic depth" | `jewelmorphism` | `holographic` |
"risograph", "halftone", "grain", "misregistration", "soy ink" | `papermorphism` | `risograph` |

### Stage 5: Token Binding Resolution

Resolve cross-references between image_semantics and design_plan:

```python
def resolve_token_bindings(image_semantics_obj):
    bindings = {
        "color_primitives": [],
        "motion_curves": [],
        "shadow_tokens": [],
        "typographic_tokens": [],
        "svg_filters": [],
        "component_refs": []
    }

    # Color binding
    for color in image_semantics_obj["semantic_layers"]["material_grammar"].get("light_response", []):
        if color == "iridescent":
            bindings["color_primitives"].extend(["--copper-light", "--cyan", "--magenta", "--violet"])
            bindings["motion_curves"].append("--ease-drift")
        elif color == "subsurface-scatter":
            bindings["color_primitives"].extend(["--sage", "--dust", "--linen"])

    # Material → SVG filter binding
    surface = image_semantics_obj["semantic_layers"]["material_grammar"].get("surface")
    surface_to_filter = {
        "oxidized": "feTurbulence-leather-grain",
        "embroidered": "feSpecularLighting-emboss-stitch",
        "woven": "feTurbulence-denim-texture",
        "glazed": "ambient-glass-filter"
    }
    if surface in surface_to_filter:
        bindings["svg_filters"].append(surface_to_filter[surface])

    # Corruption → Component binding
    corruption = image_semantics_obj["semantic_layers"]["narrative_state"].get("corruption_level", 0)
    if corruption > 0.5:
        bindings["component_refs"].append("socratic-recursion/CorruptionState")
        bindings["motion_curves"].append("--ease-fracture")

    # Shader → Fallback binding
    technique = image_semantics_obj["semantic_layers"]["shader_technique"].get("primary_technique")
    if technique == "domain_warping":
        bindings["component_refs"].append("shader-gallery/AuroraDomainWarp")
        bindings["svg_filters"].append("domain-warp-displacement")

    return bindings
```

### Stage 6: Validation Receipt Generation

For each parsed image, auto-generate validation receipts by running the 30-question heuristic:

```yaml
heuristic_map:
  question_1:  # Primary medium of truth
    trigger: "presence of both photo-realistic and shader-derived descriptors"
    receipt:
      question_id: 1
      socratic_layer: "epistemic"
      answer_digest: "Image claims photo-realism but uses fbm noise — medium is synthetic"
      token_impact: ["provenance.generation_method", "semantic_layers.shader_technique"]

  question_9:  # Constraint whose removal breaks identity
    trigger: "negative prompt contains core aesthetic descriptors"
    receipt:
      question_id: 9
      socratic_layer: "axiological"
      answer_digest: "Removal of 'oxidized' would collapse the copper identity"
      token_impact: ["semantic_layers.material_grammar.surface"]

  question_13:  # What does ease-weave feel like
    trigger: "motion or fabric descriptors in prompt"
    receipt:
      question_id: 13
      socratic_layer: "phenomenological"
      answer_digest: "Tension in warp threads maps to spring-damping 0.72"
      token_impact: ["token_bindings.motion_curves", "semantic_layers.material_grammar.fabrication_context"]
```

### Stage 7: Output Contract

The parser MUST output:

1. A valid `image_semantics.json` object
2. A `design_plan.json` intent_ast with token bindings resolved
3. An array of auto-generated `validation_receipts`
4. A `next_action` string: one of ["visual_grammar_engine", "mythic_essay_engine", "art_to_product_engine", "spec_to_build_engine"]
5. A `confidence_score` (0.0–1.0) for the entire parse

### Failure Modes

| Failure | Detection | Resolution |
|---|---|---|
Token collision | Two mapped tokens have incompatible semantic roles | Flag for manual review, emit `collision_report` |
Unknown descriptor | Prompt contains unmapped material/technique | Emit `unknowns` array, queue for schema expansion |
Low confidence | Parse confidence < 0.6 | Require human-in-the-loop validation before engine handoff |
Corruption ambiguity | Corruption descriptors mixed with growth descriptors | Emit `contradiction_flag: true` per Doctrine #2 |

### Integration with Seed-Loom

```
Reverse Prompt Engineer output
        │
        ▼
┌─────────────────────────────┐
│ Reverse Prompt → Token      │
│ Parser (this spec)          │
└─────────────────────────────┘
        │
        ├──▶ image_semantics.json ──▶ Visual Grammar Engine
        │
        ├──▶ design_plan.json intent_ast ──▶ Spec-to-Build Engine
        │
        ├──▶ validation_receipts ──▶ Socratic recursion archive
        │
        └──▶ next_action ──▶ Seed-Loom engine selector
```

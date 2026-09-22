# Codex Bounded Build Orders — Projection Leap Proof v0.1

**Order ID:** `codex:shader-gallery:projection-leap-proof:v0.1`
**Execution status:** AUTHORIZED THROUGH GATE PL-PROOF-2 ONLY
**Target repository:** `MelodicBloom/shader-gallery`
**Canonical base:** `main@22162307b9f8ee840515169c2dcf710f083aaa74`
**Research authority branch:** `research/projection-science` — READ ONLY
**Preferred implementation branch:** `feature/projection-leap-proof-v0`
**Primary package scope:** `packages/shader-library-v1/source/`
**Primary proof fixture:** `materials/thin-film` unless preflight proves it unsuitable
**Primary objective:** prove Projection Leap as a state invariant, not build a product.

## Mission

Implement the narrowest executable proof of the Projection Leap invariant:

> Projection is allowed to change the representation and observer experience, but it must not silently change canonical semantic identity, semantic addressability, lineage, or any undeclared world/material state.

This is not authorization to create a spatial editor, 3D gallery, shader engine rewrite, multi-shader system, product UI, generalized scene graph, or speculative architecture.

The first deliverable is evidence. The visual is an apparatus used to produce that evidence.

## Authority stack

Codex must treat these sources in this order:

1. This build order — execution scope, boundaries, gates, stop conditions.
2. Projection Leap Genesis Record v0.1 — conceptual and evidentiary authority.
3. `projection_leap_provenance_manifest_v0.1.json` — provenance/hash authority.
4. Repository state at `main@22162307b9f8ee840515169c2dcf710f083aaa74`.
5. `research/projection-science:RESEARCH_BRIEF.md` — research boundary and projected-geometry context.
6. `research/projection-science:research-skills/investigating-projected-geometry/SKILL.md` — causal/projection investigation protocol.
7. Existing package tests, schemas, metadata, renderer contracts, and CI.

If two lower authorities conflict, preserve the higher authority and record the conflict. Do not silently reconcile contradictions.

## BO-00 — Repository preflight

Before writing files, run and retain the output of:

```bash
git rev-parse --show-toplevel
git remote -v
git status --short
git branch --show-current
git rev-parse HEAD
git fetch origin --prune
git rev-parse origin/main
git log -1 --oneline origin/main
git branch -a --list '*projection*'
git worktree list
```

Required conditions:

- `origin` must resolve to `MelodicBloom/shader-gallery`.
- `origin/main` must equal `22162307b9f8ee840515169c2dcf710f083aaa74`.
- The existing primary checkout must not be dirtied to create this proof.
- Do not implement on `main`.
- Do not implement on `research/projection-science`.

If `origin/main` has moved, STOP. Do not automatically rebase. Return the expected SHA, observed SHA, intervening commits, overlapping paths, and a recommendation.

Preferred isolated worktree:

```bash
git worktree add ../shader-gallery-projection-leap \
  -b feature/projection-leap-proof-v0 \
  22162307b9f8ee840515169c2dcf710f083aaa74
```

If that branch already exists, do not force-reset it. Inspect and report its SHA/diff first.

## Read-only research reconciliation

Before implementation, inspect:

- `research/projection-science:RESEARCH_BRIEF.md`
- `research/projection-science:research-skills/investigating-projected-geometry/SKILL.md`

Record:

- what Projection Leap inherits from Projected Linearity research;
- what it does not claim;
- which variables belong to intrinsic domain, embedding, projection, receiver, observer;
- which claims are EXACT_MATH / DERIVED_MATH / PHYSICAL_MODEL / EMPIRICAL / PROJECT_INTERPRETATION / HYPOTHESIS;
- why the selected apparatus is the least costly apparatus capable of testing PL-01 through PL-04.

Do not merge or modify the research branch.

## Allowed write surface

Until Gate PL-PROOF-1 passes, Codex may write only inside:

```text
packages/shader-library-v1/source/experiments/projection-leap-v0/**
packages/shader-library-v1/source/docs/projection-leap/**
packages/shader-library-v1/source/tools/projection-leap-*.mjs
```

Codex may make one bounded edit to:

```text
packages/shader-library-v1/source/package.json
```

only to add package-local Projection Leap scripts. Do not add dependencies. Do not change default `npm test` during BO-01.

After Gate PL-PROOF-1, Codex may additionally create:

```text
packages/shader-library-v1/source/tests/projection-leap-v0/**
```

No other paths become writable merely because a gate passes.

## Hard forbidden surface

Do not modify, delete, move, rename, regenerate, or overwrite:

```text
library-v1/**
abalone/**
aurora/**
docs/**
README.md
.github/**
packages/shader-library-v1/source/src/core/ShaderPlayer.js
packages/shader-library-v1/source/manifest.json
packages/shader-library-v1/source/shaders/**
packages/shader-library-v1/source/schemas/**
```

Also forbidden:

- no new repository;
- no new npm package;
- no package-manager migration;
- no Three.js merely to obtain camera/sphere/mesh;
- no React/R3F/Next.js;
- no WebGPU prerequisite;
- no multiple WebGL contexts;
- no iframe-per-mode trick;
- no duplicate 2D and 3D preset records;
- no mutation of shader GLSL to make the proof easier;
- no replacement of `ShaderPlayer`;
- no generalized scene engine;
- no ECS;
- no physics engine;
- no multi-shader compositing;
- no lifecycle branch/merge UI;
- no local luminescent/gravity/prismatic nodes yet;
- no generated screenshots committed as primary proof;
- no main-branch push;
- no merge;
- no release/tag;
- no deployment change.

## Primary proof fixture

Use the existing canonical shader `materials/thin-film`.

Reason: it is stable, WebGL2/GLSL 300 es, texture-free, has a small canonical material parameter surface, medium mobile tier, deterministic preview defaults, and reduced-motion freeze behavior.

Canonical identity is the existing manifest slug `materials/thin-film`.

Do not invent `thin-film-3d`. Do not clone or change the shader.

If Thin Film fails baseline validation for a pre-existing reason, do not patch it. Record the failure, compare existing stable texture-free candidates, select exactly one replacement, and document the decision.

## State-domain contract

Represent state as separately addressable domains:

### C — Canonical material state

At minimum:

- shader manifest slug;
- shader family/name reference;
- canonical adjustable material uniform values;
- source/meta receipt or digest.

For Thin Film, canonical adjustable state includes at least `thickness` and `contrast`.

Runtime viewport/time/pointer values are not silently promoted into canonical material identity.

### W — World / intrinsic semantic state

Keep minimal. Represent one semantic anchor in intrinsic domain coordinates.

Recommended ID:

`node:projection-proof:origin`

The anchor must be independent of screen pixels and observer coordinates and remain addressable in both representation modes.

### R — Representation state

May include mode, projection mix, embedding/depth amplitude, optional reference-grid opacity, and representation-adapter parameters.

R may change during Projection Leap. R must not overwrite C or W.

### O — Observer state

May include projection type, position, orientation, distance, FOV/orthographic scale.

O may change. O must not overwrite C or W.

### V — Observer-local view state

Keep empty/disabled in this tranche.

### L — Local modifiers

Keep empty in this tranche.

### G — Governance state

Must capture operation order, declared scope, before/after normalized digests, allowed domains, replay inputs, and evidence receipt identity.

## Canonical serialization and hashing

Implement one deterministic canonical serializer:

- recursively stable key ordering;
- deterministic semantic array order;
- finite numbers only;
- normalize `-0` to `0`;
- reject `NaN`, `Infinity`, functions, DOM/WebGL objects unless explicitly normalized;
- no wall-clock time inside normalized governed-state digest;
- no random UUID inside deterministic state;
- no device-dependent values inside C/W digest.

Generate:

- `cwDigest = SHA-256(normalized(C + W))`
- `viewDigest = SHA-256(normalized(R + O + V))`
- `stateDigest = SHA-256(normalized(C + W + R + O + V + L))`

Governance history may have a separate receipt digest.

Screenshots are supplementary only.

## Minimum representation apparatus

Do not build a scene engine.

Use one deterministic intrinsic 2D domain and two render embeddings:

```text
intrinsic domain D(u,v)
        ↓
representation embedding E_m(u,v)
        ↓
observer transform O
        ↓
raster
```

Mode A — Projected:

`E0(u,v) = (u,v,0)`

Use a top-down/orthographic or equivalent projected reading.

Mode B — Spatial:

Use the same intrinsic sample domain and same canonical shader/material identity but map it into deterministic depth:

`E1(u,v) = (u,v,A*f(u,v))`

Choose the simplest deterministic reversible embedding that produces unambiguous depth while retaining the intrinsic coordinate domain. Permitted examples: shallow sinusoidal sheet, radial height field, shallow analytic curvature.

No stochastic displacement. Do not claim a physical projection model unless it is actually modeled.

Transition variable `m ∈ [0,1]` may interpolate embedding depth, projection/camera parameters, and reference-grid opacity.

## Renderer contract

Create an experiment-local renderer/adapter, conceptually `ProjectionLeapRenderer`.

It is not a replacement for `ShaderPlayer`.

It may reuse existing shader source, metadata, uniform defaults, WebGL2 conventions, and helpers where possible.

Use exactly one WebGL2 context.

Do not hide a second context behind the other mode.

Preserve the canonical shader slug through both modes.

If the fragment shader needs `v_uv`, the experiment-specific vertex path must preserve that semantic input.

## BO-01 — Contract-first proof

Deliver:

1. Projection Leap state model.
2. Deterministic canonical serializer.
3. SHA-256 digest helper.
4. Operation/receipt model.
5. One intrinsic semantic anchor.
6. Representation-adapter interface.
7. Projected representation.
8. Spatial representation.
9. Inverse/round-trip operation.
10. Minimal browser harness/apparatus.
11. Tests for PL-01 through PL-04.
12. Evidence README.

Required operation vocabulary:

- `SET_REPRESENTATION_MODE`
- `SET_PROJECTION_MIX`
- `SET_OBSERVER`
- `RESET_VIEW`
- `ROUND_TRIP`

Every operation declares allowed state domains. Undeclared-domain mutation must fail loudly.

## PL-01 — Canonical identity

PASS requires:

- shader slug unchanged;
- canonical material values unchanged;
- source/meta receipt unchanged;
- `cwDigest` byte-identical before/after projection.

## PL-02 — Semantic persistence

PASS requires:

- same semantic node ID;
- same intrinsic coordinate;
- same canonical node payload;
- only rendered/screen position may differ.

## PL-03 — Observer isolation

Apply an observer-only operation.

PASS requires:

- `cwDigest` unchanged;
- `viewDigest` changes;
- receipt scope says `O`;
- no hidden C/W mutation.

## PL-04 — Round trip

Perform deterministic A → B → A.

PASS requires:

- `cwDigest` unchanged throughout;
- terminal R/O equals baseline R/O;
- terminal `stateDigest` equals baseline `stateDigest`;
- receipts replay deterministically.

## Gate PL-PROOF-1

Proceed only if:

- baseline `npm test` passed before changes;
- PL-01 through PL-04 all PASS;
- no forbidden path changed;
- no GLSL/manifest/ShaderPlayer changes;
- exactly one WebGL context used;
- no wall-clock/random entropy in deterministic fixture;
- diff remains inside allowed paths.

If any fail: STOP and return failure evidence.

## BO-02 — Replay and deterministic receipts

Conditional authorization: only after PL-PROOF-1 is fully green.

Close:

- PL-05 Scope integrity
- PL-06 Replay
- PL-09 Session independence
- PL-10 Determinism

Do not implement PL-07 or PL-08.

### PL-05 Scope integrity

Define allowed domains per operation; diff normalized domains before/after; fail any undeclared mutation.

PASS = 100% scope agreement.

### PL-06 Replay

Persist an operation sequence as portable JSON. Reinitialize from clean initial state and replay.

PASS = terminal governed digest equal to original run.

### PL-09 Session independence

Destroy runtime/harness state; reinitialize from serialized fixture + receipts only.

PASS = anchor, canonical material, and terminal governed state recovered without hidden browser-session authority.

Do not use localStorage as invisible authority.

### PL-10 Determinism

Run the proof twice from genuinely independent clean state.

PASS = byte-identical normalized governed-state digest and receipt-sequence digest.

Screenshot pixels remain supplementary.

## Gate PL-PROOF-2

Required before handback:

```text
PL-01 PASS
PL-02 PASS
PL-03 PASS
PL-04 PASS
PL-05 PASS
PL-06 PASS
PL-09 PASS
PL-10 PASS
existing npm test PASS
working tree expected-only
forbidden paths unchanged
```

Then STOP.

## PL-07 / PL-08 are NOT AUTHORIZED

Do not opportunistically implement lineage/branch-merge or local-modifier isolation. They materially enlarge the state/governance surface and require a separate order.

## Testing budget

Use existing package toolchain first.

Do not add Playwright, Vitest, Jest, Three.js, React, or another framework merely for convenience.

Preferred order:

1. Node built-in assertions for state/serialization logic.
2. Existing native/browser harness utilities.
3. Existing WebGL2 validation tooling.
4. Tiny experiment-local browser harness if necessary.
5. New dependency only after STOP + recommendation.

## Performance boundaries

- one WebGL2 context;
- no per-frame object graph reconstruction;
- no uncontrolled buffer allocation per frame;
- no duplicate shader compilation between A/B if avoidable;
- DPR/resize state must not enter C/W digest;
- mobile degradation preserves semantic proof.

Suggested ceilings:

- desktop mesh <= 64×64 subdivisions;
- mobile mesh <= 32×32 subdivisions.

Use less if sufficient.

## Evidence artifacts

Generate:

```text
packages/shader-library-v1/source/docs/projection-leap/
  README.md
  RESEARCH_RECONCILIATION.md
  STATE_CONTRACT.md
  TEST_PROTOCOL.md
  results/
    run-1.json
    run-2.json
    replay.json
    digest-comparison.json
    path-audit.txt
    test-output.txt
  receipts/
    projection-leap-fixture.json
    operation-sequence.json
    provenance-receipt.json
```

If captures exist, they are supplementary and must record exact generator command/state receipt.

## Path audit

Before handback:

```bash
git diff --name-only 22162307b9f8ee840515169c2dcf710f083aaa74...HEAD
git status --short
```

Programmatically compare changed paths against the allowlist.

Any forbidden-path change fails PL-PROOF-2.

## Commit contract

Local commits may be made on `feature/projection-leap-proof-v0`.

Recommended sequence:

1. `test(projection-leap): define state invariants and failing proof gates`
2. `feat(projection-leap): add bounded WebGL2 representation adapter`
3. `test(projection-leap): close PL-01 through PL-04`
4. `feat(projection-leap): add replay and deterministic receipts`
5. `docs(projection-leap): record evidence and handoff`

Do not merge. Do not update main. Do not create a PR unless explicitly asked. Push the feature branch only after tests and path audit pass.

## Required Codex handback

Return these sections:

### A. Environment receipt

Repository root, origin URL, base SHA, branch, worktree path, Node version, relevant GL/runtime info.

### B. Authority reconciliation

Genesis Record read, research branch read, conflicts or none, selected fixture and why.

### C. Implementation ledger

For every changed file: path, purpose, PL gate supported, why path is authorized.

### D. Test matrix

| Gate | Result | Evidence path | Digest/metric |
|---|---|---|---|

Include PL-01, PL-02, PL-03, PL-04, PL-05, PL-06, PL-09, PL-10.

### E. Boundary audit

State explicitly:

- `ShaderPlayer.js` changed? YES/NO
- manifest changed? YES/NO
- shader GLSL changed? YES/NO
- root gallery changed? YES/NO
- `.github` changed? YES/NO
- dependencies added? YES/NO
- WebGL contexts used: N
- forbidden path violations: N

Any prohibited YES = FAIL.

### F. Git receipts

Starting SHA, ending SHA, commit list, diff stat, changed path list, dirty status.

### G. Decision

Exactly one:

- `READY_FOR_HUMAN_REVIEW`
- `BLOCKED_BY_INVARIANT_FAILURE`
- `BLOCKED_BY_BASE_DRIFT`
- `BLOCKED_BY_ENVIRONMENT`
- `BLOCKED_BY_SCOPE_COLLISION`

No self-promotion beyond human review.

## Stop conditions

Stop instead of improvising if:

- `origin/main` differs from pinned base;
- unrelated dirty worktree changes exist;
- overlapping existing implementation is discovered;
- baseline `npm test` fails;
- proof seems to require changing canonical shader GLSL;
- second WebGL context appears necessary;
- new runtime dependency appears necessary;
- state domains cannot be separated;
- operation mutates an undeclared domain;
- round trip is only visually reversible;
- replay is nondeterministic;
- two clean runs disagree;
- forbidden path would need modification.

A stop is a valid result. Do not widen scope to make the build appear successful.

## Definition of done

This tranche is done only when:

1. one existing shader has an isolated Projection Leap proof;
2. canonical shader slug is identical in A/B;
3. one semantic anchor survives by intrinsic identity;
4. observer-only changes leave C/W unchanged;
5. A→B→A restores identical governed state;
6. operation scopes are enforced;
7. serialized sequence replays from clean state;
8. state restores without hidden session memory;
9. two clean runs yield identical normalized governed-state digest;
10. existing package tests pass;
11. forbidden files remain untouched;
12. evidence receipts are inspectable;
13. Codex stops at `READY_FOR_HUMAN_REVIEW`.

The boundaries are the experiment.

# Research Notes: Mandala-to-Machine Tool

## Kerf Compensation Research

- Multiple sources emphasize that kerf depends on material, thickness, laser power, speed, optics, and assist gas; it is not a static constant.[web:103][web:104][web:105][web:109][web:112][web:115]
- Common measurement patterns:
  - **Single-square test**: cut a 1" or 50mm square; kerf = (designed size - measured size) / 2.[web:102][web:105][web:109]
  - **Multi-rectangle test**: cut N rectangles within a bar, compress them, measure gap, divide gap by N to get full kerf, then divide by 2 for design offset.[web:105]
  - **Jig/Vernier method**: use a jig where difference between reference length A and length of block set B gives sum of kerfs, then divide by number of cuts; used in community guides and LightBurn’s Vernier-style test.[web:106][web:112]
- Decision: model kerf as **per-material, per-thickness, per-profile** (including speed/power) and store as a table with calibration history.

## SVG-to-GCode Libraries and Approaches

- Several browser- or JS-oriented converters exist:
  - `svg2gcode` (GitHub/toxnico) operates on SVG paths only, flattening them to GCode with configurable segment length.[web:113]
  - `svg-to-gcode` (npm) is positioned as SVG → GCode for plotters, built to work in JS environments.[web:116]
  - Online tools like Pixel2Lines demonstrate turning SVG paths into machine-profiled G-code with a static toolpath preview.[web:89]
- Community recommendations for plotter/CNC workflows include GRBL-Plotter, Inkscape’s G-code extensions, and command-line converters like `juicy-gcode`.[web:110][web:107]
- Decision: use an internal SVG path parser plus a thin abstraction layer so that `svg2gcode`-style logic is conceptually mirrored, but with a pluggable back-end for different controllers.

## SVG Path Optimization for Speed

- Path optimization tools show that minimizing node count and merging paths can improve both file size and machine efficiency.[web:108][web:114]
- Best practices for laser-oriented SVG prep include: hairline strokes for cuts, separate colors or layers for different operations, and closing all paths to avoid incomplete cuts.[web:95][web:111]
- Decision: include a geometry optimization phase that:
  - Flattens curves to polylines with configurable error tolerance.
  - Optionally converts suitable polylines to G2/G3 arcs on machines that support them.[web:110][web:113]
  - Reorders paths to reduce rapid moves.

## Epistemic Decisions and Open Questions

- **Kerf modeling**: chose per-material+thickness+settings with live calibration instead of a static lookup, because all sources agree kerf varies significantly with process variables.[web:103][web:104][web:105][web:109][web:112][web:115]
- **Library choice**: plan to treat svg-to-gcode libraries as references but not hard dependencies, to retain control over mandala-specific behavior (layer-aware offsets, radial ordering).
- **Preview fidelity**: 1:1 overlay preview using the same coordinate mapping as G-code generator is critical, as misalignment here could mislead users even if file exports are technically valid.[web:89][web:95]
- Open questions:
  - How to best visualize kerf-offset changes on intricate mandala edges without overwhelming users?
  - What UI is clearest for mapping SVG groups/layers to machine layers and materials?
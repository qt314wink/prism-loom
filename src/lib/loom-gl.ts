const VERT = `#version 300 es
precision highp float;
const vec2 POS[4] = vec2[](vec2(-1.0,-1.0), vec2(1.0,-1.0), vec2(-1.0,1.0), vec2(1.0,1.0));
out vec2 vUv;
void main() {
  vec2 p = POS[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uFolds;
uniform float uSpin;
uniform float uZoom;
uniform float uMix;
uniform float uBlend;
uniform float uIsolate;
uniform float uChroma;
uniform float uVignette;
uniform float uFlare;
uniform float uHasB;
in vec2 vUv;
out vec4 frag;

vec3 hueShift(vec3 c, float a) {
  float u = cos(a);
  float w = sin(a);
  mat3 m = mat3(
    0.299 + 0.701*u + 0.168*w, 0.587 - 0.587*u + 0.330*w, 0.114 - 0.114*u - 0.497*w,
    0.299 - 0.299*u - 0.328*w, 0.587 + 0.413*u + 0.035*w, 0.114 - 0.114*u + 0.292*w,
    0.299 - 0.300*u + 1.250*w, 0.587 - 0.588*u - 1.050*w, 0.114 + 0.886*u - 0.203*w
  );
  return clamp(m * c, 0.0, 1.0);
}

vec2 kaleido(vec2 p, float folds, float spin, float zoom) {
  float r = length(p);
  float sector = 3.141592653589793 / max(folds, 2.0);
  float a = atan(p.y, p.x) + spin;
  a = abs(mod(a, 2.0 * sector) - sector);
  vec2 uv = vec2(cos(a), sin(a)) * r * zoom * 0.5 + 0.5;
  return clamp(uv, vec2(0.001), vec2(0.999));
}

vec3 sampleAt(sampler2D tex, vec2 uv) {
  return texture(tex, uv).rgb;
}

vec3 fuse(vec3 a, vec3 b, float mixv, float blend, float r) {
  if (blend < 0.5) return mix(a, b, mixv);
  if (blend < 1.5) return clamp(a + b * mixv, 0.0, 1.0);
  if (blend < 2.5) return mix(a, a * b, mixv);
  if (blend < 3.5) return mix(a, abs(a - b), mixv);
  if (blend < 4.5) {
    float w = smoothstep(0.28, 0.78, r) * mixv;
    return mix(a, b, w);
  }
  float luma = dot(a, vec3(0.299, 0.587, 0.114));
  return mix(a, b, clamp(luma * mixv * 1.4, 0.0, 1.0));
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float mask = 1.0 - smoothstep(0.985, 1.0, r);
  if (mask <= 0.0) {
    frag = vec4(0.0);
    return;
  }

  float folds = uFolds;
  float spin = uSpin;
  float zoom = uZoom;
  float chroma = uChroma;
  float flare = uFlare;
  float vigAmt = uVignette;

  if (uIsolate > 0.5 && uIsolate < 1.5) { chroma = 0.0; flare = 0.0; }
  if (uIsolate > 1.5 && uIsolate < 2.5) { folds = 2.0; chroma = 0.0; flare = 0.0; zoom = 1.0; }
  if (uIsolate > 2.5 && uIsolate < 3.5) { folds = 2.0; chroma = 0.0; flare = 0.0; spin = 0.0; }
  if (uIsolate > 3.5 && uIsolate < 4.5) { folds = 2.0; flare = 0.0; spin = 0.0; zoom = 1.0; }
  if (uIsolate > 4.5 && uIsolate < 5.5) { folds = 2.0; chroma = 0.0; flare = 0.0; spin = 0.0; zoom = 1.0; }
  if (uIsolate > 5.5) { folds = 2.0; chroma = 0.0; spin = 0.0; zoom = 1.0; }

  vec2 uv = kaleido(p, folds, spin, zoom);
  vec3 ca = sampleAt(uTexA, uv);
  vec3 c = ca;
  if (uHasB > 0.5) {
    vec3 cb = sampleAt(uTexB, uv);
    c = fuse(ca, cb, clamp(uMix, 0.0, 1.0), uBlend, r);
  }
  if (chroma > 0.0001) c = hueShift(c, chroma * 6.2831853);
  if (flare > 0.0001) c += flare * exp(-r * r * 14.0) * vec3(1.0, 0.86, 0.62);
  float vig = mix(1.0, smoothstep(1.02, 0.42, r), clamp(vigAmt, 0.0, 1.0));
  c *= vig;
  frag = vec4(clamp(c, 0.0, 1.0), mask);
}`;

function mediaSize(el: TexImageSource): [number, number] {
  if (el instanceof HTMLVideoElement) return [el.videoWidth || 0, el.videoHeight || 0];
  if (el instanceof HTMLImageElement) return [el.naturalWidth || 0, el.naturalHeight || 0];
  if (el instanceof HTMLCanvasElement) return [el.width, el.height];
  return [0, 0];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader alloc");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh) ?? "compile failed";
    gl.deleteShader(sh);
    throw new Error(log);
  }
  return sh;
}

function makeTex(gl: WebGL2RenderingContext) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export type LoomParams = {
  folds: number;
  spin: number;
  zoom: number;
  mix: number;
  blend: number;
  isolate: number;
  chroma: number;
  vignette: number;
  flare: number;
};

export class LoomGL {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null;
  private prog: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private texA: WebGLTexture | null = null;
  private texB: WebGLTexture | null = null;
  private locs: Record<string, WebGLUniformLocation | null> = {};
  private mediaA: TexImageSource | null = null;
  private mediaB: TexImageSource | null = null;
  private aw = 0;
  private ah = 0;
  private bw = 0;
  private bh = 0;
  private params: LoomParams = {
    folds: 8,
    spin: 0,
    zoom: 1,
    mix: 0,
    blend: 0,
    isolate: 0,
    chroma: 0,
    vignette: 1,
    flare: 0,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    this.gl = gl;
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!prog) throw new Error("program alloc");
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
    }
    this.prog = prog;
    this.vao = gl.createVertexArray();
    this.texA = makeTex(gl);
    this.texB = makeTex(gl);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    for (const name of [
      "uTexA",
      "uTexB",
      "uFolds",
      "uSpin",
      "uZoom",
      "uMix",
      "uBlend",
      "uIsolate",
      "uChroma",
      "uVignette",
      "uFlare",
      "uHasB",
    ]) {
      this.locs[name] = gl.getUniformLocation(prog, name);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  }

  get ok(): boolean {
    return this.gl !== null && this.prog !== null;
  }

  setSource(media: TexImageSource | null) {
    this.mediaA = media;
  }

  setSourceB(media: TexImageSource | null) {
    this.mediaB = media;
  }

  setParams(p: LoomParams) {
    this.params = p;
  }

  resize() {
    const canvas = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    this.gl?.viewport(0, 0, w, h);
  }

  private upload(unit: number, tex: WebGLTexture | null, media: TexImageSource | null, wh: [number, number]) {
    const gl = this.gl;
    if (!gl || !tex || !media) return [0, 0] as [number, number];
    const [w, h] = mediaSize(media);
    if (w < 2 || h < 2) return wh;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (w !== wh[0] || h !== wh[1]) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media);
      return [w, h] as [number, number];
    }
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, media);
    return wh;
  }

  frame() {
    const gl = this.gl;
    const prog = this.prog;
    if (!gl || !prog) return;
    this.resize();
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.mediaA) return;
    const a = this.upload(0, this.texA, this.mediaA, [this.aw, this.ah]);
    this.aw = a[0];
    this.ah = a[1];
    const hasB = Boolean(this.mediaB);
    if (hasB) {
      const b = this.upload(1, this.texB, this.mediaB, [this.bw, this.bh]);
      this.bw = b[0];
      this.bh = b[1];
    }
    gl.useProgram(prog);
    gl.bindVertexArray(this.vao);
    gl.uniform1i(this.locs.uTexA, 0);
    gl.uniform1i(this.locs.uTexB, 1);
    gl.uniform1f(this.locs.uFolds, this.params.folds);
    gl.uniform1f(this.locs.uSpin, this.params.spin);
    gl.uniform1f(this.locs.uZoom, this.params.zoom);
    gl.uniform1f(this.locs.uMix, this.params.mix);
    gl.uniform1f(this.locs.uBlend, this.params.blend);
    gl.uniform1f(this.locs.uIsolate, this.params.isolate);
    gl.uniform1f(this.locs.uChroma, this.params.chroma);
    gl.uniform1f(this.locs.uVignette, this.params.vignette);
    gl.uniform1f(this.locs.uFlare, this.params.flare);
    gl.uniform1f(this.locs.uHasB, hasB ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {
    const gl = this.gl;
    if (!gl) return;
    if (this.texA) gl.deleteTexture(this.texA);
    if (this.texB) gl.deleteTexture(this.texB);
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.prog) gl.deleteProgram(this.prog);
    this.texA = null;
    this.texB = null;
    this.vao = null;
    this.prog = null;
    this.gl = null;
  }
}

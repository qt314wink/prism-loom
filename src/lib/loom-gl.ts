const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uBlend;
uniform float uRot;
uniform float uZoom;
uniform float uFolds;
uniform float uOffset;
uniform float uHue;
uniform float uPulse;
uniform float uTime;
uniform float uRefold;
uniform float uVignette;
uniform vec2 uRes;
in vec2 vUv;
out vec4 fragColor;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 kaleido(vec2 uv, float folds, float rot, float zoom, float offset, float t) {
  vec2 p = uv - 0.5;
  p.x *= uRes.x / uRes.y;
  float r = length(p);
  float a = atan(p.y, p.x) + rot;
  if (folds >= 2.0) {
    float fold = 3.14159265 / folds;
    a = mod(a + 3.14159265 * 8.0, fold * 2.0);
    if (a > fold) a = fold * 2.0 - a;
  }
  float z = zoom * (1.0 + 0.05 * sin(t * 1.3));
  vec2 q = vec2(cos(a), sin(a)) * (r / max(z, 0.15));
  q += vec2(offset * 0.05 * sin(t * 0.71), offset * 0.05 * cos(t * 0.53));
  q.x /= uRes.x / uRes.y;
  return q + 0.5;
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float folds = uRefold > 0.5 ? max(uFolds, 2.0) : 0.0;
  vec2 pa = kaleido(uv, folds, uRot, uZoom, uOffset, uTime);
  vec2 pb = kaleido(uv, folds, uRot, uZoom, uOffset, uTime);
  vec3 ca = texture(uA, clamp(pa, 0.0, 1.0)).rgb;
  vec3 cb = texture(uB, clamp(pb, 0.0, 1.0)).rgb;
  vec3 col = mix(ca, cb, clamp(uBlend, 0.0, 1.0));
  vec3 hsv = rgb2hsv(col);
  hsv.x = fract(hsv.x + uHue);
  hsv.z *= 1.0 + uPulse * 0.12 * sin(uTime * 2.2);
  col = hsv2rgb(hsv);

  vec2 c = uv - 0.5;
  c.x *= uRes.x / uRes.y;
  float r = length(c);
  float vig = mix(1.0, smoothstep(0.78, 0.28, r), uVignette);
  col *= vig;
  float ring = smoothstep(0.492, 0.478, r) * smoothstep(0.452, 0.468, r);
  col = mix(col, vec3(0.83, 0.69, 0.35), ring * 0.55);
  float mask = smoothstep(0.52, 0.495, r);
  fragColor = vec4(col, mask);
}
`;

export type LoomUniforms = {
  blend: number;
  rot: number;
  zoom: number;
  folds: number;
  offset: number;
  hue: number;
  pulse: number;
  time: number;
  refold: boolean;
  vignette: number;
};

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log || "compile");
  }
  return sh;
}

export class LoomGL {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  texA: WebGLTexture;
  texB: WebGLTexture;
  loc: Record<string, WebGLUniformLocation | null>;
  destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: true,
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!prog) throw new Error("program");
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "link");
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.program = prog;

    const buf = gl.createBuffer();
    const vao = gl.createVertexArray();
    if (!vao || !buf) throw new Error("vao");
    this.vao = vao;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.texA = this.makeTex();
    this.texB = this.makeTex();
    this.loc = {
      uA: gl.getUniformLocation(prog, "uA"),
      uB: gl.getUniformLocation(prog, "uB"),
      uBlend: gl.getUniformLocation(prog, "uBlend"),
      uRot: gl.getUniformLocation(prog, "uRot"),
      uZoom: gl.getUniformLocation(prog, "uZoom"),
      uFolds: gl.getUniformLocation(prog, "uFolds"),
      uOffset: gl.getUniformLocation(prog, "uOffset"),
      uHue: gl.getUniformLocation(prog, "uHue"),
      uPulse: gl.getUniformLocation(prog, "uPulse"),
      uTime: gl.getUniformLocation(prog, "uTime"),
      uRefold: gl.getUniformLocation(prog, "uRefold"),
      uVignette: gl.getUniformLocation(prog, "uVignette"),
      uRes: gl.getUniformLocation(prog, "uRes"),
    };
  }

  private makeTex() {
    const gl = this.gl;
    const t = gl.createTexture();
    if (!t) throw new Error("tex");
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([8, 7, 12, 255]),
    );
    return t;
  }

  upload(slot: 0 | 1, image: TexImageSource) {
    const gl = this.gl;
    const tex = slot === 0 ? this.texA : this.texB;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  resize(w: number, h: number) {
    const gl = this.gl;
    const c = gl.canvas as HTMLCanvasElement;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  draw(u: LoomUniforms) {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texA);
    gl.uniform1i(this.loc.uA, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texB);
    gl.uniform1i(this.loc.uB, 1);
    gl.uniform1f(this.loc.uBlend, u.blend);
    gl.uniform1f(this.loc.uRot, u.rot);
    gl.uniform1f(this.loc.uZoom, u.zoom);
    gl.uniform1f(this.loc.uFolds, u.folds);
    gl.uniform1f(this.loc.uOffset, u.offset);
    gl.uniform1f(this.loc.uHue, u.hue);
    gl.uniform1f(this.loc.uPulse, u.pulse);
    gl.uniform1f(this.loc.uTime, u.time);
    gl.uniform1f(this.loc.uRefold, u.refold ? 1 : 0);
    gl.uniform1f(this.loc.uVignette, u.vignette);
    const c = gl.canvas as HTMLCanvasElement;
    gl.uniform2f(this.loc.uRes, c.width, c.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const gl = this.gl;
    gl.deleteTexture(this.texA);
    gl.deleteTexture(this.texB);
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
  }
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit) return hit;
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image ${src}`));
    img.src = src;
  });
  imageCache.set(src, p);
  return p;
}

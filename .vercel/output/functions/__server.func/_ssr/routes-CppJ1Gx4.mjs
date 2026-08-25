import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut, t as authClient } from "./client-sGid3STf.mjs";
import { a as PLATE_BY_ID, c as morphBetween, i as PLATES, n as KEYFRAME_EDITS, o as REELS, r as MORPHS, s as authMiddleware, t as DEFAULT_SEQUENCE } from "./plates-6nqGe2Cg.mjs";
import { a as RotateCcw, c as Pause, d as GitMerge, f as Copy, h as ChevronLeft, i as Sparkles, l as Layers, m as ChevronRight, n as WandSparkles, o as Plus, p as Clapperboard, s as Play, t as X, u as Hexagon } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CppJ1Gx4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
function neighbor(seq, id) {
	const i = seq.indexOf(id);
	if (i < 0) return seq[0] ?? id;
	return seq[(i + 1) % seq.length] ?? id;
}
var useStudio = create((set, get) => ({
	sequence: [...DEFAULT_SEQUENCE],
	activeId: DEFAULT_SEQUENCE[0],
	nextId: DEFAULT_SEQUENCE[1],
	blend: 0,
	motionId: "spin-breathe",
	mode: "plate",
	playing: true,
	speed: 1,
	folds: 8,
	zoom: 1.05,
	offset: 0,
	hue: 0,
	pulse: .4,
	vignette: .65,
	rotManual: 0,
	desk: "tokens",
	selectedMorphSrc: null,
	setActive: (id) => set((s) => ({
		activeId: id,
		nextId: neighbor(s.sequence, id),
		blend: 0,
		selectedMorphSrc: null
	})),
	setNext: (id) => set({ nextId: id }),
	setBlend: (n) => set({ blend: n }),
	setMotion: (id) => set({ motionId: id }),
	setMode: (m) => set({ mode: m }),
	setPlaying: (p) => set({ playing: p }),
	togglePlaying: () => set((s) => ({ playing: !s.playing })),
	setSpeed: (n) => set({ speed: n }),
	setFolds: (n) => set({ folds: n }),
	setZoom: (n) => set({ zoom: n }),
	setOffset: (n) => set({ offset: n }),
	setHue: (n) => set({ hue: n }),
	setPulse: (n) => set({ pulse: n }),
	setVignette: (n) => set({ vignette: n }),
	setRotManual: (n) => set({ rotManual: n }),
	setDesk: (t) => set({ desk: t }),
	setSelectedMorph: (src) => set({
		selectedMorphSrc: src,
		blend: src ? 0 : get().blend
	}),
	syncShot: (id, nextId, blend) => set({
		activeId: id,
		nextId,
		blend,
		selectedMorphSrc: null
	}),
	addToSequence: (id) => set((s) => ({ sequence: s.sequence.length >= 16 ? s.sequence : [...s.sequence, id] })),
	removeFromSequence: (index) => set((s) => {
		if (s.sequence.length <= 1) return s;
		const sequence = s.sequence.filter((_, i) => i !== index);
		const activeId = sequence.includes(s.activeId) ? s.activeId : sequence[0];
		return {
			sequence,
			activeId,
			nextId: neighbor(sequence, activeId)
		};
	}),
	resetSequence: () => set({
		sequence: [...DEFAULT_SEQUENCE],
		activeId: DEFAULT_SEQUENCE[0],
		nextId: DEFAULT_SEQUENCE[1],
		blend: 0
	}),
	stepPlate: (dir) => set((s) => {
		const i = s.sequence.indexOf(s.activeId);
		const n = s.sequence.length;
		const next = s.sequence[(i + dir + n) % n];
		return {
			activeId: next,
			nextId: neighbor(s.sequence, next),
			blend: 0,
			selectedMorphSrc: null
		};
	})
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var MODES = [
	{
		id: "plate",
		label: "Plate"
	},
	{
		id: "morph",
		label: "Morph"
	},
	{
		id: "refold",
		label: "Re-fold"
	}
];
function AppHeader() {
	const mode = useStudio((s) => s.mode);
	const setMode = useStudio((s) => s.setMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] tracking-[0.32em] text-gold uppercase",
				children: "Sequential mandala motion"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl",
				children: "Prism Loom"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 md:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden rounded-full bg-ink p-1 shadow-[var(--shadow-border)] sm:flex",
				children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m.id),
					className: cn("rounded-full px-3 py-1.5 text-xs tracking-wide uppercase transition-colors", mode === m.id ? "bg-gold text-void" : "text-muted hover:text-cream"),
					children: m.label
				}, m.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
		})]
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-full bg-cream/10" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-40 truncate text-sm [&_button]:text-muted [&_span]:text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "rounded-md bg-gold px-3 py-2 text-sm font-medium text-void transition-transform duration-150 hover:bg-gold/90 active:scale-[0.96]",
		children: "Sign in"
	}) });
}
var VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
var FRAG = `#version 300 es
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
function compile(gl, type, src) {
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
var LoomGL = class {
	gl;
	program;
	vao;
	texA;
	texB;
	loc;
	destroyed = false;
	constructor(canvas) {
		const gl = canvas.getContext("webgl2", {
			premultipliedAlpha: false,
			alpha: true,
			antialias: true
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
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
		gl.deleteShader(vs);
		gl.deleteShader(fs);
		this.program = prog;
		const buf = gl.createBuffer();
		const vao = gl.createVertexArray();
		if (!vao || !buf) throw new Error("vao");
		this.vao = vao;
		gl.bindVertexArray(vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			1,
			-1,
			-1,
			1,
			1,
			1
		]), gl.STATIC_DRAW);
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
			uRes: gl.getUniformLocation(prog, "uRes")
		};
	}
	makeTex() {
		const gl = this.gl;
		const t = gl.createTexture();
		if (!t) throw new Error("tex");
		gl.bindTexture(gl.TEXTURE_2D, t);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([
			8,
			7,
			12,
			255
		]));
		return t;
	}
	upload(slot, image) {
		const gl = this.gl;
		const tex = slot === 0 ? this.texA : this.texB;
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}
	resize(w, h) {
		const gl = this.gl;
		const c = gl.canvas;
		if (c.width !== w || c.height !== h) {
			c.width = w;
			c.height = h;
		}
		gl.viewport(0, 0, w, h);
	}
	draw(u) {
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
		const c = gl.canvas;
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
};
var imageCache = /* @__PURE__ */ new Map();
function loadImage(src) {
	const hit = imageCache.get(src);
	if (hit) return hit;
	const p = new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`image ${src}`));
		img.src = src;
	});
	imageCache.set(src, p);
	return p;
}
var MOTIONS = [
	{
		id: "spin-breathe",
		label: "Spin Breathe",
		blurb: "Slow clockwise rotation with a living zoom.",
		rotSpeed: .18,
		zoomAmp: .055,
		zoomHz: .35,
		pulseAmp: .35,
		offsetAmp: 0,
		hueAmp: 0,
		foldOsc: 0,
		videoBeat: "slowly rotates clockwise around its exact center while the whole mandala breathes in scale"
	},
	{
		id: "bloom",
		label: "Center Bloom",
		blurb: "Zoom into the nucleus, then pull back.",
		rotSpeed: .08,
		zoomAmp: .14,
		zoomHz: .22,
		pulseAmp: .8,
		offsetAmp: 0,
		hueAmp: 0,
		foldOsc: 0,
		videoBeat: "the core blooms brighter as the camera eases in and out from the exact center"
	},
	{
		id: "unfold",
		label: "Fold Unfold",
		blurb: "Wedge count swells and recedes.",
		rotSpeed: .1,
		zoomAmp: .03,
		zoomHz: .3,
		pulseAmp: .2,
		offsetAmp: 0,
		hueAmp: 0,
		foldOsc: 2.2,
		videoBeat: "kaleidoscope folds multiply and recede as if the flower is unfolding"
	},
	{
		id: "petal-wave",
		label: "Petal Wave",
		blurb: "A small offset drift makes petals swim.",
		rotSpeed: .12,
		zoomAmp: .04,
		zoomHz: .4,
		pulseAmp: .25,
		offsetAmp: .55,
		hueAmp: 0,
		foldOsc: 0,
		videoBeat: "petals swim in a slow radial wave while the camera stays locked on center"
	},
	{
		id: "color-tide",
		label: "Color Tide",
		blurb: "Hue drifts like a tide across the plate.",
		rotSpeed: .07,
		zoomAmp: .04,
		zoomHz: .25,
		pulseAmp: .2,
		offsetAmp: 0,
		hueAmp: .08,
		foldOsc: 0,
		videoBeat: "color temperature tides warmer then cooler across the same mandala"
	},
	{
		id: "gem-pulse",
		label: "Gem Pulse",
		blurb: "The core heartbeat. Outer ring holds.",
		rotSpeed: .05,
		zoomAmp: .02,
		zoomHz: .9,
		pulseAmp: 1,
		offsetAmp: 0,
		hueAmp: 0,
		foldOsc: 0,
		videoBeat: "the gem nucleus pulses like a heartbeat while the outer petals hold"
	},
	{
		id: "drift-morph",
		label: "Drift Morph",
		blurb: "Crossfade to the next plate on a continuing spin.",
		rotSpeed: .14,
		zoomAmp: .05,
		zoomHz: .3,
		pulseAmp: .3,
		offsetAmp: 0,
		hueAmp: 0,
		foldOsc: 0,
		videoBeat: "the mandala morphs into the next plate while rotation continues without a cut"
	},
	{
		id: "mirror-storm",
		label: "Mirror Storm",
		blurb: "Aggressive re-fold. Use sparingly.",
		rotSpeed: .28,
		zoomAmp: .08,
		zoomHz: .7,
		pulseAmp: .5,
		offsetAmp: .25,
		hueAmp: .03,
		foldOsc: 3.5,
		videoBeat: "mirror wedges flash and re-fold in a controlled storm around the still center"
	}
];
var MOTION_BY_ID = Object.fromEntries(MOTIONS.map((m) => [m.id, m]));
var D_ANGLE = 12;
var SHOT_SEC$1 = 6;
var MORPH_SEC$1 = 2;
function compileJsonContext(sequence, motionId, sequenceId = "chromatic-journey") {
	const motion = MOTION_BY_ID[motionId];
	let angle = 0;
	const shots = sequence.map((id, i) => {
		const plate = PLATE_BY_ID[id];
		const nextId = sequence[(i + 1) % sequence.length];
		const nextPlate = sequence.length > 1 ? PLATE_BY_ID[nextId] : null;
		const morph = nextPlate && i < sequence.length - 1 ? MORPHS.find((m) => m.from === id && m.to === nextPlate.id)?.src ?? null : null;
		const start = {
			angleDeg: round(angle),
			zoom: round(1 + .04 * Math.sin(i * .9)),
			hue: 0,
			folds: plate.symmetry
		};
		angle += D_ANGLE;
		const end = {
			angleDeg: round(angle),
			zoom: round(1 + .04 * Math.sin((i + 1) * .9)),
			hue: 0,
			folds: nextPlate ? nextPlate.symmetry : plate.symmetry
		};
		const keyframes = KEYFRAME_EDITS.filter((k) => k.plateId === id).map((k) => ({
			step: k.step,
			src: k.src,
			dAngle: k.dAngle,
			note: k.note
		}));
		const continueFrom = i === 0 ? "Opens on a locked-center frame. No prior shot." : `Continues shot ${i} without a cut. Inherit rotation ${start.angleDeg}° and zoom ${start.zoom}. Same camera, same crop.`;
		const videoPrompt = buildVideoPrompt(plate, nextPlate, motion, start, end, i === sequence.length - 1);
		const editPrompt = plate.editStill;
		return {
			index: i + 1,
			durationSec: SHOT_SEC$1,
			plate,
			nextPlate,
			morphSrc: morph,
			keyframes,
			motion,
			start,
			end,
			videoPrompt,
			editPrompt,
			continueFrom
		};
	});
	return {
		studio: "Prism Loom",
		version: 1,
		sequenceId,
		handoffLaw: {
			rotationContinues: true,
			neverResetAngle: true,
			camera: "locked-center",
			shotSec: SHOT_SEC$1,
			morphWindowSec: MORPH_SEC$1,
			dAnglePerShot: D_ANGLE
		},
		tokens: sequence.map((id) => PLATE_BY_ID[id]),
		shots
	};
}
function buildVideoPrompt(plate, next, motion, start, end, last) {
	const morphBit = next && !last ? ` In the final two seconds, morph seamlessly into "${next.title}" (${next.energy}) while rotation continues.` : "";
	return `${plate.videoStill} Camera locked on the exact center, square crop, no cuts. The mandala ${motion.videoBeat}. Rotation continues from ${start.angleDeg}° to ${end.angleDeg} clockwise. Zoom ${start.zoom} to ${end.zoom}. ${plate.symmetry}-fold ${plate.folds}. Palette ${plate.palette.primary.join(", ")} on ${plate.palette.ground}.` + morphBit;
}
function round(n) {
	return Math.round(n * 1e3) / 1e3;
}
function promptList(ctx) {
	return ctx.shots.map((s) => {
		return [
			`SHOT ${s.index}  ${s.plate.title}  ·  ${s.durationSec}s  ·  ${s.motion.label}`,
			`Handoff  ${s.start.angleDeg}° → ${s.end.angleDeg}°   zoom ${s.start.zoom} → ${s.end.zoom}`,
			s.continueFrom,
			s.videoPrompt,
			""
		].join("\n");
	}).join("\n");
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[transform,background-color,box-shadow,color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			gold: "bg-gold text-void hover:bg-gold/90",
			ghost: "text-cream/85 hover:bg-cream/10",
			line: "text-cream shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			cyan: "bg-cyan text-void hover:bg-cyan/90"
		},
		size: {
			sm: "h-9 px-3 text-sm",
			md: "h-10 px-4 text-sm",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "line",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var SHOT_SEC = 6;
var MORPH_SEC = 2;
function KaleidoStage() {
	const canvasRef = (0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const activeId = useStudio((s) => s.activeId);
	const nextId = useStudio((s) => s.nextId);
	const blend = useStudio((s) => s.blend);
	const selectedMorphSrc = useStudio((s) => s.selectedMorphSrc);
	const playing = useStudio((s) => s.playing);
	const plate = PLATE_BY_ID[activeId] ?? PLATES[0];
	const next = PLATE_BY_ID[nextId] ?? plate;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let loom;
		try {
			loom = new LoomGL(canvas);
		} catch {
			setFailed(true);
			return;
		}
		const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let elapsed = 0;
		let last = performance.now();
		let lastA = "";
		let lastB = "";
		let dead = false;
		const resize = () => {
			const parent = canvas.parentElement;
			if (!parent) return;
			const size = Math.min(parent.clientWidth, parent.clientHeight);
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			loom.resize(Math.max(2, Math.floor(size * dpr)), Math.max(2, Math.floor(size * dpr)));
		};
		resize();
		const ro = new ResizeObserver(resize);
		if (canvas.parentElement) ro.observe(canvas.parentElement);
		const tick = (now) => {
			if (dead) return;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const s = useStudio.getState();
			if (!reduced) elapsed += dt * s.speed;
			if (s.playing && s.sequence.length > 1 && !s.selectedMorphSrc) {
				const n = s.sequence.length;
				const total = n * SHOT_SEC;
				const pos = elapsed % total;
				const i = Math.min(n - 1, Math.max(0, Math.floor(pos / SHOT_SEC)));
				const local = pos - i * SHOT_SEC;
				const id = s.sequence[i];
				const nid = s.sequence[(i + 1) % n];
				const b = local > 4 ? (local - 4) / MORPH_SEC : 0;
				if (id && nid && (id !== s.activeId || nid !== s.nextId || Math.abs(b - s.blend) > .02)) s.syncShot(id, nid, b);
			}
			const st = useStudio.getState();
			const aPlate = PLATE_BY_ID[st.activeId] ?? PLATES[0];
			const bPlate = PLATE_BY_ID[st.nextId] ?? aPlate;
			const srcA = st.selectedMorphSrc ?? aPlate.src;
			const srcB = bPlate.src;
			if (srcA !== lastA) {
				lastA = srcA;
				loadImage(srcA).then((img) => {
					if (!dead) loom.upload(0, img);
				}).catch(() => {});
			}
			if (srcB !== lastB) {
				lastB = srcB;
				loadImage(srcB).then((img) => {
					if (!dead) loom.upload(1, img);
				}).catch(() => {});
			}
			const motion = MOTION_BY_ID[st.motionId] ?? MOTIONS[0];
			const rot = st.rotManual + (reduced ? 0 : elapsed * motion.rotSpeed);
			const zoom = st.zoom * (1 + (reduced ? 0 : motion.zoomAmp * Math.sin(elapsed * motion.zoomHz * Math.PI * 2)));
			const folds = st.mode === "refold" ? st.folds + (reduced ? 0 : motion.foldOsc * Math.sin(elapsed * .6)) : 0;
			loom.draw({
				blend: st.selectedMorphSrc ? 0 : st.mode === "morph" || st.playing ? st.blend : 0,
				rot,
				zoom,
				folds: Math.max(2, folds),
				offset: st.offset + (reduced ? 0 : motion.offsetAmp),
				hue: st.hue + (reduced ? 0 : motion.hueAmp * Math.sin(elapsed * .45)),
				pulse: st.pulse * motion.pulseAmp,
				time: elapsed,
				refold: st.mode === "refold",
				vignette: st.vignette
			});
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		setReady(true);
		return () => {
			dead = true;
			cancelAnimationFrame(raf);
			ro.disconnect();
			loom.destroy();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-0 flex-1 flex-col items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square w-full max-w-[min(100%,72vh)]",
			children: [
				!ready && !failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: selectedMorphSrc ?? plate.src,
					alt: plate.title,
					className: "absolute inset-0 size-full rounded-full object-cover opacity-80"
				}),
				failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: selectedMorphSrc ?? plate.src,
					alt: plate.title,
					className: "absolute inset-0 size-full rounded-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: cn("absolute inset-0 size-full", failed && "hidden"),
					"aria-label": `${plate.title} kaleidoscope loom`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-3 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-full bg-void/70 px-4 py-1.5 text-center backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-sm text-cream",
							children: [selectedMorphSrc ? "Morph keyframe" : plate.title, !selectedMorphSrc && blend > .04 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-gold",
								children: [" → ", next.title]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[0.65rem] tracking-[0.22em] text-muted uppercase",
							children: [
								plate.symmetry,
								"-fold · ",
								plate.folds,
								blend > .04 ? ` · blend ${Math.round(blend * 100)}%` : ""
							]
						})]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					"aria-label": "Previous plate",
					onClick: () => useStudio.getState().stepPlate(-1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "gold",
					"aria-label": playing ? "Pause sequence" : "Play sequence",
					onClick: () => useStudio.getState().togglePlaying(),
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					"aria-label": "Next plate",
					onClick: () => useStudio.getState().stepPlate(1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
				})
			]
		})]
	});
}
function PlateRail() {
	const activeId = useStudio((s) => s.activeId);
	const setActive = useStudio((s) => s.setActive);
	const setPlaying = useStudio((s) => s.setPlaying);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "loom-scroll flex gap-3 overflow-x-auto px-1 py-2",
		children: PLATES.map((p) => {
			const on = p.id === activeId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					setPlaying(false);
					setActive(p.id);
				},
				className: "group w-20 shrink-0 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("block aspect-square overflow-hidden rounded-xl transition-[box-shadow,transform] duration-150", on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.src,
						alt: "",
						className: "size-full object-cover transition-transform duration-200 group-hover:scale-105"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("mt-1.5 block truncate text-[0.65rem] tracking-wide", on ? "text-gold" : "text-muted"),
					children: p.title
				})]
			}, p.id);
		})
	});
}
function SequenceRail() {
	const sequence = useStudio((s) => s.sequence);
	const activeId = useStudio((s) => s.activeId);
	const selectedMorphSrc = useStudio((s) => s.selectedMorphSrc);
	const setActive = useStudio((s) => s.setActive);
	const setPlaying = useStudio((s) => s.setPlaying);
	const setSelectedMorph = useStudio((s) => s.setSelectedMorph);
	const removeFromSequence = useStudio((s) => s.removeFromSequence);
	const resetSequence = useStudio((s) => s.resetSequence);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-panel p-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] tracking-[0.24em] text-gold uppercase",
				children: "Chromatic journey"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg text-cream",
				children: "Sequence"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: resetSequence,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Reset"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "loom-scroll flex items-center gap-1 overflow-x-auto pb-1",
			children: sequence.map((id, i) => {
				const plate = PLATE_BY_ID[id];
				const next = sequence[i + 1];
				const morph = next ? morphBetween(id, next) : void 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setPlaying(false);
								setActive(id);
							},
							className: cn("block size-16 overflow-hidden rounded-lg transition-shadow", id === activeId && !selectedMorphSrc ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: plate.src,
								alt: plate.title,
								className: "size-full object-cover"
							})
						}), sequence.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Remove ${plate.title}`,
							onClick: () => removeFromSequence(i),
							className: "absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-ink text-muted hover:text-cream",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
						})]
					}), morph && next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						title: `Morph ${plate.title} → ${PLATE_BY_ID[next].title}`,
						onClick: () => {
							setPlaying(false);
							setSelectedMorph(morph.src);
						},
						className: cn("relative size-12 overflow-hidden rounded-full", selectedMorphSrc === morph.src ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: morph.src,
							alt: "",
							className: "size-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 grid place-items-center bg-void/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitMerge, { className: "size-3 text-gold" })
						})]
					})]
				}, `${id}-${i}`);
			})
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3e3baa55764a723a1e615f520d21153aac81f2f94ae3443312b91e62cd91ddb9"));
var saveLoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	title: input.title.trim().slice(0, 80) || "Untitled loom",
	sequence: input.sequence.slice(0, 16),
	motionId: input.motionId.slice(0, 40)
})).handler(createSsrRpc("9b4abe1b7bbeb2637fae46c38613a2ad12a1a6af5acfbcd4c4cd6aeee8bca16a"));
var forgeKeyframe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	plateId: input.plateId,
	prompt: input.prompt.trim().slice(0, 800)
})).handler(createSsrRpc("5533e0724290a930b3bec20e728320fd69f8f328d3a9b0fda85a634a25f6c40d"));
var TABS = [
	{
		id: "tokens",
		label: "Tokens",
		icon: Hexagon
	},
	{
		id: "motion",
		label: "Motion",
		icon: WandSparkles
	},
	{
		id: "sequence",
		label: "JSON",
		icon: Layers
	},
	{
		id: "reels",
		label: "Reels",
		icon: Clapperboard
	}
];
function SideDesk() {
	const desk = useStudio((s) => s.desk);
	const setDesk = useStudio((s) => s.setDesk);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-h-0 flex-col rounded-2xl bg-panel shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex border-b border-line",
			children: TABS.map((t) => {
				const Icon = t.icon;
				const on = desk === t.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDesk(t.id),
					className: cn("flex flex-1 items-center justify-center gap-1.5 py-3 text-xs tracking-wide uppercase", on ? "text-gold" : "text-muted hover:text-cream"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: t.label
					})]
				}, t.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "loom-scroll min-h-0 flex-1 overflow-y-auto p-4",
			children: [
				desk === "tokens" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenDesk, {}),
				desk === "motion" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDesk, {}),
				desk === "sequence" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonDesk, {}),
				desk === "reels" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelDesk, {})
			]
		})]
	});
}
function TokenDesk() {
	const activeId = useStudio((s) => s.activeId);
	const addToSequence = useStudio((s) => s.addToSequence);
	const plate = PLATE_BY_ID[activeId] ?? PLATES[0];
	const user = useCurrentUser();
	const edits = KEYFRAME_EDITS.filter((k) => k.plateId === activeId);
	const [forging, setForging] = (0, import_react.useState)(false);
	const [forged, setForged] = (0, import_react.useState)(null);
	const json = (0, import_react.useMemo)(() => JSON.stringify({
		id: plate.id,
		title: plate.title,
		symmetry: plate.symmetry,
		folds: plate.folds,
		energy: plate.energy,
		temperature: plate.temperature,
		center: plate.center,
		motifs: plate.motifs,
		texture: plate.texture,
		palette: plate.palette,
		motionNative: plate.motionNative,
		videoStill: plate.videoStill,
		editStill: plate.editStill
	}, null, 2), [plate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] tracking-[0.24em] text-gold uppercase",
					children: "Extracted tokens"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-cream",
					children: plate.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => addToSequence(plate.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Sequence"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					plate.energy,
					". ",
					plate.texture,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[0.65rem] tracking-[0.2em] text-muted uppercase",
				children: "Palette"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					plate.palette.ground,
					...plate.palette.primary,
					...plate.palette.accent
				].map((hex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: hex,
					onClick: () => {
						navigator.clipboard.writeText(hex);
						toast("Copied " + hex);
					},
					className: "size-7 rounded-full shadow-[var(--shadow-border)]",
					style: { background: hex }
				}, hex))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[0.65rem] tracking-[0.18em] text-muted uppercase",
						children: "Symmetry"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [plate.symmetry, "-fold"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[0.65rem] tracking-[0.18em] text-muted uppercase",
						children: "Temp"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "capitalize",
						children: plate.temperature
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[0.65rem] tracking-[0.18em] text-muted uppercase",
							children: "Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: plate.center.motif })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[0.65rem] tracking-[0.18em] text-muted uppercase",
							children: "Motifs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: plate.motifs.join(" · ") })]
					})
				]
			}),
			edits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[0.65rem] tracking-[0.2em] text-muted uppercase",
				children: "Sequential edits"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: edits.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: e.src,
						alt: "",
						className: "aspect-square w-full rounded-lg object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[0.65rem] text-muted",
						children: [
							"+",
							e.dAngle,
							"° · ",
							e.note
						]
					})]
				}, e.src))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => {
						navigator.clipboard.writeText(json);
						toast("Plate tokens copied");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy JSON"]
				}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "gold",
					disabled: forging,
					onClick: async () => {
						setForging(true);
						try {
							const res = await forgeKeyframe({ data: {
								plateId: plate.id,
								prompt: plate.editStill
							} });
							if (res.ok) {
								setForged(res.url);
								toast("Keyframe forged");
							} else toast.error(res.error);
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Forge failed");
						} finally {
							setForging(false);
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), forging ? "Forging…" : "Forge +8°"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "self-center text-xs text-muted",
					children: "Sign in to forge a live keyframe."
				})]
			}),
			forged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: forged,
				alt: "Forged keyframe",
				className: "w-full rounded-lg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto rounded-lg bg-ink p-3 text-[0.7rem] leading-relaxed text-cream/80",
				children: json
			})
		]
	});
}
function MotionDesk() {
	const motionId = useStudio((s) => s.motionId);
	const setMotion = useStudio((s) => s.setMotion);
	const speed = useStudio((s) => s.speed);
	const zoom = useStudio((s) => s.zoom);
	const folds = useStudio((s) => s.folds);
	const hue = useStudio((s) => s.hue);
	const pulse = useStudio((s) => s.pulse);
	const offset = useStudio((s) => s.offset);
	const vignette = useStudio((s) => s.vignette);
	const rotManual = useStudio((s) => s.rotManual);
	const mode = useStudio((s) => s.mode);
	const s = useStudio.getState;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] tracking-[0.24em] text-gold uppercase",
				children: "Procedural patterns"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl text-cream",
				children: "Motion recipes"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: MOTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setMotion(m.id),
					className: cn("rounded-lg p-3 text-left shadow-[var(--shadow-border)] transition-shadow", motionId === m.id && "shadow-[var(--shadow-border-hover)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm font-medium", motionId === m.id ? "text-gold" : "text-cream"),
						children: m.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: m.blurb
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Speed",
				value: speed,
				min: .2,
				max: 2.4,
				step: .05,
				onChange: s().setSpeed
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Zoom",
				value: zoom,
				min: .7,
				max: 1.6,
				step: .01,
				onChange: s().setZoom
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Rotate",
				value: rotManual,
				min: -3.14,
				max: 3.14,
				step: .01,
				onChange: s().setRotManual
			}),
			mode === "refold" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Folds",
				value: folds,
				min: 3,
				max: 16,
				step: 1,
				onChange: s().setFolds
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Hue tide",
				value: hue,
				min: -.2,
				max: .2,
				step: .005,
				onChange: s().setHue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Pulse",
				value: pulse,
				min: 0,
				max: 1,
				step: .02,
				onChange: s().setPulse
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Petal offset",
				value: offset,
				min: 0,
				max: 1,
				step: .02,
				onChange: s().setOffset
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				label: "Vignette",
				value: vignette,
				min: 0,
				max: 1,
				step: .02,
				onChange: s().setVignette
			})
		]
	});
}
function Slider({ label, value, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex justify-between text-[0.65rem] tracking-[0.18em] text-muted uppercase",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-cream/70",
				children: value.toFixed(2)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "w-full accent-gold"
		})]
	});
}
function JsonDesk() {
	const sequence = useStudio((s) => s.sequence);
	const motionId = useStudio((s) => s.motionId);
	const ctx = (0, import_react.useMemo)(() => compileJsonContext(sequence, motionId), [sequence, motionId]);
	const json = (0, import_react.useMemo)(() => JSON.stringify(ctx, null, 2), [ctx]);
	const prompts = (0, import_react.useMemo)(() => promptList(ctx), [ctx]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] tracking-[0.24em] text-gold uppercase",
					children: "JSON context"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-cream",
					children: "Handoff compiler"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Rotation never resets. Each shot inherits the previous angle so video models can stitch."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							navigator.clipboard.writeText(json);
							toast("JSON context copied");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy JSON"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "cyan",
						onClick: () => {
							navigator.clipboard.writeText(prompts);
							toast("Video prompts copied");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy prompts"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "gold",
						disabled: saving,
						onClick: async () => {
							setSaving(true);
							try {
								await saveLoom({ data: {
									title: `Journey · ${sequence.map((id) => PLATE_BY_ID[id].title).join(" → ")}`.slice(0, 80),
									sequence,
									motionId
								} });
								toast("Loom saved");
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Save failed");
							} finally {
								setSaving(false);
							}
						},
						children: saving ? "Saving…" : "Save loom"
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3",
				children: ctx.shots.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-ink p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-[0.18em] text-gold uppercase",
							children: [
								"Shot ",
								shot.index,
								" · ",
								shot.plate.title
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								shot.start.angleDeg,
								"° → ",
								shot.end.angleDeg,
								"° · zoom ",
								shot.start.zoom,
								" → ",
								shot.end.zoom
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-cream/90",
							children: shot.videoPrompt
						})
					]
				}, shot.index))
			})
		]
	});
}
function ReelDesk() {
	const setActive = useStudio((s) => s.setActive);
	const setPlaying = useStudio((s) => s.setPlaying);
	const setMotion = useStudio((s) => s.setMotion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] tracking-[0.24em] text-gold uppercase",
					children: "Motion reels"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-cream",
					children: "Baked 6s loops"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Sequential edits, then image-to-video. Camera locked on center. Use as stitchable shots."
				})
			] }),
			REELS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-xl bg-ink shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: r.src,
					controls: true,
					loop: true,
					playsInline: true,
					poster: PLATE_BY_ID[r.plateId].src,
					className: "aspect-square w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-cream",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: r.prompt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								setPlaying(false);
								setActive(r.plateId);
								setMotion(r.motionId);
							},
							children: "Open on loom"
						})
					]
				})]
			}, r.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					"Full catalog is ",
					PLATES.length,
					" plates. Morphs sit between every consecutive pair on the chromatic journey."
				]
			})
		]
	});
}
function StudioApp() {
	const mode = useStudio((s) => s.mode);
	const setMode = useStudio((s) => s.setMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-void text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 border-b border-line px-4 py-2 sm:hidden",
				children: [
					"plate",
					"morph",
					"refold"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m),
					className: cn("flex-1 rounded-full py-2 text-xs tracking-wide uppercase", mode === m ? "bg-gold text-void" : "text-muted"),
					children: m
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-line px-3 md:px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateRail, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 grid-cols-1 gap-4 p-3 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoStage, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SequenceRail, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideDesk, {})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {});
}
//#endregion
export { Home as component };

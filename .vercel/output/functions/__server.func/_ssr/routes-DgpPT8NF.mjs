import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut, t as authClient } from "./client-sGid3STf.mjs";
import { a as PLATE_BY_ID, c as formatTimecode, d as prevReel, f as reelById, i as PLATES, l as morphBetween, m as reelsForPlate, n as KEYFRAME_EDITS, o as REELS, p as reelOrdinal, r as MORPHS, s as authMiddleware, t as DEFAULT_SEQUENCE, u as nextReel } from "./plates-C7M5RyGg.mjs";
import { _ as Copy, b as ChevronLeft, c as Repeat, d as Play, f as Pause, g as GitMerge, h as Hexagon, i as Volume2, l as Repeat1, m as Layers, n as WandSparkles, o as Sparkles, p as Maximize, r as VolumeX, s as RotateCcw, t as X, u as Plus, v as Clapperboard, y as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DgpPT8NF.js
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
var LOOP_CYCLE = [
	"one",
	"all",
	"off"
];
var useStudio = create((set, get) => ({
	sequence: [...DEFAULT_SEQUENCE],
	activeId: DEFAULT_SEQUENCE[0],
	nextId: DEFAULT_SEQUENCE[1],
	blend: 0,
	motionId: "spin-breathe",
	mode: "plate",
	playing: true,
	frozen: false,
	speed: 1,
	folds: 8,
	zoom: 1.05,
	offset: 0,
	hue: 0,
	pulse: .4,
	vignette: .65,
	rotManual: 0,
	desk: "reels",
	selectedMorphSrc: null,
	view: "loom",
	activeReelId: null,
	cinemaPaused: true,
	muted: true,
	loopMode: "one",
	rate: 1,
	refoldLive: false,
	setActive: (id) => set((s) => ({
		activeId: id,
		nextId: neighbor(s.sequence, id),
		blend: 0,
		selectedMorphSrc: null,
		view: "loom",
		cinemaPaused: true,
		activeReelId: reelsForPlate(id)[0]?.id ?? s.activeReelId
	})),
	setNext: (id) => set({ nextId: id }),
	setBlend: (n) => set({ blend: n }),
	setMotion: (id) => set({ motionId: id }),
	setMode: (m) => set({
		mode: m,
		view: "loom"
	}),
	setPlaying: (p) => set({
		playing: p,
		frozen: !p
	}),
	togglePlaying: () => {
		const s = get();
		if (s.view === "cinema") {
			set({ cinemaPaused: !s.cinemaPaused });
			return;
		}
		const playing = !s.playing;
		set({
			playing,
			frozen: !playing
		});
	},
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
		blend: src ? 0 : get().blend,
		view: "loom",
		cinemaPaused: true
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
			selectedMorphSrc: null,
			view: "loom",
			cinemaPaused: true
		};
	}),
	setView: (v) => {
		if (v === "cinema") {
			const s = get();
			const reel = s.activeReelId && reelById(s.activeReelId) || reelsForPlate(s.activeId)[0] || REELS[0];
			if (!reel) return;
			set({
				view: "cinema",
				activeReelId: reel.id,
				activeId: reel.plateId,
				cinemaPaused: false,
				playing: false,
				frozen: true,
				selectedMorphSrc: null,
				desk: "reels"
			});
			return;
		}
		set({
			view: "loom",
			cinemaPaused: true,
			frozen: false,
			playing: true
		});
	},
	playReel: (id) => {
		const reel = reelById(id);
		if (!reel) return;
		const s = get();
		set({
			view: "cinema",
			activeReelId: id,
			activeId: reel.plateId,
			nextId: neighbor(s.sequence, reel.plateId),
			cinemaPaused: false,
			playing: false,
			frozen: true,
			selectedMorphSrc: null,
			blend: 0,
			motionId: reel.motionId,
			desk: "reels"
		});
	},
	closeCinema: () => set({
		view: "loom",
		cinemaPaused: true,
		frozen: false,
		playing: true,
		refoldLive: false
	}),
	stepReel: (dir) => {
		const current = get().activeReelId ?? REELS[0]?.id;
		if (!current) return;
		const next = dir === 1 ? nextReel(current) : prevReel(current);
		get().playReel(next.id);
	},
	setCinemaPaused: (p) => set({ cinemaPaused: p }),
	setMuted: (m) => set({ muted: m }),
	toggleMuted: () => set((s) => ({ muted: !s.muted })),
	setLoopMode: (m) => set({ loopMode: m }),
	cycleLoopMode: () => set((s) => ({ loopMode: LOOP_CYCLE[(LOOP_CYCLE.indexOf(s.loopMode) + 1) % LOOP_CYCLE.length] })),
	setRate: (n) => set({ rate: n }),
	setRefoldLive: (b) => set({
		refoldLive: b,
		mode: b ? "refold" : get().mode
	}),
	playPlateReel: (id) => {
		const reel = reelsForPlate(id)[0];
		if (reel) get().playReel(reel.id);
		else get().setActive(id);
	}
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
	const view = useStudio((s) => s.view);
	const setView = useStudio((s) => s.setView);
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden rounded-full bg-ink p-1 shadow-[var(--shadow-border)] sm:flex",
				children: [MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m.id),
					className: cn("rounded-full px-3 py-1.5 text-xs tracking-wide uppercase transition-colors", view === "loom" && mode === m.id ? "bg-gold text-void" : "text-muted hover:text-cream"),
					children: m.label
				}, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setView(view === "cinema" ? "loom" : "cinema"),
					className: cn("rounded-full px-3 py-1.5 text-xs tracking-wide uppercase transition-colors", view === "cinema" ? "bg-gold text-void" : "text-muted hover:text-cream"),
					children: "Cinema"
				})]
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
function sourceSize(image) {
	if (image instanceof HTMLVideoElement) return [image.videoWidth, image.videoHeight];
	if (image instanceof HTMLImageElement) return [image.naturalWidth, image.naturalHeight];
	if (image instanceof HTMLCanvasElement) return [image.width, image.height];
	if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) return [image.width, image.height];
	return [0, 0];
}
var LoomGL = class {
	gl;
	program;
	vao;
	texA;
	texB;
	loc;
	destroyed = false;
	texW = [0, 0];
	texH = [0, 0];
	constructor(canvas) {
		const gl = canvas.getContext("webgl2", {
			premultipliedAlpha: false,
			alpha: true,
			antialias: true,
			powerPreference: "high-performance"
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
		const [w, h] = sourceSize(image);
		if (w > 0 && h > 0 && this.texW[slot] === w && this.texH[slot] === h) {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
			return;
		}
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		if (w > 0 && h > 0) {
			this.texW[slot] = w;
			this.texH[slot] = h;
		}
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
var cinemaVideoRef = { current: null };
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
var LOOP_AHEAD = .22;
function slotHas(el, src) {
	return Boolean(el && el.getAttribute("data-src") === src && el.readyState >= 2);
}
function CinemaPlayer({ className, hiddenVisually }) {
	const slotA = (0, import_react.useRef)(null);
	const slotB = (0, import_react.useRef)(null);
	const frontRef = (0, import_react.useRef)(0);
	const warmingRef = (0, import_react.useRef)(false);
	const playGen = (0, import_react.useRef)(0);
	const [front, setFront] = (0, import_react.useState)(0);
	const activeReelId = useStudio((s) => s.activeReelId);
	const cinemaPaused = useStudio((s) => s.cinemaPaused);
	const muted = useStudio((s) => s.muted);
	const loopMode = useStudio((s) => s.loopMode);
	const rate = useStudio((s) => s.rate);
	const reel = activeReelId ? reelById(activeReelId) : void 0;
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(reel?.durationSec ?? 0);
	const [buffering, setBuffering] = (0, import_react.useState)(true);
	const [spin, setSpin] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const frontEl = () => frontRef.current === 0 ? slotA.current : slotB.current;
	const backEl = () => frontRef.current === 0 ? slotB.current : slotA.current;
	const bindFront = (el) => {
		cinemaVideoRef.current = el;
		if (el) el.id = "cinema-video";
		const other = el === slotA.current ? slotB.current : slotA.current;
		if (other && other.id === "cinema-video") other.removeAttribute("id");
	};
	const swapTo = (which) => {
		warmingRef.current = false;
		frontRef.current = which;
		setFront(which);
		bindFront(which === 0 ? slotA.current : slotB.current);
		(which === 0 ? slotB.current : slotA.current)?.pause();
	};
	const armNext = (fromId) => {
		const nxt = nextReel(fromId);
		const back = backEl();
		if (!back || !nxt) return;
		if (back.getAttribute("data-src") === nxt.src) return;
		back.setAttribute("data-src", nxt.src);
		back.src = nxt.src;
		back.muted = true;
		back.load();
	};
	(0, import_react.useEffect)(() => {
		bindFront(frontEl());
		return () => {
			if (cinemaVideoRef.current === slotA.current || cinemaVideoRef.current === slotB.current) cinemaVideoRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!reel) return;
		const a = slotA.current;
		const b = slotB.current;
		if (!a || !b) return;
		setFailed(false);
		setProgress(0);
		setCurrent(0);
		setDuration(reel.durationSec);
		if (slotHas(frontEl(), reel.src)) {
			bindFront(frontEl());
			setBuffering(false);
			armNext(reel.id);
			return;
		}
		if (slotHas(backEl(), reel.src)) {
			const incoming = backEl();
			if (!warmingRef.current) try {
				incoming.currentTime = 0;
			} catch {}
			incoming.muted = useStudio.getState().muted;
			incoming.playbackRate = useStudio.getState().rate;
			incoming.loop = useStudio.getState().loopMode === "one";
			swapTo(frontRef.current === 0 ? 1 : 0);
			setBuffering(incoming.readyState < 3);
			armNext(reel.id);
			return;
		}
		warmingRef.current = false;
		setBuffering(true);
		const f = frontEl();
		f.setAttribute("data-src", reel.src);
		f.src = reel.src;
		f.loop = useStudio.getState().loopMode === "one";
		f.load();
		bindFront(f);
		armNext(reel.id);
	}, [
		reel?.id,
		reel?.src,
		reel?.durationSec
	]);
	(0, import_react.useEffect)(() => {
		const f = frontEl();
		if (f) {
			f.muted = muted;
			f.playbackRate = rate;
			f.loop = loopMode === "one";
		}
		const b = backEl();
		if (b) {
			b.playbackRate = rate;
			b.loop = false;
		}
	}, [
		muted,
		rate,
		loopMode,
		front
	]);
	(0, import_react.useEffect)(() => {
		const v = frontEl();
		if (!v || !reel) return;
		const gen = ++playGen.current;
		if (cinemaPaused) {
			v.pause();
			backEl()?.pause();
			return;
		}
		let cancelled = false;
		const kick = async () => {
			if (cancelled || playGen.current !== gen) return;
			try {
				await v.play();
			} catch {
				if (cancelled || playGen.current !== gen) return;
				if (!v.muted) {
					v.muted = true;
					useStudio.getState().setMuted(true);
					try {
						await v.play();
						return;
					} catch {}
				}
				useStudio.getState().setCinemaPaused(true);
			}
		};
		if (v.readyState >= 3) kick();
		else v.addEventListener("canplay", kick, { once: true });
		return () => {
			cancelled = true;
			v.removeEventListener("canplay", kick);
		};
	}, [
		cinemaPaused,
		reel?.id,
		front
	]);
	(0, import_react.useEffect)(() => {
		if (!buffering) {
			setSpin(false);
			return;
		}
		const t = window.setTimeout(() => setSpin(true), 160);
		return () => window.clearTimeout(t);
	}, [buffering]);
	(0, import_react.useEffect)(() => {
		const a = slotA.current;
		const b = slotB.current;
		if (!a || !b) return;
		const onTime = (ev) => {
			const v = ev.currentTarget;
			if (v !== frontEl()) return;
			const d = v.duration || reel?.durationSec || 0;
			const t = v.currentTime || 0;
			setCurrent(t);
			setDuration(d);
			setProgress(d > 0 ? Math.min(1, t / d) : 0);
			const st = useStudio.getState();
			if (st.loopMode === "one" && d > 0 && d - t < .05 && t > .2) try {
				v.currentTime = .001;
			} catch {}
			if (st.loopMode === "all" && d > 0 && d - t < LOOP_AHEAD && t > .4 && !warmingRef.current) {
				const nxt = reel ? nextReel(reel.id) : REELS[0];
				const back = backEl();
				if (back && nxt) {
					if (back.getAttribute("data-src") !== nxt.src) {
						back.setAttribute("data-src", nxt.src);
						back.src = nxt.src;
						back.load();
					}
					if (back.readyState >= 2) {
						warmingRef.current = true;
						back.muted = true;
						back.playbackRate = st.rate;
						try {
							back.currentTime = 0;
						} catch {}
						back.play().catch(() => {
							warmingRef.current = false;
						});
					}
				}
			}
		};
		const onWaiting = (ev) => {
			if (ev.currentTarget === frontEl()) setBuffering(true);
		};
		const onPlaying = (ev) => {
			if (ev.currentTarget === frontEl()) {
				setBuffering(false);
				setFailed(false);
			}
		};
		const onCanPlay = (ev) => {
			if (ev.currentTarget === frontEl()) setBuffering(false);
		};
		const onError = (ev) => {
			if (ev.currentTarget === frontEl()) {
				setFailed(true);
				setBuffering(false);
			}
		};
		const onEnded = (ev) => {
			if (ev.currentTarget !== frontEl()) return;
			const st = useStudio.getState();
			if (st.loopMode === "all") {
				const nxt = reel ? nextReel(reel.id) : REELS[0];
				if (nxt) st.playReel(nxt.id);
			} else if (st.loopMode === "off") st.setCinemaPaused(true);
		};
		const onLoaded = (ev) => {
			const v = ev.currentTarget;
			if (v === frontEl() && v.duration && Number.isFinite(v.duration)) setDuration(v.duration);
		};
		for (const v of [a, b]) {
			v.addEventListener("timeupdate", onTime);
			v.addEventListener("waiting", onWaiting);
			v.addEventListener("playing", onPlaying);
			v.addEventListener("canplay", onCanPlay);
			v.addEventListener("error", onError);
			v.addEventListener("ended", onEnded);
			v.addEventListener("loadedmetadata", onLoaded);
		}
		return () => {
			for (const v of [a, b]) {
				v.removeEventListener("timeupdate", onTime);
				v.removeEventListener("waiting", onWaiting);
				v.removeEventListener("playing", onPlaying);
				v.removeEventListener("canplay", onCanPlay);
				v.removeEventListener("error", onError);
				v.removeEventListener("ended", onEnded);
				v.removeEventListener("loadedmetadata", onLoaded);
			}
		};
	}, [
		reel?.id,
		reel?.durationSec,
		loopMode,
		front
	]);
	if (!reel) return null;
	const ring = 49.2;
	const circ = 2 * Math.PI * ring;
	const onDiscClick = () => {
		useStudio.getState().togglePlaying();
	};
	const retry = () => {
		setFailed(false);
		setBuffering(true);
		const f = frontEl();
		if (f && reel) {
			f.setAttribute("data-src", reel.src);
			f.src = reel.src;
			f.load();
			useStudio.getState().setCinemaPaused(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("absolute inset-0", hiddenVisually && "pointer-events-none opacity-0", className),
		onClick: onDiscClick,
		onDoubleClick: (e) => e.stopPropagation(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: reel.poster,
				alt: "",
				className: cn("cinema-disc absolute inset-0 size-full object-cover transition-opacity duration-200", current > .04 && !buffering ? "opacity-0" : "opacity-100")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: slotA,
				className: cn("cinema-disc absolute inset-0 size-full object-cover transition-opacity duration-150", front === 0 ? "opacity-100" : "opacity-0"),
				poster: reel.poster,
				playsInline: true,
				preload: "auto",
				crossOrigin: "anonymous",
				muted: front === 0 ? muted : true,
				loop: front === 0 && loopMode === "one",
				"aria-label": front === 0 ? reel.title : void 0,
				"aria-hidden": front !== 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: slotB,
				className: cn("cinema-disc absolute inset-0 size-full object-cover transition-opacity duration-150", front === 1 ? "opacity-100" : "opacity-0"),
				playsInline: true,
				preload: "auto",
				crossOrigin: "anonymous",
				muted: front === 1 ? muted : true,
				loop: front === 1 && loopMode === "one",
				"aria-label": front === 1 ? reel.title : void 0,
				"aria-hidden": front !== 1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "pointer-events-none absolute inset-0 size-full",
				viewBox: "0 0 100 100",
				"aria-hidden": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: ring,
					fill: "none",
					stroke: "rgba(212,175,90,0.18)",
					strokeWidth: "0.55"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: ring,
					fill: "none",
					stroke: "var(--color-gold)",
					strokeWidth: "0.7",
					strokeLinecap: "round",
					strokeDasharray: circ,
					strokeDashoffset: circ * (1 - progress),
					transform: "rotate(-90 50 50)"
				})]
			}),
			spin && !failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" })
			}),
			failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full bg-void/80 px-4 py-2 text-sm text-cream",
					onClick: (e) => {
						e.stopPropagation();
						retry();
					},
					children: "Reel failed — retry"
				})
			}),
			muted && !failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-void/75 px-3 py-1.5 text-xs tracking-wide text-gold uppercase backdrop-blur-sm",
				onClick: (e) => {
					e.stopPropagation();
					useStudio.getState().setMuted(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-3.5" }), "Tap for sound"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-4 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-full bg-void/70 px-3 py-1 font-mono text-xs tabular-nums text-gold backdrop-blur-sm",
					children: [
						formatTimecode(current),
						" / ",
						formatTimecode(duration)
					]
				})
			})
		]
	});
}
function CinemaScrubber() {
	const video = () => cinemaVideoRef.current;
	const activeReelId = useStudio((s) => s.activeReelId);
	const reel = activeReelId ? reelById(activeReelId) : void 0;
	const [value, setValue] = (0, import_react.useState)(0);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			const v = video();
			if (!v || dragging) return;
			const d = v.duration || reel?.durationSec || 1;
			setValue(d > 0 ? v.currentTime / d : 0);
		}, 80);
		return () => window.clearInterval(id);
	}, [
		dragging,
		reel?.durationSec,
		activeReelId
	]);
	if (!reel) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-0 flex-1 items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "sr-only",
			children: ["Seek ", reel.title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min: 0,
			max: 1,
			step: .001,
			value,
			className: "h-2 w-full accent-gold",
			onPointerDown: () => setDragging(true),
			onPointerUp: () => setDragging(false),
			onChange: (e) => {
				const n = Number(e.target.value);
				setValue(n);
				const v = video();
				if (v && v.duration) v.currentTime = n * v.duration;
			}
		})]
	});
}
var SHOT_SEC = 6;
var MORPH_SEC = 2;
var RATES = [
	.5,
	1,
	1.5,
	2
];
function KaleidoStage() {
	const canvasRef = (0, import_react.useRef)(null);
	const stageRef = (0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const activeId = useStudio((s) => s.activeId);
	const nextId = useStudio((s) => s.nextId);
	const blend = useStudio((s) => s.blend);
	const selectedMorphSrc = useStudio((s) => s.selectedMorphSrc);
	const playing = useStudio((s) => s.playing);
	const view = useStudio((s) => s.view);
	const cinemaPaused = useStudio((s) => s.cinemaPaused);
	const refoldLive = useStudio((s) => s.refoldLive);
	const activeReelId = useStudio((s) => s.activeReelId);
	const loopMode = useStudio((s) => s.loopMode);
	const plate = PLATE_BY_ID[activeId] ?? PLATES[0];
	const next = PLATE_BY_ID[nextId] ?? plate;
	const reel = activeReelId ? reelById(activeReelId) : void 0;
	const cinema = view === "cinema";
	const showVideo = cinema;
	const hideCanvas = cinema && !refoldLive;
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
			if (!reduced && !s.frozen) elapsed += dt * s.speed;
			if (s.playing && s.sequence.length > 1 && !s.selectedMorphSrc && s.view === "loom") {
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
			if (!(st.view === "cinema" && !st.refoldLive)) {
				const aPlate = PLATE_BY_ID[st.activeId] ?? PLATES[0];
				const bPlate = PLATE_BY_ID[st.nextId] ?? aPlate;
				const vid = cinemaVideoRef.current;
				const live = st.view === "cinema" && st.refoldLive && vid && vid.readyState >= 2;
				if (live && vid) {
					loom.upload(0, vid);
					lastA = "__video__";
				} else {
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
				}
				const motion = MOTION_BY_ID[st.motionId] ?? MOTIONS[0];
				const rot = st.rotManual + (reduced || st.frozen ? 0 : elapsed * motion.rotSpeed);
				const zoom = st.zoom * (1 + (reduced || st.frozen ? 0 : motion.zoomAmp * Math.sin(elapsed * motion.zoomHz * Math.PI * 2)));
				const folds = st.mode === "refold" || st.view === "cinema" && st.refoldLive ? st.folds + (reduced || st.frozen ? 0 : motion.foldOsc * Math.sin(elapsed * .6)) : 0;
				loom.draw({
					blend: live ? 0 : st.selectedMorphSrc ? 0 : st.mode === "morph" || st.playing ? st.blend : 0,
					rot,
					zoom,
					folds: Math.max(2, folds),
					offset: st.offset + (reduced || st.frozen ? 0 : motion.offsetAmp),
					hue: st.hue + (reduced || st.frozen ? 0 : motion.hueAmp * Math.sin(elapsed * .45)),
					pulse: st.pulse * motion.pulseAmp,
					time: elapsed,
					refold: st.mode === "refold" || st.view === "cinema" && st.refoldLive,
					vignette: st.vignette
				});
			}
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
	(0, import_react.useEffect)(() => {
		const el = stageRef.current;
		if (!el) return;
		const onWheel = (e) => {
			if (useStudio.getState().view === "cinema" && !useStudio.getState().refoldLive) return;
			e.preventDefault();
			const z = useStudio.getState().zoom;
			const nextZ = Math.min(1.8, Math.max(.6, z + (e.deltaY > 0 ? -.045 : .045)));
			useStudio.getState().setZoom(nextZ);
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);
	const drag = (0, import_react.useRef)(null);
	const isPaused = cinema ? cinemaPaused : !playing;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-0 flex-1 flex-col items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: stageRef,
			className: "relative aspect-square w-full max-w-[min(100%,68vh)] touch-none",
			onPointerDown: (e) => {
				if (useStudio.getState().view === "cinema" && !useStudio.getState().refoldLive) return;
				e.currentTarget.setPointerCapture(e.pointerId);
				drag.current = {
					x: e.clientX,
					r: useStudio.getState().rotManual
				};
			},
			onPointerMove: (e) => {
				if (!drag.current) return;
				const dx = e.clientX - drag.current.x;
				useStudio.getState().setRotManual(drag.current.r + dx * .008);
			},
			onPointerUp: () => {
				drag.current = null;
			},
			onDoubleClick: () => {
				useStudio.getState().setRotManual(0);
				useStudio.getState().setZoom(1.05);
			},
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
					className: cn("absolute inset-0 size-full", (failed || hideCanvas) && "hidden"),
					"aria-label": `${plate.title} kaleidoscope loom`
				}),
				showVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CinemaPlayer, { hiddenVisually: refoldLive }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-3 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-full bg-void/70 px-4 py-1.5 text-center backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-sm text-cream",
							children: [cinema ? reel?.title ?? plate.title : selectedMorphSrc ? "Morph keyframe" : plate.title, !cinema && !selectedMorphSrc && blend > .04 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-gold",
								children: [" → ", next.title]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.22em] text-muted uppercase",
							children: cinema ? `${reelOrdinal(reel?.id ?? "") + 1} / ${REELS.length} · ${reel?.beat ?? "Reel"} · ${formatTimecode(reel?.durationSec ?? 0)} · ${loopLabel(loopMode)}` : `${plate.symmetry}-fold · ${plate.folds}${blend > .04 ? ` · blend ${Math.round(blend * 100)}%` : ""}`
						})]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transport, {
			isPaused,
			cinema
		})]
	});
}
function loopLabel(mode) {
	if (mode === "one") return "loop one";
	if (mode === "all") return "loop all";
	return "play once";
}
function Transport({ isPaused, cinema }) {
	const muted = useStudio((s) => s.muted);
	const loopMode = useStudio((s) => s.loopMode);
	const rate = useStudio((s) => s.rate);
	const refoldLive = useStudio((s) => s.refoldLive);
	const view = useStudio((s) => s.view);
	const s = useStudio.getState;
	const onStep = (dir) => {
		if (cinema) s().stepReel(dir);
		else s().stepPlate(dir);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex w-full max-w-[min(100%,68vh)] flex-col items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: view === "loom" ? "gold" : "ghost",
						"aria-pressed": view === "loom",
						onClick: () => s().setView("loom"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "size-3.5" }), "Loom"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: view === "cinema" ? "gold" : "ghost",
						"aria-pressed": view === "cinema",
						onClick: () => s().setView("cinema"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "size-3.5" }), "Cinema"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 hidden h-5 w-px bg-line sm:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "size-11",
						"aria-label": cinema ? "Previous reel" : "Previous plate",
						onClick: () => onStep(-1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "gold",
						className: "size-11",
						"aria-label": isPaused ? cinema ? "Play reel" : "Play sequence" : cinema ? "Pause reel" : "Pause sequence",
						onClick: () => s().togglePlaying(),
						children: isPaused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "size-11",
						"aria-label": cinema ? "Next reel" : "Next plate",
						onClick: () => onStep(1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					}),
					cinema && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "size-11",
							"aria-label": muted ? "Unmute" : "Mute",
							onClick: () => s().toggleMuted(),
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "size-11",
							"aria-label": `Loop ${loopMode}`,
							onClick: () => s().cycleLoopMode(),
							children: loopMode === "one" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat1, { className: "size-4 text-gold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: cn("size-4", loopMode === "all" && "text-gold") })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: refoldLive ? "gold" : "ghost",
							"aria-pressed": refoldLive,
							onClick: () => s().setRefoldLive(!refoldLive),
							title: "Feed the reel through the kaleidoscope",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), "Fold"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "rounded-md px-2 py-2 text-xs tabular-nums text-muted hover:text-cream",
							onClick: () => {
								const i = RATES.indexOf(rate);
								s().setRate(RATES[(i + 1) % RATES.length]);
							},
							"aria-label": `Playback speed ${rate}x`,
							children: [rate, "×"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "size-11",
							"aria-label": "Fullscreen",
							onClick: () => {
								const root = document.documentElement;
								if (document.fullscreenElement) document.exitFullscreen();
								else root.requestFullscreen?.();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-4" })
						})
					] })
				]
			}),
			cinema && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-full items-center gap-3 px-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CinemaScrubber, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden text-[0.65rem] tracking-wide text-muted sm:block",
				children: cinema ? "Space play · ← → skip · M mute · L loop · F full · 1–0 jump" : "Drag to rotate · scroll to zoom · double-click reset · Space play"
			})
		]
	});
}
function PlateRail() {
	const activeId = useStudio((s) => s.activeId);
	const setActive = useStudio((s) => s.setActive);
	const playPlateReel = useStudio((s) => s.playPlateReel);
	const view = useStudio((s) => s.view);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "loom-scroll flex gap-3 overflow-x-auto px-1 py-2",
		children: PLATES.map((p) => {
			const on = p.id === activeId;
			const hasReel = reelsForPlate(p.id).length > 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					if (view === "cinema" && hasReel) playPlateReel(p.id);
					else setActive(p.id);
				},
				onDoubleClick: () => {
					if (hasReel) playPlateReel(p.id);
				},
				className: "group w-20 shrink-0 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("relative block aspect-square overflow-hidden rounded-xl transition-[box-shadow,transform] duration-150", on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.src,
						alt: "",
						className: "size-full object-cover transition-transform duration-200 group-hover:scale-105"
					}), hasReel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 size-1.5 rounded-full bg-gold shadow-[0_0_0_2px_rgba(8,7,12,0.7)]" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("mt-1.5 block truncate text-[0.65rem] tracking-wide", on ? "text-gold" : "text-muted"),
					children: p.title
				})]
			}, p.id);
		})
	});
}
function ReelStrip() {
	const activeReelId = useStudio((s) => s.activeReelId);
	const view = useStudio((s) => s.view);
	const playReel = useStudio((s) => s.playReel);
	const activeBtn = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		activeBtn.current?.scrollIntoView({
			inline: "center",
			block: "nearest",
			behavior: "smooth"
		});
	}, [activeReelId, view]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-panel p-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.24em] text-gold uppercase",
				children: "Cinema catalog"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg text-cream",
				children: "Reels"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tabular-nums text-muted",
				children: [REELS.length, " loops"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "loom-scroll flex gap-2 overflow-x-auto pb-1",
			children: REELS.map((r) => {
				const on = view === "cinema" && r.id === activeReelId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					ref: on ? activeBtn : void 0,
					type: "button",
					onClick: () => playReel(r.id),
					className: "group w-24 shrink-0 text-left",
					"aria-pressed": on,
					"aria-label": `Play ${r.title}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("relative block aspect-square overflow-hidden rounded-xl transition-[box-shadow,transform] duration-150", on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: r.poster,
								alt: "",
								className: "size-full object-cover transition-transform duration-200 group-hover:scale-105"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0 grid place-items-center bg-void/25 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 text-cream" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-1 bottom-1 rounded bg-void/75 px-1 py-px font-mono text-xs text-gold",
								children: formatTimecode(r.durationSec)
							}),
							on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-0 bottom-0 h-0.5 bg-gold" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("mt-1.5 block truncate text-xs tracking-wide", on ? "text-gold" : "text-muted"),
						children: r.title.replace(" · ", " ")
					})]
				}, r.id);
			})
		})]
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
		id: "reels",
		label: "Reels",
		icon: Clapperboard
	},
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
	const activeReelId = useStudio((s) => s.activeReelId);
	const view = useStudio((s) => s.view);
	const playReel = useStudio((s) => s.playReel);
	const setLoopMode = useStudio((s) => s.setLoopMode);
	const loopMode = useStudio((s) => s.loopMode);
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
					children: "Cinema catalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Ten baked loops on the circular stage. One player, gapless loop, journey mode. Click a card to play."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "gold",
						onClick: () => {
							setLoopMode("all");
							playReel(REELS[0].id);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Play journey"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: loopMode === "one" ? "gold" : "line",
						onClick: () => setLoopMode("one"),
						children: "Loop one"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: loopMode === "all" ? "gold" : "line",
						onClick: () => setLoopMode("all"),
						children: "Loop all"
					})
				]
			}),
			REELS.map((r) => {
				const on = view === "cinema" && r.id === activeReelId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("overflow-hidden rounded-xl bg-ink shadow-[var(--shadow-border)]", on && "shadow-[var(--shadow-border-hover)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "relative block w-full",
						onClick: () => playReel(r.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: r.poster,
								alt: "",
								className: "aspect-square w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0 grid place-items-center bg-void/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-12 place-items-center rounded-full bg-gold text-void",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-5" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-2 bottom-2 rounded bg-void/80 px-1.5 py-0.5 font-mono text-[0.65rem] text-gold",
								children: formatTimecode(r.durationSec)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-cream",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: r.prompt
						})]
					})]
				}, r.id);
			})
		]
	});
}
function StudioApp() {
	const mode = useStudio((s) => s.mode);
	const setMode = useStudio((s) => s.setMode);
	const view = useStudio((s) => s.view);
	const setView = useStudio((s) => s.setView);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const t = e.target;
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
			const s = useStudio.getState();
			if (e.code === "Space") {
				e.preventDefault();
				s.togglePlaying();
				return;
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				if (s.view === "cinema") s.stepReel(-1);
				else s.stepPlate(-1);
				return;
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				if (s.view === "cinema") s.stepReel(1);
				else s.stepPlate(1);
				return;
			}
			if (e.key === "m" || e.key === "M") {
				s.toggleMuted();
				return;
			}
			if (e.key === "l" || e.key === "L") {
				s.cycleLoopMode();
				return;
			}
			if (e.key === "f" || e.key === "F") {
				if (document.fullscreenElement) document.exitFullscreen();
				else document.documentElement.requestFullscreen?.();
				return;
			}
			if (e.key === "c" || e.key === "C") {
				s.setView(s.view === "cinema" ? "loom" : "cinema");
				return;
			}
			if (e.key === "Escape") {
				if (s.view === "cinema") s.closeCinema();
				return;
			}
			if (e.key >= "1" && e.key <= "9") {
				const reel = REELS[Number(e.key) - 1];
				if (reel) s.playReel(reel.id);
				return;
			}
			if (e.key === "0") {
				const reel = REELS[9];
				if (reel) s.playReel(reel.id);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-void text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 border-b border-line px-4 py-2 sm:hidden",
				children: [[
					"plate",
					"morph",
					"refold"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m),
					className: cn("flex-1 rounded-full py-2 text-xs tracking-wide uppercase", view === "loom" && mode === m ? "bg-gold text-void" : "text-muted"),
					children: m
				}, m)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setView(view === "cinema" ? "loom" : "cinema"),
					className: cn("flex-1 rounded-full py-2 text-xs tracking-wide uppercase", view === "cinema" ? "bg-gold text-void" : "text-muted"),
					children: "cinema"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-line px-3 md:px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateRail, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 grid-cols-1 gap-4 p-3 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoStage, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelStrip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SequenceRail, {})
					]
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

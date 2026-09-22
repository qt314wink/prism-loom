import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Play, c as Locate, d as Eye, f as EyeOff, i as Plus, l as Grid3x3, n as Trash2, o as Pause, p as CircleHelp, r as RotateCcw, s as Minus, u as Frame } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Sz0iPQxI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.98] disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "text-muted hover:bg-fg/5 hover:text-fg",
			line: "text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			quiet: "text-muted hover:text-fg"
		},
		size: {
			sm: "h-9 px-3 text-sm",
			md: "h-10 px-3.5 text-sm",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "ghost",
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
var TRACE_COLORS = [
	"#8eb4d3",
	"#c4a882",
	"#88b39a",
	"#d0907c",
	"#b7a8c9",
	"#9bb8b0"
];
var ROLE_COLORS = {
	result: "#8eb4d3",
	envelope: "#c4a882",
	carrier: "#88b39a",
	companion: "#d0907c"
};
6 * Math.PI;
function colorForRole(role, index) {
	if (role && ROLE_COLORS[role]) return ROLE_COLORS[role];
	return TRACE_COLORS[index % TRACE_COLORS.length];
}
var PI$1 = Math.PI;
var SCORES = [
	{
		id: "damped",
		label: "Damped",
		family: "decay",
		law: "A dying oscillator. Amplitude is absorbed; frequency holds.",
		math: "A e^{−x/τ} sin(ωx)",
		see: "Champagne is the envelope. Green is the carrier. Blue is the product — the breath.",
		view: {
			xMin: 0,
			xMax: 6 * PI$1,
			yMin: -1.7,
			yMax: 1.7
		},
		traces: [
			{
				expr: "exp(-x/8)",
				role: "envelope"
			},
			{
				expr: "sin(3x)",
				role: "carrier"
			},
			{
				expr: "exp(-x/8)*sin(3x)",
				role: "result",
				fill: true
			}
		]
	},
	{
		id: "tangent",
		label: "Tangent",
		family: "shadow",
		law: "A ratio that goes to infinity when cosine is zero. Poles, not a wave.",
		math: "tan x = sin x / cos x",
		see: "The vertical breaks are asymptotes. tanh is the same gesture, bounded — a refraction analog.",
		view: {
			xMin: -2 * PI$1,
			xMax: 2 * PI$1,
			yMin: -6,
			yMax: 6
		},
		traces: [{
			expr: "tan(x)",
			role: "result"
		}, {
			expr: "tanh(x)",
			role: "companion"
		}]
	},
	{
		id: "beats",
		label: "Beats",
		family: "sound",
		law: "Two close frequencies. The slow envelope is the beat you hear.",
		math: "sin ω₁x + sin ω₂x",
		see: "Neither note is the pulse. The pulse is their interference.",
		view: {
			xMin: 0,
			xMax: 18 * PI$1,
			yMin: -2.4,
			yMax: 2.4
		},
		traces: [
			{
				expr: "sin(x)",
				role: "carrier"
			},
			{
				expr: "sin(1.15x)",
				role: "companion"
			},
			{
				expr: "sin(x)+sin(1.15x)",
				role: "result",
				fill: true
			}
		]
	},
	{
		id: "flare",
		label: "Flare",
		family: "light",
		law: "A gaussian well. Brightness as a localized pulse, not a blowout.",
		math: "e^{−x²/σ²}",
		see: "The bell is intensity. The odd companion is its slope — how light falls off.",
		view: {
			xMin: -5,
			xMax: 5,
			yMin: -.7,
			yMax: 1.25
		},
		traces: [{
			expr: "exp(-x^2 / 4)",
			role: "result",
			fill: true
		}, {
			expr: "x*exp(-x^2 / 4)",
			role: "companion"
		}]
	},
	{
		id: "diffraction",
		label: "Diffraction",
		family: "optics",
		law: "Aperture as sinc. Intensity is the square — the thing a screen records.",
		math: "sinc x  and  (sinc x)²",
		see: "Amplitude crosses zero and changes sign. Intensity never does. Nodes stay nodes.",
		view: {
			xMin: -8 * PI$1,
			xMax: 8 * PI$1,
			yMin: -.45,
			yMax: 1.2
		},
		traces: [{
			expr: "sinc(x)",
			role: "carrier"
		}, {
			expr: "sinc(x)^2",
			role: "result",
			fill: true
		}]
	},
	{
		id: "standing",
		label: "Standing",
		family: "wave",
		law: "Two traveling waves, opposite directions. Energy sloshes; nodes hold.",
		math: "sin x · cos t",
		see: "Press play. Blue is the standing mode. Green is the quadrature. They trade amplitude.",
		play: true,
		view: {
			xMin: -2 * PI$1,
			xMax: 2 * PI$1,
			yMin: -1.6,
			yMax: 1.6
		},
		traces: [
			{
				expr: "sin(x)*cos(t)",
				role: "result",
				fill: true
			},
			{
				expr: "cos(x)*sin(t)",
				role: "carrier"
			},
			{
				expr: "sin(x)",
				role: "envelope"
			}
		]
	},
	{
		id: "pulse",
		label: "Pulse",
		family: "signal",
		law: "A gaussian packet that breathes along x with time. No wrap jump.",
		math: "e^{−(x − 5 sin t)²}",
		see: "Press play. One well slides. The dimmer well is its opposite phase.",
		play: true,
		view: {
			xMin: -8,
			xMax: 8,
			yMin: -.15,
			yMax: 1.2
		},
		traces: [{
			expr: "exp(-(x - 5*sin(t))^2)",
			role: "result",
			fill: true
		}, {
			expr: "0.55*exp(-(x - 5*sin(t - pi))^2)",
			role: "companion"
		}]
	},
	{
		id: "absorb",
		label: "Absorb",
		family: "decay",
		law: "Beer–Lambert. Light through a density. Transmission falls; absorption saturates.",
		math: "e^{−αx}   and   1 − e^{−αx}",
		see: "Blue is what remains. Champagne is what was taken. They always sum to 1.",
		view: {
			xMin: 0,
			xMax: 8,
			yMin: -.15,
			yMax: 1.2
		},
		traces: [
			{
				expr: "exp(-x)",
				role: "result",
				fill: true
			},
			{
				expr: "1 - exp(-x)",
				role: "envelope"
			},
			{
				expr: "exp(-x/3)",
				role: "companion"
			}
		]
	},
	{
		id: "bend",
		label: "Bend",
		family: "refraction",
		law: "Three bounded maps of the same approach: a ray entering a denser medium.",
		math: "tanh x,  atan x,  x/√(1+x²)",
		see: "All three leave the line y=x and flatten. Different stiffness, same confession.",
		view: {
			xMin: -6,
			xMax: 6,
			yMin: -2.1,
			yMax: 2.1
		},
		traces: [
			{
				expr: "tanh(x)",
				role: "result"
			},
			{
				expr: "atan(x)",
				role: "carrier"
			},
			{
				expr: "x / sqrt(1 + x^2)",
				role: "companion"
			}
		]
	},
	{
		id: "harmonic",
		label: "Harmonic",
		family: "structure",
		law: "Partial sums of a Fourier saw. Pattern from repetition, not from a closed form.",
		math: "sin x + sin(2x)/2 + sin(3x)/3",
		see: "Each added overtone steepens the rise. The Gibbs ripple is the price of a sharp edge.",
		view: {
			xMin: -2 * PI$1,
			xMax: 2 * PI$1,
			yMin: -2.1,
			yMax: 2.1
		},
		traces: [
			{
				expr: "sin(x)",
				role: "envelope"
			},
			{
				expr: "sin(x)+sin(2x)/2",
				role: "carrier"
			},
			{
				expr: "sin(x)+sin(2x)/2+sin(3x)/3",
				role: "result"
			}
		]
	}
];
var SCORE_BY_ID = Object.fromEntries(SCORES.map((s) => [s.id, s]));
var DEFAULT_SCORE = SCORES[0];
var CONSTS = {
	pi: "pi",
	π: "pi",
	e: "e",
	tau: "tau",
	τ: "tau",
	phi: "phi",
	φ: "phi"
};
var CONST_VALUES = {
	pi: Math.PI,
	e: Math.E,
	tau: Math.PI * 2,
	phi: (1 + Math.sqrt(5)) / 2
};
function sinc(x) {
	if (x === 0) return 1;
	return Math.sin(x) / x;
}
var FUNCS = {
	sin: {
		n: 1,
		f: Math.sin
	},
	cos: {
		n: 1,
		f: Math.cos
	},
	tan: {
		n: 1,
		f: Math.tan
	},
	asin: {
		n: 1,
		f: Math.asin
	},
	acos: {
		n: 1,
		f: Math.acos
	},
	atan: {
		n: 1,
		f: Math.atan
	},
	atan2: {
		n: 2,
		f: Math.atan2
	},
	arcsin: {
		n: 1,
		f: Math.asin
	},
	arccos: {
		n: 1,
		f: Math.acos
	},
	arctan: {
		n: 1,
		f: Math.atan
	},
	sinh: {
		n: 1,
		f: Math.sinh
	},
	cosh: {
		n: 1,
		f: Math.cosh
	},
	tanh: {
		n: 1,
		f: Math.tanh
	},
	sech: {
		n: 1,
		f: (x) => 1 / Math.cosh(x)
	},
	asinh: {
		n: 1,
		f: Math.asinh
	},
	acosh: {
		n: 1,
		f: Math.acosh
	},
	atanh: {
		n: 1,
		f: Math.atanh
	},
	exp: {
		n: 1,
		f: Math.exp
	},
	ln: {
		n: 1,
		f: Math.log
	},
	log: {
		n: 1,
		f: Math.log10
	},
	log10: {
		n: 1,
		f: Math.log10
	},
	log2: {
		n: 1,
		f: Math.log2
	},
	sqrt: {
		n: 1,
		f: Math.sqrt
	},
	cbrt: {
		n: 1,
		f: Math.cbrt
	},
	abs: {
		n: 1,
		f: Math.abs
	},
	floor: {
		n: 1,
		f: Math.floor
	},
	ceil: {
		n: 1,
		f: Math.ceil
	},
	round: {
		n: 1,
		f: Math.round
	},
	sign: {
		n: 1,
		f: Math.sign
	},
	sgn: {
		n: 1,
		f: Math.sign
	},
	trunc: {
		n: 1,
		f: Math.trunc
	},
	min: {
		n: 2,
		f: Math.min
	},
	max: {
		n: 2,
		f: Math.max
	},
	pow: {
		n: 2,
		f: Math.pow
	},
	hypot: {
		n: 2,
		f: Math.hypot
	},
	sinc: {
		n: 1,
		f: sinc
	},
	sec: {
		n: 1,
		f: (x) => 1 / Math.cos(x)
	},
	csc: {
		n: 1,
		f: (x) => 1 / Math.sin(x)
	},
	cot: {
		n: 1,
		f: (x) => 1 / Math.tan(x)
	},
	mod: {
		n: 2,
		f: (a, b) => a % b
	},
	clamp: {
		n: 3,
		f: (x, lo, hi) => Math.min(hi, Math.max(lo, x))
	}
};
function isFunc(name) {
	return Object.prototype.hasOwnProperty.call(FUNCS, name.toLowerCase());
}
var PErr = class extends Error {
	index;
	constructor(message, index) {
		super(message);
		this.index = index;
	}
};
function tokenize(src) {
	const tokens = [];
	let i = 0;
	const n = src.length;
	while (i < n) {
		const c = src[i];
		if (c === " " || c === "	" || c === "\n" || c === "\r") {
			i += 1;
			continue;
		}
		if (c === "(") {
			tokens.push({
				type: "lparen",
				index: i
			});
			i += 1;
			continue;
		}
		if (c === ")") {
			tokens.push({
				type: "rparen",
				index: i
			});
			i += 1;
			continue;
		}
		if (c === ",") {
			tokens.push({
				type: "comma",
				index: i
			});
			i += 1;
			continue;
		}
		if ("+-*/^%".includes(c)) {
			tokens.push({
				type: "op",
				op: c,
				index: i
			});
			i += 1;
			continue;
		}
		if (c === "·" || c === "×") {
			tokens.push({
				type: "op",
				op: "*",
				index: i
			});
			i += 1;
			continue;
		}
		if (c === "π") {
			tokens.push({
				type: "ident",
				name: "pi",
				index: i
			});
			i += 1;
			continue;
		}
		if (c === "τ") {
			tokens.push({
				type: "ident",
				name: "tau",
				index: i
			});
			i += 1;
			continue;
		}
		if (c === "φ") {
			tokens.push({
				type: "ident",
				name: "phi",
				index: i
			});
			i += 1;
			continue;
		}
		if (c === "." || c >= "0" && c <= "9") {
			const start = i;
			let sawDot = c === ".";
			i += 1;
			while (i < n) {
				const d = src[i];
				if (d >= "0" && d <= "9") {
					i += 1;
					continue;
				}
				if (d === "." && !sawDot) {
					sawDot = true;
					i += 1;
					continue;
				}
				break;
			}
			if (i < n && (src[i] === "e" || src[i] === "E")) {
				const ePos = i;
				i += 1;
				if (i < n && (src[i] === "+" || src[i] === "-")) i += 1;
				const digitStart = i;
				while (i < n && src[i] >= "0" && src[i] <= "9") i += 1;
				if (i === digitStart) i = ePos;
			}
			const raw = src.slice(start, i);
			const value = Number(raw);
			if (!Number.isFinite(value)) throw new PErr(`Can't read number "${raw}"`, start);
			tokens.push({
				type: "num",
				value,
				index: start
			});
			continue;
		}
		if (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "_") {
			const start = i;
			i += 1;
			while (i < n) {
				const d = src[i];
				if (d >= "a" && d <= "z" || d >= "A" && d <= "Z" || d >= "0" && d <= "9" || d === "_") {
					i += 1;
					continue;
				}
				break;
			}
			tokens.push({
				type: "ident",
				name: src.slice(start, i),
				index: start
			});
			continue;
		}
		throw new PErr(`Unexpected "${c}"`, i);
	}
	tokens.push({
		type: "eof",
		index: n
	});
	return insertImplicitMul(tokens);
}
function valueStart(t) {
	return t.type === "num" || t.type === "ident" || t.type === "lparen";
}
function valueEnd(t) {
	return t.type === "num" || t.type === "ident" || t.type === "rparen";
}
function isKnownValueName(name) {
	const n = name.toLowerCase();
	return n === "x" || n === "t" || Boolean(CONSTS[n]);
}
function insertImplicitMul(tokens) {
	const out = [];
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i];
		if (out.length > 0) {
			const prev = out[out.length - 1];
			if (valueEnd(prev) && valueStart(t)) {
				if (prev.type === "ident" && t.type === "lparen") {
					if (isKnownValueName(prev.name)) out.push({
						type: "op",
						op: "*",
						index: t.index
					});
				} else out.push({
					type: "op",
					op: "*",
					index: t.index
				});
			}
		}
		out.push(t);
	}
	return out;
}
var Parser = class {
	i = 0;
	tokens;
	constructor(tokens) {
		this.tokens = tokens;
	}
	peek() {
		return this.tokens[this.i] ?? this.tokens[this.tokens.length - 1];
	}
	eat() {
		const t = this.peek();
		if (t.type !== "eof") this.i += 1;
		return t;
	}
	parse() {
		const ast = this.expr();
		const t = this.peek();
		if (t.type !== "eof") {
			if (t.type === "rparen") throw new PErr("Extra closing parenthesis", t.index);
			throw new PErr("Unexpected extra input", t.index);
		}
		return ast;
	}
	expr() {
		let left = this.term();
		for (;;) {
			const t = this.peek();
			if (t.type === "op" && (t.op === "+" || t.op === "-")) {
				this.eat();
				left = {
					type: "bin",
					op: t.op,
					left,
					right: this.term()
				};
				continue;
			}
			break;
		}
		return left;
	}
	term() {
		let left = this.unary();
		for (;;) {
			const t = this.peek();
			if (t.type === "op" && (t.op === "*" || t.op === "/" || t.op === "%")) {
				this.eat();
				left = {
					type: "bin",
					op: t.op,
					left,
					right: this.unary()
				};
				continue;
			}
			break;
		}
		return left;
	}
	unary() {
		const t = this.peek();
		if (t.type === "op" && (t.op === "+" || t.op === "-")) {
			this.eat();
			return {
				type: "unary",
				op: t.op,
				arg: this.unary()
			};
		}
		return this.power();
	}
	power() {
		const base = this.primary();
		const t = this.peek();
		if (t.type === "op" && t.op === "^") {
			this.eat();
			return {
				type: "bin",
				op: "^",
				left: base,
				right: this.unary()
			};
		}
		return base;
	}
	primary() {
		const t = this.peek();
		if (t.type === "num") {
			this.eat();
			return {
				type: "num",
				value: t.value
			};
		}
		if (t.type === "ident") {
			this.eat();
			const name = t.name.toLowerCase();
			if (this.peek().type === "lparen") {
				if (!isFunc(name)) throw new PErr(`Unknown function "${t.name}"`, t.index);
				this.eat();
				const args = [];
				if (this.peek().type !== "rparen") {
					args.push(this.expr());
					while (this.peek().type === "comma") {
						this.eat();
						args.push(this.expr());
					}
				}
				const close = this.peek();
				if (close.type !== "rparen") throw new PErr("Missing closing ')'", close.index);
				this.eat();
				const spec = FUNCS[name];
				if (args.length !== spec.n) throw new PErr(`${name} takes ${spec.n} argument${spec.n === 1 ? "" : "s"}`, t.index);
				return {
					type: "call",
					name,
					args
				};
			}
			if (name === "x" || name === "t") return {
				type: "var",
				name
			};
			if (CONSTS[name]) return {
				type: "const",
				name: CONSTS[name]
			};
			if (isFunc(name)) throw new PErr(`${name} needs parentheses, e.g. ${name}(x)`, t.index);
			throw new PErr(`Unknown name "${t.name}". Use x, t, pi, e, or a function.`, t.index);
		}
		if (t.type === "lparen") {
			this.eat();
			const inner = this.expr();
			const close = this.peek();
			if (close.type !== "rparen") throw new PErr("Missing closing ')'", close.index);
			this.eat();
			return inner;
		}
		if (t.type === "rparen") throw new PErr("Unexpected ')'", t.index);
		if (t.type === "comma") throw new PErr("Unexpected comma", t.index);
		if (t.type === "eof") throw new PErr("Expression is incomplete", t.index);
		if (t.type === "op") throw new PErr(`Unexpected operator "${t.op}"`, t.index);
		throw new PErr("Expected a number, x, t, or '('", 0);
	}
};
function parse(src) {
	const trimmed = src.trim();
	if (!trimmed) return {
		ok: false,
		error: "Enter an expression in x (and t)",
		index: 0
	};
	try {
		return {
			ok: true,
			ast: new Parser(tokenize(trimmed)).parse()
		};
	} catch (err) {
		if (err instanceof PErr) return {
			ok: false,
			error: err.message,
			index: err.index
		};
		return {
			ok: false,
			error: "Could not parse expression",
			index: 0
		};
	}
}
function evaluate(ast, x, t = 0) {
	switch (ast.type) {
		case "num": return ast.value;
		case "var": return ast.name === "t" ? t : x;
		case "const": return CONST_VALUES[ast.name];
		case "unary": {
			const v = evaluate(ast.arg, x, t);
			return ast.op === "-" ? -v : v;
		}
		case "bin": {
			const l = evaluate(ast.left, x, t);
			const r = evaluate(ast.right, x, t);
			switch (ast.op) {
				case "+": return l + r;
				case "-": return l - r;
				case "*": return l * r;
				case "/": return l / r;
				case "%": return l % r;
				case "^": return Math.pow(l, r);
				default: return NaN;
			}
		}
		case "call": {
			const spec = FUNCS[ast.name];
			if (!spec) return NaN;
			const args = ast.args.map((a) => evaluate(a, x, t));
			return spec.f(...args);
		}
		default: return NaN;
	}
}
function usesTime(ast) {
	switch (ast.type) {
		case "var": return ast.name === "t";
		case "unary": return usesTime(ast.arg);
		case "bin": return usesTime(ast.left) || usesTime(ast.right);
		case "call": return ast.args.some(usesTime);
		default: return false;
	}
}
function formatValue(n) {
	if (!Number.isFinite(n)) return "undefined";
	const a = Math.abs(n);
	if (a !== 0 && (a >= 1e6 || a < 1e-4)) return n.toExponential(4).replace(/e\+/, "e");
	const s = n.toPrecision(6);
	const num = Number(s);
	if (!Number.isFinite(num)) return s;
	return String(num);
}
var TAU$1 = Math.PI * 2;
var OMEGA = .85;
function uid() {
	return Math.random().toString(36).slice(2, 9);
}
function compile(expr) {
	const trimmed = expr.trim();
	if (!trimmed) return {
		ast: null,
		error: null
	};
	const r = parse(trimmed);
	if (!r.ok) return {
		ast: null,
		error: r.error
	};
	return {
		ast: r.ast,
		error: null
	};
}
function makeTrace(expr, color, role, fill) {
	const { ast, error } = compile(expr);
	return {
		id: uid(),
		expr,
		color,
		visible: true,
		ast,
		error,
		role,
		fill
	};
}
function tracesFromScore(score) {
	return score.traces.map((tr, i) => makeTrace(tr.expr, colorForRole(tr.role, i), tr.role, tr.fill));
}
function clampView(v) {
	let { xMin, xMax, yMin, yMax } = v;
	if (!(xMax > xMin)) {
		xMin = -10;
		xMax = 10;
	}
	if (!(yMax > yMin)) {
		yMin = -6;
		yMax = 6;
	}
	const xSpan = xMax - xMin;
	const ySpan = yMax - yMin;
	const minSpan = 1e-6;
	const maxSpan = 1e8;
	if (xSpan < minSpan) {
		const m = (xMin + xMax) / 2;
		xMin = m - minSpan / 2;
		xMax = m + minSpan / 2;
	}
	if (ySpan < minSpan) {
		const m = (yMin + yMax) / 2;
		yMin = m - minSpan / 2;
		yMax = m + minSpan / 2;
	}
	if (xSpan > maxSpan) {
		const m = (xMin + xMax) / 2;
		xMin = m - maxSpan / 2;
		xMax = m + maxSpan / 2;
	}
	if (ySpan > maxSpan) {
		const m = (yMin + yMax) / 2;
		yMin = m - maxSpan / 2;
		yMax = m + maxSpan / 2;
	}
	return {
		xMin,
		xMax,
		yMin,
		yMax
	};
}
function wrapT(t) {
	return (t % TAU$1 + TAU$1) % TAU$1;
}
var initialTraces = tracesFromScore(DEFAULT_SCORE);
var usePlotStore = create((set, get) => ({
	traces: initialTraces,
	activeId: initialTraces[0].id,
	view: { ...DEFAULT_SCORE.view },
	grid: true,
	axes: true,
	t: 0,
	playing: false,
	scoreId: DEFAULT_SCORE.id,
	setExpr: (id, expr) => set((s) => ({ traces: s.traces.map((tr) => {
		if (tr.id !== id) return tr;
		const { ast, error } = compile(expr);
		if (error) return {
			...tr,
			expr,
			error
		};
		return {
			...tr,
			expr,
			ast,
			error: null
		};
	}) })),
	setActive: (id) => set({ activeId: id }),
	addTrace: (expr = "") => set((s) => {
		if (s.traces.length >= 6) return s;
		const used = new Set(s.traces.map((t) => t.color));
		const tr = makeTrace(expr, TRACE_COLORS.find((c) => !used.has(c)) ?? TRACE_COLORS[s.traces.length % TRACE_COLORS.length]);
		return {
			traces: [...s.traces, tr],
			activeId: tr.id
		};
	}),
	removeTrace: (id) => set((s) => {
		if (s.traces.length <= 1) {
			const keep = s.traces[0];
			if (!keep) return s;
			return {
				traces: [{
					...keep,
					expr: "",
					ast: null,
					error: null
				}],
				activeId: keep.id
			};
		}
		const traces = s.traces.filter((t) => t.id !== id);
		return {
			traces,
			activeId: s.activeId === id ? traces[0].id : s.activeId
		};
	}),
	toggleTrace: (id) => set((s) => ({ traces: s.traces.map((t) => t.id === id ? {
		...t,
		visible: !t.visible
	} : t) })),
	loadScore: (id) => {
		const score = SCORE_BY_ID[id];
		if (!score) return;
		const traces = tracesFromScore(score);
		set({
			traces,
			activeId: traces[0].id,
			view: clampView(score.view),
			scoreId: score.id,
			t: 0,
			playing: Boolean(score.play)
		});
	},
	loadExample: (expr) => {
		const s = get();
		const active = s.traces.find((t) => t.id === s.activeId) ?? s.traces[0];
		if (!active) {
			get().addTrace(expr);
			return;
		}
		get().setExpr(active.id, expr);
	},
	setView: (view) => set({ view: clampView(view) }),
	resetView: () => {
		const id = get().scoreId;
		set({ view: clampView((id ? SCORE_BY_ID[id] : null)?.view ?? DEFAULT_SCORE.view) });
	},
	pan: (dxWorld, dyWorld) => set((s) => ({ view: clampView({
		xMin: s.view.xMin + dxWorld,
		xMax: s.view.xMax + dxWorld,
		yMin: s.view.yMin + dyWorld,
		yMax: s.view.yMax + dyWorld
	}) })),
	zoomAt: (wx, wy, factor) => set((s) => {
		const { xMin, xMax, yMin, yMax } = s.view;
		return { view: clampView({
			xMin: wx - (wx - xMin) * factor,
			xMax: wx + (xMax - wx) * factor,
			yMin: wy - (wy - yMin) * factor,
			yMax: wy + (yMax - wy) * factor
		}) };
	}),
	fitY: () => {
		const { traces, view, t } = get();
		const ys = [];
		const n = 320;
		const dx = (view.xMax - view.xMin) / n;
		for (const tr of traces) {
			if (!tr.visible || !tr.ast) continue;
			for (let i = 0; i <= n; i++) {
				const y = evaluate(tr.ast, view.xMin + i * dx, t);
				if (Number.isFinite(y) && Math.abs(y) < 1e6) ys.push(y);
			}
		}
		if (ys.length < 4) return;
		let lo = Math.min(...ys);
		let hi = Math.max(...ys);
		if (hi - lo < 1e-6) {
			lo -= 1;
			hi += 1;
		}
		const pad = (hi - lo) * .12;
		get().setView({
			...view,
			yMin: lo - pad,
			yMax: hi + pad
		});
	},
	toggleGrid: () => set((s) => ({ grid: !s.grid })),
	toggleAxes: () => set((s) => ({ axes: !s.axes })),
	setT: (t) => set({ t: wrapT(t) }),
	advanceT: (dt) => set((s) => ({ t: wrapT(s.t + dt * OMEGA) })),
	togglePlay: () => set((s) => ({ playing: !s.playing })),
	setPlaying: (playing) => set({ playing })
}));
function EquationDock() {
	const traces = usePlotStore((s) => s.traces);
	const activeId = usePlotStore((s) => s.activeId);
	const scoreId = usePlotStore((s) => s.scoreId);
	const setExpr = usePlotStore((s) => s.setExpr);
	const setActive = usePlotStore((s) => s.setActive);
	const addTrace = usePlotStore((s) => s.addTrace);
	const removeTrace = usePlotStore((s) => s.removeTrace);
	const toggleTrace = usePlotStore((s) => s.toggleTrace);
	const score = scoreId ? SCORE_BY_ID[scoreId] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-h-[42%] min-w-0 overflow-x-hidden overflow-y-auto border-t border-line bg-surface px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:max-h-[38%] sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0",
				children: score ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tracking-[0.14em] text-fg uppercase",
							children: score.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-faint",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: score.math
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 line-clamp-2 text-xs text-muted",
					children: score.see
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-muted uppercase",
					children: "Equations"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "line",
				className: "h-9 shrink-0 gap-1.5",
				onClick: () => addTrace(""),
				disabled: traces.length >= 6,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "size-3.5",
					strokeWidth: 1.75
				}), "Add"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: traces.map((tr, i) => {
				const active = tr.id === activeId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center gap-2 rounded-lg bg-elevated py-1.5 pr-1.5 pl-2 shadow-[var(--shadow-border)]", active && "shadow-[var(--shadow-border-hover)]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2.5 shrink-0 rounded-full",
							style: {
								background: tr.color,
								opacity: tr.visible ? 1 : .35
							},
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden shrink-0 font-mono text-xs text-muted sm:inline",
							children: [
								"y",
								i + 1,
								" ="
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tr.expr,
							onChange: (e) => setExpr(tr.id, e.target.value),
							onFocus: () => setActive(tr.id),
							spellCheck: false,
							autoCapitalize: "off",
							autoCorrect: "off",
							placeholder: "sin(x)",
							"aria-label": `Function ${i + 1}`,
							"aria-invalid": Boolean(tr.error),
							className: cn("min-h-11 min-w-0 flex-1 bg-transparent px-1 font-mono text-sm text-fg outline-none placeholder:text-faint", tr.error && "text-warn")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "quiet",
							className: "size-11 shrink-0",
							"aria-label": tr.visible ? "Hide" : "Show",
							onClick: () => toggleTrace(tr.id),
							children: tr.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
								className: "size-4",
								strokeWidth: 1.75
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "quiet",
							className: "size-11 shrink-0",
							"aria-label": "Remove function",
							onClick: () => removeTrace(tr.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "size-4",
								strokeWidth: 1.75
							})
						})
					]
				}), tr.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 pl-5 font-mono text-xs text-warn",
					role: "alert",
					children: tr.error
				}) : null] }, tr.id);
			})
		})]
	});
}
var PI = Math.PI;
function niceNum(span, target) {
	const raw = span / Math.max(target, 1);
	if (!(raw > 0) || !Number.isFinite(raw)) return 1;
	const pow = Math.pow(10, Math.floor(Math.log10(raw)));
	const n = raw / pow;
	if (n < 1.5) return pow;
	if (n < 3.5) return 2 * pow;
	if (n < 7.5) return 5 * pow;
	return 10 * pow;
}
var PI_STEPS = [
	PI / 6,
	PI / 4,
	PI / 3,
	PI / 2,
	PI,
	2 * PI
];
function pickStep(min, max, target) {
	const span = max - min;
	const nice = niceNum(span, target);
	let best = null;
	for (const p of PI_STEPS) {
		const count = span / p;
		if (count < 2 || count > target * 2.2) continue;
		const score = Math.abs(count - target);
		if (!best || score < best.score) best = {
			step: p,
			score
		};
	}
	if (best && Math.abs(Math.log(best.step / nice)) < .45) return {
		step: best.step,
		pi: true
	};
	return {
		step: nice,
		pi: false
	};
}
function gcd(a, b) {
	let x = Math.abs(a);
	let y = Math.abs(b);
	while (y) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x || 1;
}
function formatPi(v) {
	const k = v / PI;
	for (const d of [
		1,
		2,
		3,
		4,
		6
	]) {
		const num = Math.round(k * d);
		if (Math.abs(k * d - num) < 1e-6) {
			if (num === 0) return "0";
			const g = gcd(num, d);
			const n = num / g;
			const den = d / g;
			const sign = n < 0 ? "−" : "";
			const an = Math.abs(n);
			if (den === 1) return an === 1 ? `${sign}π` : `${sign}${an}π`;
			return `${sign}${an === 1 ? "π" : `${an}π`}/${den}`;
		}
	}
	return null;
}
function formatPlain(v, step) {
	if (Math.abs(v) < step * 1e-9) return "0";
	const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(step)) + 1));
	const s = v.toFixed(decimals).replace(/\.?0+$/, "");
	return s === "-0" ? "0" : s.replace("-", "−");
}
function axisTicks(min, max, target = 8) {
	if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [];
	const { step, pi } = pickStep(min, max, target);
	if (!(step > 0)) return [];
	const start = Math.ceil((min - step * 1e-9) / step) * step;
	const ticks = [];
	const limit = max + step * 1e-9;
	let guard = 0;
	for (let v = start; v <= limit; v += step) {
		const value = Math.abs(v) < step * 1e-9 ? 0 : v;
		const label = pi ? formatPi(value) ?? formatPlain(value, step) : formatPlain(value, step);
		ticks.push({
			value,
			label
		});
		guard += 1;
		if (guard > 40) break;
	}
	return ticks;
}
function minorStep(major) {
	const n = Math.round(major / Math.pow(10, Math.floor(Math.log10(major))));
	if (n === 1 || n === 5 || n === 10) return major / 5;
	if (n === 2) return major / 4;
	if (Math.abs(major - Math.PI) < 1e-9) return Math.PI / 4;
	if (Math.abs(major - Math.PI / 2) < 1e-9) return Math.PI / 6;
	return major / 4;
}
var PAD = {
	l: 54,
	r: 18,
	t: 16,
	b: 34
};
function plotSize(w, h) {
	return {
		w: Math.max(40, w - PAD.l - PAD.r),
		h: Math.max(40, h - PAD.t - PAD.b)
	};
}
function toScreen(view, w, h, x, y) {
	const p = plotSize(w, h);
	return {
		sx: PAD.l + (x - view.xMin) / (view.xMax - view.xMin) * p.w,
		sy: PAD.t + (view.yMax - y) / (view.yMax - view.yMin) * p.h
	};
}
function toWorld(view, w, h, sx, sy) {
	const p = plotSize(w, h);
	return {
		x: view.xMin + (sx - PAD.l) / p.w * (view.xMax - view.xMin),
		y: view.yMax - (sy - PAD.t) / p.h * (view.yMax - view.yMin)
	};
}
function sampleTrace(ast, view, width, t) {
	const n = Math.max(240, Math.ceil(width * 2.2));
	const dx = (view.xMax - view.xMin) / n;
	const yJump = (view.yMax - view.yMin) * 1.8;
	const segs = [];
	let cur = [];
	let prevY = NaN;
	for (let i = 0; i <= n; i++) {
		const x = view.xMin + i * dx;
		const y = evaluate(ast, x, t);
		if (!Number.isFinite(y)) {
			if (cur.length > 1) segs.push(cur);
			cur = [];
			prevY = NaN;
			continue;
		}
		if (Number.isFinite(prevY) && Math.abs(y - prevY) > yJump && Math.sign(y) !== Math.sign(prevY)) {
			if (cur.length > 1) segs.push(cur);
			cur = [{
				x,
				y
			}];
		} else cur.push({
			x,
			y
		});
		prevY = y;
	}
	if (cur.length > 1) segs.push(cur);
	return segs;
}
function readCss(name, fallback) {
	if (typeof window === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function strokeFor(tr) {
	if (tr.role === "envelope") return {
		width: 1.35,
		dash: [6, 5]
	};
	if (tr.role === "carrier") return {
		width: 1.5,
		dash: []
	};
	if (tr.role === "companion") return {
		width: 1.6,
		dash: []
	};
	return {
		width: 2.2,
		dash: []
	};
}
function GraphCanvas() {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const traces = usePlotStore((s) => s.traces);
	const view = usePlotStore((s) => s.view);
	const grid = usePlotStore((s) => s.grid);
	const axes = usePlotStore((s) => s.axes);
	const t = usePlotStore((s) => s.t);
	const [cursor, setCursor] = (0, import_react.useState)(null);
	const [size, setSize] = (0, import_react.useState)({
		w: 800,
		h: 500
	});
	const pointers = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const pinch = (0, import_react.useRef)(null);
	const dragging = (0, import_react.useRef)(false);
	const sizeRef = (0, import_react.useRef)(size);
	sizeRef.current = size;
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const cr = entries[0]?.contentRect;
			if (!cr) return;
			setSize({
				w: Math.max(1, cr.width),
				h: Math.max(1, cr.height)
			});
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	const draw = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const w = size.w;
		const h = size.h;
		const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
		canvas.width = Math.floor(w * dpr);
		canvas.height = Math.floor(h * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		const bg = readCss("--color-bg", "#0c0d0f");
		const faint = readCss("--color-faint", "#5c5e5b");
		const muted = readCss("--color-muted", "#8c8e8b");
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, w, h);
		const p = plotSize(w, h);
		ctx.save();
		ctx.beginPath();
		ctx.rect(PAD.l, PAD.t, p.w, p.h);
		ctx.clip();
		const xTicks = axisTicks(view.xMin, view.xMax, Math.max(4, Math.round(p.w / 90)));
		const yTicks = axisTicks(view.yMin, view.yMax, Math.max(4, Math.round(p.h / 64)));
		const xMajor = xTicks.length >= 2 ? xTicks[1].value - xTicks[0].value : 1;
		const yMajor = yTicks.length >= 2 ? yTicks[1].value - yTicks[0].value : 1;
		if (grid) {
			const mx = minorStep(xMajor);
			const my = minorStep(yMajor);
			ctx.strokeStyle = "rgba(236,236,232,0.045)";
			ctx.lineWidth = 1;
			if (mx && p.w / ((view.xMax - view.xMin) / mx) > 10) {
				const start = Math.ceil(view.xMin / mx) * mx;
				ctx.beginPath();
				for (let x = start; x <= view.xMax + 1e-12; x += mx) {
					const { sx } = toScreen(view, w, h, x, 0);
					ctx.moveTo(sx, PAD.t);
					ctx.lineTo(sx, PAD.t + p.h);
				}
				ctx.stroke();
			}
			if (my && p.h / ((view.yMax - view.yMin) / my) > 10) {
				const start = Math.ceil(view.yMin / my) * my;
				ctx.beginPath();
				for (let y = start; y <= view.yMax + 1e-12; y += my) {
					const { sy } = toScreen(view, w, h, 0, y);
					ctx.moveTo(PAD.l, sy);
					ctx.lineTo(PAD.l + p.w, sy);
				}
				ctx.stroke();
			}
			ctx.strokeStyle = "rgba(236,236,232,0.10)";
			ctx.beginPath();
			for (const tick of xTicks) {
				const { sx } = toScreen(view, w, h, tick.value, 0);
				ctx.moveTo(sx, PAD.t);
				ctx.lineTo(sx, PAD.t + p.h);
			}
			for (const tick of yTicks) {
				const { sy } = toScreen(view, w, h, 0, tick.value);
				ctx.moveTo(PAD.l, sy);
				ctx.lineTo(PAD.l + p.w, sy);
			}
			ctx.stroke();
		}
		if (axes) {
			ctx.strokeStyle = "rgba(236,236,232,0.42)";
			ctx.lineWidth = 1.25;
			ctx.beginPath();
			if (view.yMin < 0 && view.yMax > 0) {
				const { sy } = toScreen(view, w, h, 0, 0);
				ctx.moveTo(PAD.l, sy);
				ctx.lineTo(PAD.l + p.w, sy);
			}
			if (view.xMin < 0 && view.xMax > 0) {
				const { sx } = toScreen(view, w, h, 0, 0);
				ctx.moveTo(sx, PAD.t);
				ctx.lineTo(sx, PAD.t + p.h);
			}
			ctx.stroke();
		}
		const state = usePlotStore.getState();
		for (const tr of state.traces) {
			if (!tr.visible || !tr.ast) continue;
			const segs = sampleTrace(tr.ast, view, p.w, t);
			const stroke = strokeFor(tr);
			if (tr.fill) {
				const axis = toScreen(view, w, h, 0, 0);
				ctx.fillStyle = tr.color;
				for (const seg of segs) {
					if (seg.length < 2) continue;
					ctx.beginPath();
					for (let i = 0; i < seg.length; i++) {
						const { sx, sy } = toScreen(view, w, h, seg[i].x, seg[i].y);
						if (i === 0) ctx.moveTo(sx, sy);
						else ctx.lineTo(sx, sy);
					}
					const last = seg[seg.length - 1];
					const first = seg[0];
					ctx.lineTo(toScreen(view, w, h, last.x, 0).sx, axis.sy);
					ctx.lineTo(toScreen(view, w, h, first.x, 0).sx, axis.sy);
					ctx.closePath();
					ctx.globalAlpha = .13;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
			}
			ctx.strokeStyle = tr.color;
			ctx.lineWidth = stroke.width;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.setLineDash(stroke.dash);
			ctx.globalAlpha = tr.error ? .4 : 1;
			for (const seg of segs) {
				ctx.beginPath();
				for (let i = 0; i < seg.length; i++) {
					const { sx, sy } = toScreen(view, w, h, seg[i].x, seg[i].y);
					if (i === 0) ctx.moveTo(sx, sy);
					else ctx.lineTo(sx, sy);
				}
				ctx.stroke();
			}
			ctx.setLineDash([]);
			ctx.globalAlpha = 1;
		}
		if (cursor) {
			ctx.strokeStyle = "rgba(236,236,232,0.28)";
			ctx.lineWidth = 1;
			ctx.setLineDash([4, 4]);
			ctx.beginPath();
			ctx.moveTo(cursor.sx, PAD.t);
			ctx.lineTo(cursor.sx, PAD.t + p.h);
			ctx.moveTo(PAD.l, cursor.sy);
			ctx.lineTo(PAD.l + p.w, cursor.sy);
			ctx.stroke();
			ctx.setLineDash([]);
			for (const tr of state.traces) {
				if (!tr.visible || !tr.ast) continue;
				const y = evaluate(tr.ast, cursor.x, t);
				if (!Number.isFinite(y)) continue;
				if (y < view.yMin || y > view.yMax) continue;
				const { sy } = toScreen(view, w, h, cursor.x, y);
				ctx.fillStyle = tr.color;
				ctx.beginPath();
				ctx.arc(cursor.sx, sy, 4.5, 0, Math.PI * 2);
				ctx.fill();
				ctx.strokeStyle = bg;
				ctx.lineWidth = 1.5;
				ctx.stroke();
			}
		}
		ctx.restore();
		ctx.font = "11px 'IBM Plex Mono', ui-monospace, monospace";
		ctx.fillStyle = muted;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		for (const tick of xTicks) {
			const { sx } = toScreen(view, w, h, tick.value, 0);
			if (sx < PAD.l - 4 || sx > PAD.l + p.w + 4) continue;
			ctx.fillText(tick.label, sx, PAD.t + p.h + 8);
		}
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		for (const tick of yTicks) {
			const { sy } = toScreen(view, w, h, 0, tick.value);
			if (sy < PAD.t - 4 || sy > PAD.t + p.h + 4) continue;
			ctx.fillText(tick.label, PAD.l - 8, sy);
		}
		ctx.fillStyle = faint;
		ctx.font = "12px 'IBM Plex Sans', system-ui, sans-serif";
		ctx.textAlign = "right";
		ctx.textBaseline = "bottom";
		ctx.fillText("x", PAD.l + p.w, PAD.t + p.h - 6);
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("y", PAD.l + 8, PAD.t + 6);
		ctx.strokeStyle = "rgba(236,236,232,0.08)";
		ctx.strokeRect(PAD.l + .5, PAD.t + .5, p.w - 1, p.h - 1);
	}, [
		view,
		traces,
		grid,
		axes,
		cursor,
		size,
		t
	]);
	(0, import_react.useEffect)(() => {
		draw();
	}, [draw]);
	const eventToLocal = (e) => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		const r = canvas.getBoundingClientRect();
		return {
			sx: e.clientX - r.left,
			sy: e.clientY - r.top
		};
	};
	const updateCursor = (sx, sy) => {
		const { w, h } = sizeRef.current;
		const p = plotSize(w, h);
		if (sx < PAD.l || sy < PAD.t || sx > PAD.l + p.w || sy > PAD.t + p.h) {
			setCursor(null);
			return;
		}
		const world = toWorld(usePlotStore.getState().view, w, h, sx, sy);
		setCursor({
			sx,
			sy,
			x: world.x,
			y: world.y
		});
	};
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const onWheelNative = (e) => {
			e.preventDefault();
			const r = canvas.getBoundingClientRect();
			const loc = {
				sx: e.clientX - r.left,
				sy: e.clientY - r.top
			};
			let dy = e.deltaY;
			if (e.deltaMode === 1) dy *= 16;
			if (e.deltaMode === 2) dy *= 320;
			const factor = Math.exp(dy * .0016);
			const store = usePlotStore.getState();
			const { w, h } = sizeRef.current;
			const world = toWorld(store.view, w, h, loc.sx, loc.sy);
			store.zoomAt(world.x, world.y, factor);
			updateCursor(loc.sx, loc.sy);
		};
		canvas.addEventListener("wheel", onWheelNative, { passive: false });
		return () => canvas.removeEventListener("wheel", onWheelNative);
	}, []);
	const onPointerDown = (e) => {
		e.target.setPointerCapture(e.pointerId);
		pointers.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		if (pointers.current.size === 2) {
			const pts = [...pointers.current.values()];
			const dx = pts[0].x - pts[1].x;
			const dy = pts[0].y - pts[1].y;
			pinch.current = { dist: Math.hypot(dx, dy) };
			dragging.current = false;
		} else dragging.current = true;
	};
	const onPointerMove = (e) => {
		const loc = eventToLocal(e);
		if (loc) updateCursor(loc.sx, loc.sy);
		const prev = pointers.current.get(e.pointerId);
		pointers.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		const store = usePlotStore.getState();
		const { w, h } = sizeRef.current;
		if (pointers.current.size === 2 && pinch.current) {
			const pts = [...pointers.current.values()];
			const dx = pts[0].x - pts[1].x;
			const dy = pts[0].y - pts[1].y;
			const dist = Math.hypot(dx, dy);
			if (pinch.current.dist > 8 && dist > 8) {
				const factor = pinch.current.dist / dist;
				const mid = eventToLocal({
					clientX: (pts[0].x + pts[1].x) / 2,
					clientY: (pts[0].y + pts[1].y) / 2
				});
				if (mid) {
					const world = toWorld(store.view, w, h, mid.sx, mid.sy);
					store.zoomAt(world.x, world.y, factor);
				}
				pinch.current = { dist };
			}
			return;
		}
		if (dragging.current && prev && (e.buttons === 1 || e.pointerType === "touch")) {
			const p = plotSize(w, h);
			const dx = (e.clientX - prev.x) / p.w * (store.view.xMax - store.view.xMin);
			const dy = (e.clientY - prev.y) / p.h * (store.view.yMax - store.view.yMin);
			store.pan(-dx, dy);
		}
	};
	const onPointerUp = (e) => {
		pointers.current.delete(e.pointerId);
		if (pointers.current.size < 2) pinch.current = null;
		if (pointers.current.size === 0) dragging.current = false;
	};
	const onKeyDown = (e) => {
		const store = usePlotStore.getState();
		const { view: v } = store;
		const xSpan = v.xMax - v.xMin;
		const ySpan = v.yMax - v.yMin;
		if (e.key === "+" || e.key === "=") store.zoomAt((v.xMin + v.xMax) / 2, (v.yMin + v.yMax) / 2, .8);
		else if (e.key === "-" || e.key === "_") store.zoomAt((v.xMin + v.xMax) / 2, (v.yMin + v.yMax) / 2, 1.25);
		else if (e.key === "0") store.resetView();
		else if (e.key === "ArrowLeft") store.pan(-xSpan * .08, 0);
		else if (e.key === "ArrowRight") store.pan(xSpan * .08, 0);
		else if (e.key === "ArrowUp") store.pan(0, ySpan * .08);
		else if (e.key === "ArrowDown") store.pan(0, -ySpan * .08);
		else return;
		e.preventDefault();
	};
	const timeful = traces.some((tr) => tr.visible && tr.ast && usesTime(tr.ast));
	const ys = cursor == null ? [] : traces.filter((tr) => tr.visible && tr.ast).map((tr) => ({
		id: tr.id,
		expr: tr.expr,
		color: tr.color,
		y: evaluate(tr.ast, cursor.x, t)
	}));
	const readoutW = 196;
	const readoutLeft = cursor && cursor.sx + 16 + readoutW < size.w - 12 ? cursor.sx + 16 : (cursor?.sx ?? 0) - readoutW - 16;
	const readoutTop = cursor ? Math.min(Math.max(cursor.sy + 14, 12), size.h - 140) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative h-full min-h-0 w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "h-full w-full cursor-crosshair touch-none",
				style: {
					width: "100%",
					height: "100%"
				},
				tabIndex: 0,
				role: "img",
				"aria-label": "Function graph. Scroll to zoom, drag to pan, double-click to reset.",
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				onPointerLeave: () => {
					if (!dragging.current) setCursor(null);
				},
				onDoubleClick: () => usePlotStore.getState().resetView(),
				onKeyDown
			}),
			timeful ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute top-3 right-3 rounded-md bg-elevated/90 px-2.5 py-1 font-mono text-[11px] tabular-nums text-muted shadow-[var(--shadow-border)]",
				children: ["t ", formatValue(t)]
			}) : null,
			cursor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute z-10 min-w-44 rounded-lg bg-elevated/95 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm",
				style: {
					left: Math.max(8, readoutLeft),
					top: readoutTop
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4 font-mono text-xs tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "x"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatValue(cursor.x) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4 font-mono text-xs tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "y"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatValue(cursor.y) })]
					}),
					timeful ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4 font-mono text-xs tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "t"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatValue(t) })]
					}) : null,
					ys.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1.5 h-px bg-line" }) : null,
					ys.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3 font-mono text-xs tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-32 truncate",
							style: { color: row.color },
							children: row.expr
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatValue(row.y) })]
					}, row.id))
				]
			}) : null
		]
	});
}
var TAU = Math.PI * 2;
function PlotHeader() {
	const grid = usePlotStore((s) => s.grid);
	const axes = usePlotStore((s) => s.axes);
	const playing = usePlotStore((s) => s.playing);
	const t = usePlotStore((s) => s.t);
	const scoreId = usePlotStore((s) => s.scoreId);
	const loadScore = usePlotStore((s) => s.loadScore);
	const resetView = usePlotStore((s) => s.resetView);
	const fitY = usePlotStore((s) => s.fitY);
	const toggleGrid = usePlotStore((s) => s.toggleGrid);
	const toggleAxes = usePlotStore((s) => s.toggleAxes);
	const togglePlay = usePlotStore((s) => s.togglePlay);
	const setT = usePlotStore((s) => s.setT);
	const zoomAt = usePlotStore((s) => s.zoomAt);
	const view = usePlotStore((s) => s.view);
	const zoomCenter = (factor) => {
		zoomAt((view.xMin + view.xMax) / 2, (view.yMin + view.yMax) / 2, factor);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex min-w-0 flex-col gap-2 overflow-x-hidden border-b border-line bg-surface px-3 py-2.5 sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none tracking-tight",
						children: "Locus"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 hidden text-xs text-muted sm:block",
						children: "Laws of light, plotted"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						"aria-label": playing ? "Pause time" : "Play time",
						"aria-pressed": playing,
						onClick: togglePlay,
						className: playing ? "text-fg" : "text-muted",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
							className: "size-4",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: "size-4",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "hidden items-center gap-2 sm:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: TAU,
								step: .01,
								value: t,
								onChange: (e) => {
									usePlotStore.getState().setPlaying(false);
									setT(Number(e.target.value));
								},
								className: "h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-line accent-accent",
								"aria-label": "Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 font-mono text-[11px] tabular-nums text-muted",
								children: formatValue(t)
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "hidden sm:inline-flex",
							"aria-label": "Zoom in",
							onClick: () => zoomCenter(.8),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "hidden sm:inline-flex",
							"aria-label": "Zoom out",
							onClick: () => zoomCenter(1.25),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "hidden sm:inline-flex",
							"aria-label": "Fit vertical range",
							onClick: fitY,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Locate, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Reset view",
							onClick: resetView,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-pressed": grid,
							"aria-label": "Toggle grid",
							onClick: toggleGrid,
							className: grid ? "text-fg" : "text-faint",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-pressed": axes,
							"aria-label": "Toggle axes",
							onClick: toggleAxes,
							className: axes ? "text-fg" : "text-faint",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
								className: "size-4",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "How to write functions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, {
									className: "size-4",
									strokeWidth: 1.75
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
							side: "bottom",
							align: "end",
							sideOffset: 8,
							className: "z-50 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl bg-elevated p-4 text-sm text-fg shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Write y as a function of x"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted",
									children: "Operators + − * / ^ and implicit multiply (2x, 2sin(x)). Constants pi, e, tau, phi. Time variable t loops from 0 to 2π — press play, or Space."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-mono text-xs leading-relaxed text-muted",
									children: "sin cos tan tanh sech exp ln log sqrt abs floor ceil sign min max pow sinc clamp mod"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-faint",
									children: "Scroll to zoom, drag to pan, pinch on touch, double-click to reset. Keys: + − zoom, arrows pan, 0 reset, Space play."
								})
							]
						}) })] })
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "locus-scroll min-w-0 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5",
			children: SCORES.map((score) => {
				const active = score.id === scoreId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: score.law,
					onClick: () => loadScore(score.id),
					className: cn("h-8 shrink-0 rounded-full px-3 text-xs transition-colors duration-150", active ? "bg-fg text-bg" : "text-muted shadow-[var(--shadow-border)] hover:text-fg"),
					children: score.label
				}, score.id);
			})
		})]
	});
}
function PlotApp() {
	const playing = usePlotStore((s) => s.playing);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			usePlotStore.getState().advanceT(dt);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [playing]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const el = e.target;
			if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
			if (e.code === "Space") {
				e.preventDefault();
				usePlotStore.getState().togglePlay();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 min-w-0 flex-col overflow-x-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative min-h-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphCanvas, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EquationDock, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotApp, {});
}
//#endregion
export { Home as component };

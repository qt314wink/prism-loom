export type Ast =
  | { type: "num"; value: number }
  | { type: "var"; name: "x" | "t" }
  | { type: "const"; name: ConstName }
  | { type: "call"; name: string; args: Ast[] }
  | { type: "unary"; op: "+" | "-"; arg: Ast }
  | { type: "bin"; op: BinOp; left: Ast; right: Ast };

export type BinOp = "+" | "-" | "*" | "/" | "^" | "%";
export type ConstName = "pi" | "e" | "tau" | "phi";

export type ParseOk = { ok: true; ast: Ast };
export type ParseErr = { ok: false; error: string; index: number };
export type ParseResult = ParseOk | ParseErr;

type Tok =
  | { type: "num"; value: number; index: number }
  | { type: "ident"; name: string; index: number }
  | { type: "op"; op: string; index: number }
  | { type: "lparen"; index: number }
  | { type: "rparen"; index: number }
  | { type: "comma"; index: number }
  | { type: "eof"; index: number };

const CONSTS: Record<string, ConstName> = {
  pi: "pi",
  π: "pi",
  e: "e",
  tau: "tau",
  τ: "tau",
  phi: "phi",
  φ: "phi",
};

const CONST_VALUES: Record<ConstName, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
  phi: (1 + Math.sqrt(5)) / 2,
};

type FnSpec = { n: number; f: (...args: number[]) => number };

function sinc(x: number) {
  if (x === 0) return 1;
  return Math.sin(x) / x;
}

export const FUNCS: Record<string, FnSpec> = {
  sin: { n: 1, f: Math.sin },
  cos: { n: 1, f: Math.cos },
  tan: { n: 1, f: Math.tan },
  asin: { n: 1, f: Math.asin },
  acos: { n: 1, f: Math.acos },
  atan: { n: 1, f: Math.atan },
  atan2: { n: 2, f: Math.atan2 },
  arcsin: { n: 1, f: Math.asin },
  arccos: { n: 1, f: Math.acos },
  arctan: { n: 1, f: Math.atan },
  sinh: { n: 1, f: Math.sinh },
  cosh: { n: 1, f: Math.cosh },
  tanh: { n: 1, f: Math.tanh },
  sech: { n: 1, f: (x) => 1 / Math.cosh(x) },
  asinh: { n: 1, f: Math.asinh },
  acosh: { n: 1, f: Math.acosh },
  atanh: { n: 1, f: Math.atanh },
  exp: { n: 1, f: Math.exp },
  ln: { n: 1, f: Math.log },
  log: { n: 1, f: Math.log10 },
  log10: { n: 1, f: Math.log10 },
  log2: { n: 1, f: Math.log2 },
  sqrt: { n: 1, f: Math.sqrt },
  cbrt: { n: 1, f: Math.cbrt },
  abs: { n: 1, f: Math.abs },
  floor: { n: 1, f: Math.floor },
  ceil: { n: 1, f: Math.ceil },
  round: { n: 1, f: Math.round },
  sign: { n: 1, f: Math.sign },
  sgn: { n: 1, f: Math.sign },
  trunc: { n: 1, f: Math.trunc },
  min: { n: 2, f: Math.min },
  max: { n: 2, f: Math.max },
  pow: { n: 2, f: Math.pow },
  hypot: { n: 2, f: Math.hypot },
  sinc: { n: 1, f: sinc },
  sec: { n: 1, f: (x) => 1 / Math.cos(x) },
  csc: { n: 1, f: (x) => 1 / Math.sin(x) },
  cot: { n: 1, f: (x) => 1 / Math.tan(x) },
  mod: { n: 2, f: (a, b) => a % b },
  clamp: { n: 3, f: (x, lo, hi) => Math.min(hi, Math.max(lo, x)) },
};

function isFunc(name: string) {
  return Object.prototype.hasOwnProperty.call(FUNCS, name.toLowerCase());
}

class PErr extends Error {
  index: number;
  constructor(message: string, index: number) {
    super(message);
    this.index = index;
  }
}

function tokenize(src: string): Tok[] {
  const tokens: Tok[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i]!;
    if (c === " " || c === "\t" || c === "\n" || c === "\r") {
      i += 1;
      continue;
    }
    if (c === "(") {
      tokens.push({ type: "lparen", index: i });
      i += 1;
      continue;
    }
    if (c === ")") {
      tokens.push({ type: "rparen", index: i });
      i += 1;
      continue;
    }
    if (c === ",") {
      tokens.push({ type: "comma", index: i });
      i += 1;
      continue;
    }
    if ("+-*/^%".includes(c)) {
      tokens.push({ type: "op", op: c, index: i });
      i += 1;
      continue;
    }
    if (c === "·" || c === "×") {
      tokens.push({ type: "op", op: "*", index: i });
      i += 1;
      continue;
    }
    if (c === "π") {
      tokens.push({ type: "ident", name: "pi", index: i });
      i += 1;
      continue;
    }
    if (c === "τ") {
      tokens.push({ type: "ident", name: "tau", index: i });
      i += 1;
      continue;
    }
    if (c === "φ") {
      tokens.push({ type: "ident", name: "phi", index: i });
      i += 1;
      continue;
    }
    if (c === "." || (c >= "0" && c <= "9")) {
      const start = i;
      let sawDot = c === ".";
      i += 1;
      while (i < n) {
        const d = src[i]!;
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
        while (i < n && src[i]! >= "0" && src[i]! <= "9") i += 1;
        if (i === digitStart) i = ePos;
      }
      const raw = src.slice(start, i);
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new PErr(`Can't read number "${raw}"`, start);
      }
      tokens.push({ type: "num", value, index: start });
      continue;
    }
    if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_") {
      const start = i;
      i += 1;
      while (i < n) {
        const d = src[i]!;
        if ((d >= "a" && d <= "z") || (d >= "A" && d <= "Z") || (d >= "0" && d <= "9") || d === "_") {
          i += 1;
          continue;
        }
        break;
      }
      tokens.push({ type: "ident", name: src.slice(start, i), index: start });
      continue;
    }
    throw new PErr(`Unexpected "${c}"`, i);
  }
  tokens.push({ type: "eof", index: n });
  return insertImplicitMul(tokens);
}

function valueStart(t: Tok): boolean {
  return t.type === "num" || t.type === "ident" || t.type === "lparen";
}

function valueEnd(t: Tok): boolean {
  return t.type === "num" || t.type === "ident" || t.type === "rparen";
}

function isKnownValueName(name: string) {
  const n = name.toLowerCase();
  return n === "x" || n === "t" || Boolean(CONSTS[n]);
}

function insertImplicitMul(tokens: Tok[]): Tok[] {
  const out: Tok[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (out.length > 0) {
      const prev = out[out.length - 1]!;
      if (valueEnd(prev) && valueStart(t)) {
        const identParen = prev.type === "ident" && t.type === "lparen";
        if (identParen) {
          if (isKnownValueName(prev.name)) out.push({ type: "op", op: "*", index: t.index });
        } else {
          out.push({ type: "op", op: "*", index: t.index });
        }
      }
    }
    out.push(t);
  }
  return out;
}

class Parser {
  private i = 0;
  private tokens: Tok[];
  constructor(tokens: Tok[]) {
    this.tokens = tokens;
  }

  peek(): Tok {
    return this.tokens[this.i] ?? this.tokens[this.tokens.length - 1]!;
  }

  eat(): Tok {
    const t = this.peek();
    if (t.type !== "eof") this.i += 1;
    return t;
  }

  parse(): Ast {
    const ast = this.expr();
    const t = this.peek();
    if (t.type !== "eof") {
      if (t.type === "rparen") throw new PErr("Extra closing parenthesis", t.index);
      throw new PErr("Unexpected extra input", t.index);
    }
    return ast;
  }

  expr(): Ast {
    let left = this.term();
    for (;;) {
      const t = this.peek();
      if (t.type === "op" && (t.op === "+" || t.op === "-")) {
        this.eat();
        left = { type: "bin", op: t.op, left, right: this.term() };
        continue;
      }
      break;
    }
    return left;
  }

  term(): Ast {
    let left = this.unary();
    for (;;) {
      const t = this.peek();
      if (t.type === "op" && (t.op === "*" || t.op === "/" || t.op === "%")) {
        this.eat();
        left = { type: "bin", op: t.op, left, right: this.unary() };
        continue;
      }
      break;
    }
    return left;
  }

  unary(): Ast {
    const t = this.peek();
    if (t.type === "op" && (t.op === "+" || t.op === "-")) {
      this.eat();
      return { type: "unary", op: t.op, arg: this.unary() };
    }
    return this.power();
  }

  power(): Ast {
    const base = this.primary();
    const t = this.peek();
    if (t.type === "op" && t.op === "^") {
      this.eat();
      return { type: "bin", op: "^", left: base, right: this.unary() };
    }
    return base;
  }

  primary(): Ast {
    const t = this.peek();
    if (t.type === "num") {
      this.eat();
      return { type: "num", value: t.value };
    }
    if (t.type === "ident") {
      this.eat();
      const name = t.name.toLowerCase();
      if (this.peek().type === "lparen") {
        if (!isFunc(name)) {
          throw new PErr(`Unknown function "${t.name}"`, t.index);
        }
        this.eat();
        const args: Ast[] = [];
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
        const spec = FUNCS[name]!;
        if (args.length !== spec.n) {
          throw new PErr(`${name} takes ${spec.n} argument${spec.n === 1 ? "" : "s"}`, t.index);
        }
        return { type: "call", name, args };
      }
      if (name === "x" || name === "t") return { type: "var", name };
      if (CONSTS[name]) return { type: "const", name: CONSTS[name] };
      if (isFunc(name)) {
        throw new PErr(`${name} needs parentheses, e.g. ${name}(x)`, t.index);
      }
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
}

export function parse(src: string): ParseResult {
  const trimmed = src.trim();
  if (!trimmed) return { ok: false, error: "Enter an expression in x (and t)", index: 0 };
  try {
    const ast = new Parser(tokenize(trimmed)).parse();
    return { ok: true, ast };
  } catch (err) {
    if (err instanceof PErr) return { ok: false, error: err.message, index: err.index };
    return { ok: false, error: "Could not parse expression", index: 0 };
  }
}

export function evaluate(ast: Ast, x: number, t = 0): number {
  switch (ast.type) {
    case "num":
      return ast.value;
    case "var":
      return ast.name === "t" ? t : x;
    case "const":
      return CONST_VALUES[ast.name];
    case "unary": {
      const v = evaluate(ast.arg, x, t);
      return ast.op === "-" ? -v : v;
    }
    case "bin": {
      const l = evaluate(ast.left, x, t);
      const r = evaluate(ast.right, x, t);
      switch (ast.op) {
        case "+":
          return l + r;
        case "-":
          return l - r;
        case "*":
          return l * r;
        case "/":
          return l / r;
        case "%":
          return l % r;
        case "^":
          return Math.pow(l, r);
        default:
          return NaN;
      }
    }
    case "call": {
      const spec = FUNCS[ast.name];
      if (!spec) return NaN;
      const args = ast.args.map((a) => evaluate(a, x, t));
      return spec.f(...args);
    }
    default:
      return NaN;
  }
}

export function usesTime(ast: Ast): boolean {
  switch (ast.type) {
    case "var":
      return ast.name === "t";
    case "unary":
      return usesTime(ast.arg);
    case "bin":
      return usesTime(ast.left) || usesTime(ast.right);
    case "call":
      return ast.args.some(usesTime);
    default:
      return false;
  }
}

export function formatValue(n: number): string {
  if (!Number.isFinite(n)) return "undefined";
  const a = Math.abs(n);
  if (a !== 0 && (a >= 1e6 || a < 1e-4)) {
    return n.toExponential(4).replace(/e\+/, "e");
  }
  const s = n.toPrecision(6);
  const num = Number(s);
  if (!Number.isFinite(num)) return s;
  return String(num);
}

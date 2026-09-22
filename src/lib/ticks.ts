const PI = Math.PI;

export type Tick = { value: number; label: string };

function niceNum(span: number, target: number): number {
  const raw = span / Math.max(target, 1);
  if (!(raw > 0) || !Number.isFinite(raw)) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  if (n < 1.5) return pow;
  if (n < 3.5) return 2 * pow;
  if (n < 7.5) return 5 * pow;
  return 10 * pow;
}

const PI_STEPS = [PI / 6, PI / 4, PI / 3, PI / 2, PI, 2 * PI];

function pickStep(min: number, max: number, target: number): { step: number; pi: boolean } {
  const span = max - min;
  const nice = niceNum(span, target);
  let best: { step: number; score: number } | null = null;
  for (const p of PI_STEPS) {
    const count = span / p;
    if (count < 2 || count > target * 2.2) continue;
    const score = Math.abs(count - target);
    if (!best || score < best.score) best = { step: p, score };
  }
  if (best && Math.abs(Math.log(best.step / nice)) < 0.45) {
    return { step: best.step, pi: true };
  }
  return { step: nice, pi: false };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function formatPi(v: number): string | null {
  const k = v / PI;
  const denoms = [1, 2, 3, 4, 6];
  for (const d of denoms) {
    const num = Math.round(k * d);
    if (Math.abs(k * d - num) < 1e-6) {
      if (num === 0) return "0";
      const g = gcd(num, d);
      const n = num / g;
      const den = d / g;
      const sign = n < 0 ? "−" : "";
      const an = Math.abs(n);
      if (den === 1) return an === 1 ? `${sign}π` : `${sign}${an}π`;
      const numStr = an === 1 ? "π" : `${an}π`;
      return `${sign}${numStr}/${den}`;
    }
  }
  return null;
}

function formatPlain(v: number, step: number): string {
  if (Math.abs(v) < step * 1e-9) return "0";
  const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(step)) + 1));
  const s = v.toFixed(decimals).replace(/\.?0+$/, "");
  return s === "-0" ? "0" : s.replace("-", "−");
}

export function axisTicks(min: number, max: number, target = 8): Tick[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [];
  const { step, pi } = pickStep(min, max, target);
  if (!(step > 0)) return [];
  const start = Math.ceil((min - step * 1e-9) / step) * step;
  const ticks: Tick[] = [];
  const limit = max + step * 1e-9;
  let guard = 0;
  for (let v = start; v <= limit; v += step) {
    const value = Math.abs(v) < step * 1e-9 ? 0 : v;
    const label = pi ? (formatPi(value) ?? formatPlain(value, step)) : formatPlain(value, step);
    ticks.push({ value, label });
    guard += 1;
    if (guard > 40) break;
  }
  return ticks;
}

export function minorStep(major: number): number | null {
  const pow = Math.pow(10, Math.floor(Math.log10(major)));
  const n = Math.round(major / pow);
  if (n === 1 || n === 5 || n === 10) return major / 5;
  if (n === 2) return major / 4;
  if (Math.abs(major - Math.PI) < 1e-9) return Math.PI / 4;
  if (Math.abs(major - Math.PI / 2) < 1e-9) return Math.PI / 6;
  return major / 4;
}

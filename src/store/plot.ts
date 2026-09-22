import { create } from "zustand";
import { evaluate, parse, type Ast } from "@/lib/expr";
import { colorForRole, MAX_TRACES, TRACE_COLORS } from "@/lib/examples";
import { DEFAULT_SCORE, SCORE_BY_ID, type Score, type TraceRole } from "@/lib/scores";

export type View = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type Trace = {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
  ast: Ast | null;
  error: string | null;
  role?: TraceRole;
  fill?: boolean;
};

const TAU = Math.PI * 2;
const OMEGA = 0.85;

type PlotState = {
  traces: Trace[];
  activeId: string;
  view: View;
  grid: boolean;
  axes: boolean;
  t: number;
  playing: boolean;
  scoreId: string | null;
  setExpr: (id: string, expr: string) => void;
  setActive: (id: string) => void;
  addTrace: (expr?: string) => void;
  removeTrace: (id: string) => void;
  toggleTrace: (id: string) => void;
  loadScore: (id: string) => void;
  loadExample: (expr: string) => void;
  setView: (view: View) => void;
  resetView: () => void;
  pan: (dxWorld: number, dyWorld: number) => void;
  zoomAt: (wx: number, wy: number, factor: number) => void;
  fitY: () => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  setT: (t: number) => void;
  advanceT: (dt: number) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function compile(expr: string): { ast: Ast | null; error: string | null } {
  const trimmed = expr.trim();
  if (!trimmed) return { ast: null, error: null };
  const r = parse(trimmed);
  if (!r.ok) return { ast: null, error: r.error };
  return { ast: r.ast, error: null };
}

function makeTrace(expr: string, color: string, role?: TraceRole, fill?: boolean): Trace {
  const { ast, error } = compile(expr);
  return { id: uid(), expr, color, visible: true, ast, error, role, fill };
}

function tracesFromScore(score: Score): Trace[] {
  return score.traces.map((tr, i) => makeTrace(tr.expr, colorForRole(tr.role, i), tr.role, tr.fill));
}

function clampView(v: View): View {
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
  return { xMin, xMax, yMin, yMax };
}

function wrapT(t: number) {
  return ((t % TAU) + TAU) % TAU;
}

const initialTraces = tracesFromScore(DEFAULT_SCORE);

export const usePlotStore = create<PlotState>((set, get) => ({
  traces: initialTraces,
  activeId: initialTraces[0]!.id,
  view: { ...DEFAULT_SCORE.view },
  grid: true,
  axes: true,
  t: 0,
  playing: false,
  scoreId: DEFAULT_SCORE.id,
  setExpr: (id, expr) =>
    set((s) => ({
      traces: s.traces.map((tr) => {
        if (tr.id !== id) return tr;
        const { ast, error } = compile(expr);
        if (error) return { ...tr, expr, error };
        return { ...tr, expr, ast, error: null };
      }),
    })),
  setActive: (id) => set({ activeId: id }),
  addTrace: (expr = "") =>
    set((s) => {
      if (s.traces.length >= MAX_TRACES) return s;
      const used = new Set(s.traces.map((t) => t.color));
      const color = TRACE_COLORS.find((c) => !used.has(c)) ?? TRACE_COLORS[s.traces.length % TRACE_COLORS.length]!;
      const tr = makeTrace(expr, color);
      return { traces: [...s.traces, tr], activeId: tr.id };
    }),
  removeTrace: (id) =>
    set((s) => {
      if (s.traces.length <= 1) {
        const keep = s.traces[0];
        if (!keep) return s;
        return { traces: [{ ...keep, expr: "", ast: null, error: null }], activeId: keep.id };
      }
      const traces = s.traces.filter((t) => t.id !== id);
      const activeId = s.activeId === id ? traces[0]!.id : s.activeId;
      return { traces, activeId };
    }),
  toggleTrace: (id) =>
    set((s) => ({
      traces: s.traces.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t)),
    })),
  loadScore: (id) => {
    const score = SCORE_BY_ID[id];
    if (!score) return;
    const traces = tracesFromScore(score);
    set({
      traces,
      activeId: traces[0]!.id,
      view: clampView(score.view),
      scoreId: score.id,
      t: 0,
      playing: Boolean(score.play),
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
    const score = id ? SCORE_BY_ID[id] : null;
    set({ view: clampView(score?.view ?? DEFAULT_SCORE.view) });
  },
  pan: (dxWorld, dyWorld) =>
    set((s) => ({
      view: clampView({
        xMin: s.view.xMin + dxWorld,
        xMax: s.view.xMax + dxWorld,
        yMin: s.view.yMin + dyWorld,
        yMax: s.view.yMax + dyWorld,
      }),
    })),
  zoomAt: (wx, wy, factor) =>
    set((s) => {
      const { xMin, xMax, yMin, yMax } = s.view;
      return {
        view: clampView({
          xMin: wx - (wx - xMin) * factor,
          xMax: wx + (xMax - wx) * factor,
          yMin: wy - (wy - yMin) * factor,
          yMax: wy + (yMax - wy) * factor,
        }),
      };
    }),
  fitY: () => {
    const { traces, view, t } = get();
    const ys: number[] = [];
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
    const pad = (hi - lo) * 0.12;
    get().setView({ ...view, yMin: lo - pad, yMax: hi + pad });
  },
  toggleGrid: () => set((s) => ({ grid: !s.grid })),
  toggleAxes: () => set((s) => ({ axes: !s.axes })),
  setT: (t) => set({ t: wrapT(t) }),
  advanceT: (dt) => set((s) => ({ t: wrapT(s.t + dt * OMEGA) })),
  togglePlay: () => set((s) => ({ playing: !s.playing })),
  setPlaying: (playing) => set({ playing }),
}));

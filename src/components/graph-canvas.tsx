import { evaluate, formatValue, usesTime } from "@/lib/expr";
import { axisTicks, minorStep } from "@/lib/ticks";
import { usePlotStore, type Trace, type View } from "@/store/plot";
import { useCallback, useEffect, useRef, useState } from "react";

type Pt = { x: number; y: number };
type Cursor = { sx: number; sy: number; x: number; y: number };

const PAD = { l: 54, r: 18, t: 16, b: 34 };

function plotSize(w: number, h: number) {
  return { w: Math.max(40, w - PAD.l - PAD.r), h: Math.max(40, h - PAD.t - PAD.b) };
}

function toScreen(view: View, w: number, h: number, x: number, y: number) {
  const p = plotSize(w, h);
  return {
    sx: PAD.l + ((x - view.xMin) / (view.xMax - view.xMin)) * p.w,
    sy: PAD.t + ((view.yMax - y) / (view.yMax - view.yMin)) * p.h,
  };
}

function toWorld(view: View, w: number, h: number, sx: number, sy: number) {
  const p = plotSize(w, h);
  return {
    x: view.xMin + ((sx - PAD.l) / p.w) * (view.xMax - view.xMin),
    y: view.yMax - ((sy - PAD.t) / p.h) * (view.yMax - view.yMin),
  };
}

function sampleTrace(ast: Parameters<typeof evaluate>[0], view: View, width: number, t: number): Pt[][] {
  const n = Math.max(240, Math.ceil(width * 2.2));
  const dx = (view.xMax - view.xMin) / n;
  const yJump = (view.yMax - view.yMin) * 1.8;
  const segs: Pt[][] = [];
  let cur: Pt[] = [];
  let prevY = NaN;
  for (let i = 0; i <= n; i++) {
    const x = view.xMin + i * dx;
    const y = evaluate(ast, x, t);
    const ok = Number.isFinite(y);
    if (!ok) {
      if (cur.length > 1) segs.push(cur);
      cur = [];
      prevY = NaN;
      continue;
    }
    if (Number.isFinite(prevY) && Math.abs(y - prevY) > yJump && Math.sign(y) !== Math.sign(prevY)) {
      if (cur.length > 1) segs.push(cur);
      cur = [{ x, y }];
    } else {
      cur.push({ x, y });
    }
    prevY = y;
  }
  if (cur.length > 1) segs.push(cur);
  return segs;
}

function readCss(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function strokeFor(tr: Trace): { width: number; dash: number[] } {
  if (tr.role === "envelope") return { width: 1.35, dash: [6, 5] };
  if (tr.role === "carrier") return { width: 1.5, dash: [] };
  if (tr.role === "companion") return { width: 1.6, dash: [] };
  return { width: 2.2, dash: [] };
}

export function GraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const traces = usePlotStore((s) => s.traces);
  const view = usePlotStore((s) => s.view);
  const grid = usePlotStore((s) => s.grid);
  const axes = usePlotStore((s) => s.axes);
  const t = usePlotStore((s) => s.t);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number } | null>(null);
  const dragging = useRef(false);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setSize({ w: Math.max(1, cr.width), h: Math.max(1, cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
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
    const xMajor = xTicks.length >= 2 ? xTicks[1]!.value - xTicks[0]!.value : 1;
    const yMajor = yTicks.length >= 2 ? yTicks[1]!.value - yTicks[0]!.value : 1;

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
            const { sx, sy } = toScreen(view, w, h, seg[i]!.x, seg[i]!.y);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          const last = seg[seg.length - 1]!;
          const first = seg[0]!;
          ctx.lineTo(toScreen(view, w, h, last.x, 0).sx, axis.sy);
          ctx.lineTo(toScreen(view, w, h, first.x, 0).sx, axis.sy);
          ctx.closePath();
          ctx.globalAlpha = 0.13;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = stroke.width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash(stroke.dash);
      ctx.globalAlpha = tr.error ? 0.4 : 1;
      for (const seg of segs) {
        ctx.beginPath();
        for (let i = 0; i < seg.length; i++) {
          const { sx, sy } = toScreen(view, w, h, seg[i]!.x, seg[i]!.y);
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
    ctx.strokeRect(PAD.l + 0.5, PAD.t + 0.5, p.w - 1, p.h - 1);
  }, [view, traces, grid, axes, cursor, size, t]);

  useEffect(() => {
    draw();
  }, [draw]);

  const eventToLocal = (e: { clientX: number; clientY: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    return { sx: e.clientX - r.left, sy: e.clientY - r.top };
  };

  const updateCursor = (sx: number, sy: number) => {
    const { w, h } = sizeRef.current;
    const p = plotSize(w, h);
    if (sx < PAD.l || sy < PAD.t || sx > PAD.l + p.w || sy > PAD.t + p.h) {
      setCursor(null);
      return;
    }
    const world = toWorld(usePlotStore.getState().view, w, h, sx, sy);
    setCursor({ sx, sy, x: world.x, y: world.y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const loc = { sx: e.clientX - r.left, sy: e.clientY - r.top };
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      if (e.deltaMode === 2) dy *= 320;
      const factor = Math.exp(dy * 0.0016);
      const store = usePlotStore.getState();
      const { w, h } = sizeRef.current;
      const world = toWorld(store.view, w, h, loc.sx, loc.sy);
      store.zoomAt(world.x, world.y, factor);
      updateCursor(loc.sx, loc.sy);
    };
    canvas.addEventListener("wheel", onWheelNative, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheelNative);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dx = pts[0]!.x - pts[1]!.x;
      const dy = pts[0]!.y - pts[1]!.y;
      pinch.current = { dist: Math.hypot(dx, dy) };
      dragging.current = false;
    } else {
      dragging.current = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const loc = eventToLocal(e);
    if (loc) updateCursor(loc.sx, loc.sy);
    const prev = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const store = usePlotStore.getState();
    const { w, h } = sizeRef.current;
    if (pointers.current.size === 2 && pinch.current) {
      const pts = [...pointers.current.values()];
      const dx = pts[0]!.x - pts[1]!.x;
      const dy = pts[0]!.y - pts[1]!.y;
      const dist = Math.hypot(dx, dy);
      if (pinch.current.dist > 8 && dist > 8) {
        const factor = pinch.current.dist / dist;
        const mid = eventToLocal({
          clientX: (pts[0]!.x + pts[1]!.x) / 2,
          clientY: (pts[0]!.y + pts[1]!.y) / 2,
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
      const dx = ((e.clientX - prev.x) / p.w) * (store.view.xMax - store.view.xMin);
      const dy = ((e.clientY - prev.y) / p.h) * (store.view.yMax - store.view.yMin);
      store.pan(-dx, dy);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const store = usePlotStore.getState();
    const { view: v } = store;
    const xSpan = v.xMax - v.xMin;
    const ySpan = v.yMax - v.yMin;
    if (e.key === "+" || e.key === "=") {
      store.zoomAt((v.xMin + v.xMax) / 2, (v.yMin + v.yMax) / 2, 0.8);
    } else if (e.key === "-" || e.key === "_") {
      store.zoomAt((v.xMin + v.xMax) / 2, (v.yMin + v.yMax) / 2, 1.25);
    } else if (e.key === "0") {
      store.resetView();
    } else if (e.key === "ArrowLeft") {
      store.pan(-xSpan * 0.08, 0);
    } else if (e.key === "ArrowRight") {
      store.pan(xSpan * 0.08, 0);
    } else if (e.key === "ArrowUp") {
      store.pan(0, ySpan * 0.08);
    } else if (e.key === "ArrowDown") {
      store.pan(0, -ySpan * 0.08);
    } else {
      return;
    }
    e.preventDefault();
  };

  const timeful = traces.some((tr) => tr.visible && tr.ast && usesTime(tr.ast));

  const ys =
    cursor == null
      ? []
      : traces
          .filter((tr) => tr.visible && tr.ast)
          .map((tr) => ({
            id: tr.id,
            expr: tr.expr,
            color: tr.color,
            y: evaluate(tr.ast!, cursor.x, t),
          }));

  const readoutW = 196;
  const readoutLeft =
    cursor && cursor.sx + 16 + readoutW < size.w - 12 ? cursor.sx + 16 : (cursor?.sx ?? 0) - readoutW - 16;
  const readoutTop = cursor ? Math.min(Math.max(cursor.sy + 14, 12), size.h - 140) : 0;

  return (
    <div ref={wrapRef} className="relative h-full min-h-0 w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair touch-none"
        style={{ width: "100%", height: "100%" }}
        tabIndex={0}
        role="img"
        aria-label="Function graph. Scroll to zoom, drag to pan, double-click to reset."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => {
          if (!dragging.current) setCursor(null);
        }}
        onDoubleClick={() => usePlotStore.getState().resetView()}
        onKeyDown={onKeyDown}
      />
      {timeful ? (
        <div className="pointer-events-none absolute top-3 right-3 rounded-md bg-elevated/90 px-2.5 py-1 font-mono text-[11px] tabular-nums text-muted shadow-[var(--shadow-border)]">
          t {formatValue(t)}
        </div>
      ) : null}
      {cursor ? (
        <div
          className="pointer-events-none absolute z-10 min-w-44 rounded-lg bg-elevated/95 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm"
          style={{ left: Math.max(8, readoutLeft), top: readoutTop }}
        >
          <div className="flex justify-between gap-4 font-mono text-xs tabular-nums">
            <span className="text-muted">x</span>
            <span>{formatValue(cursor.x)}</span>
          </div>
          <div className="flex justify-between gap-4 font-mono text-xs tabular-nums">
            <span className="text-muted">y</span>
            <span>{formatValue(cursor.y)}</span>
          </div>
          {timeful ? (
            <div className="flex justify-between gap-4 font-mono text-xs tabular-nums">
              <span className="text-muted">t</span>
              <span>{formatValue(t)}</span>
            </div>
          ) : null}
          {ys.length > 0 ? <div className="my-1.5 h-px bg-line" /> : null}
          {ys.map((row) => (
            <div key={row.id} className="flex justify-between gap-3 font-mono text-xs tabular-nums">
              <span className="max-w-32 truncate" style={{ color: row.color }}>
                {row.expr}
              </span>
              <span>{formatValue(row.y)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

import { EquationDock } from "@/components/equation-dock";
import { GraphCanvas } from "@/components/graph-canvas";
import { PlotHeader } from "@/components/plot-header";
import { usePlotStore } from "@/store/plot";
import { useEffect } from "react";

export function PlotApp() {
  const playing = usePlotStore((s) => s.playing);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      usePlotStore.getState().advanceT(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.code === "Space") {
        e.preventDefault();
        usePlotStore.getState().togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh min-h-0 min-w-0 flex-col overflow-x-hidden bg-bg text-fg">
      <PlotHeader />
      <main className="relative min-h-0 flex-1">
        <GraphCanvas />
      </main>
      <EquationDock />
    </div>
  );
}

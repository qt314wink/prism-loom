import { Button } from "@/components/ui/button";
import { formatValue } from "@/lib/expr";
import { SCORES } from "@/lib/scores";
import { cn } from "@/lib/utils";
import { usePlotStore } from "@/store/plot";
import * as Popover from "@radix-ui/react-popover";
import { Frame, Grid3x3, HelpCircle, Locate, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";

const TAU = Math.PI * 2;

export function PlotHeader() {
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

  const zoomCenter = (factor: number) => {
    zoomAt((view.xMin + view.xMax) / 2, (view.yMin + view.yMax) / 2, factor);
  };

  return (
    <header className="flex min-w-0 flex-col gap-2 overflow-x-hidden border-b border-line bg-surface px-3 py-2.5 sm:px-4">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-none tracking-tight">Locus</p>
          <p className="mt-0.5 hidden text-xs text-muted sm:block">Laws of light, plotted</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label={playing ? "Pause time" : "Play time"}
            aria-pressed={playing}
            onClick={togglePlay}
            className={playing ? "text-fg" : "text-muted"}
          >
            {playing ? <Pause className="size-4" strokeWidth={1.75} /> : <Play className="size-4" strokeWidth={1.75} />}
          </Button>
          <label className="hidden items-center gap-2 sm:flex">
            <span className="sr-only">Time</span>
            <input
              type="range"
              min={0}
              max={TAU}
              step={0.01}
              value={t}
              onChange={(e) => {
                usePlotStore.getState().setPlaying(false);
                setT(Number(e.target.value));
              }}
              className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-line accent-accent"
              aria-label="Time"
            />
            <span className="w-10 font-mono text-[11px] tabular-nums text-muted">{formatValue(t)}</span>
          </label>
        </div>
        <div className="flex items-center gap-0.5">
          <Button size="icon" variant="ghost" className="hidden sm:inline-flex" aria-label="Zoom in" onClick={() => zoomCenter(0.8)}>
            <Plus className="size-4" strokeWidth={1.75} />
          </Button>
          <Button size="icon" variant="ghost" className="hidden sm:inline-flex" aria-label="Zoom out" onClick={() => zoomCenter(1.25)}>
            <Minus className="size-4" strokeWidth={1.75} />
          </Button>
          <Button size="icon" variant="ghost" className="hidden sm:inline-flex" aria-label="Fit vertical range" onClick={fitY}>
            <Locate className="size-4" strokeWidth={1.75} />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Reset view" onClick={resetView}>
            <RotateCcw className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-pressed={grid}
            aria-label="Toggle grid"
            onClick={toggleGrid}
            className={grid ? "text-fg" : "text-faint"}
          >
            <Grid3x3 className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-pressed={axes}
            aria-label="Toggle axes"
            onClick={toggleAxes}
            className={axes ? "text-fg" : "text-faint"}
          >
            <Frame className="size-4" strokeWidth={1.75} />
          </Button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button size="icon" variant="ghost" aria-label="How to write functions">
                <HelpCircle className="size-4" strokeWidth={1.75} />
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="bottom"
                align="end"
                sideOffset={8}
                className="z-50 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl bg-elevated p-4 text-sm text-fg shadow-[var(--shadow-border)]"
              >
                <p className="font-medium">Write y as a function of x</p>
                <p className="mt-1 text-muted">
                  Operators + − * / ^ and implicit multiply (2x, 2sin(x)). Constants pi, e, tau, phi. Time variable t
                  loops from 0 to 2π — press play, or Space.
                </p>
                <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
                  sin cos tan tanh sech exp ln log sqrt abs floor ceil sign min max pow sinc clamp mod
                </p>
                <p className="mt-3 text-xs text-faint">
                  Scroll to zoom, drag to pan, pinch on touch, double-click to reset. Keys: + − zoom, arrows pan, 0
                  reset, Space play.
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
      <div className="locus-scroll min-w-0 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
        {SCORES.map((score) => {
          const active = score.id === scoreId;
          return (
            <button
              key={score.id}
              type="button"
              title={score.law}
              onClick={() => loadScore(score.id)}
              className={cn(
                "h-8 shrink-0 rounded-full px-3 text-xs transition-colors duration-150",
                active
                  ? "bg-fg text-bg"
                  : "text-muted shadow-[var(--shadow-border)] hover:text-fg",
              )}
            >
              {score.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

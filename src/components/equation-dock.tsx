import { Button } from "@/components/ui/button";
import { MAX_TRACES } from "@/lib/examples";
import { SCORE_BY_ID } from "@/lib/scores";
import { cn } from "@/lib/utils";
import { usePlotStore } from "@/store/plot";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";

export function EquationDock() {
  const traces = usePlotStore((s) => s.traces);
  const activeId = usePlotStore((s) => s.activeId);
  const scoreId = usePlotStore((s) => s.scoreId);
  const setExpr = usePlotStore((s) => s.setExpr);
  const setActive = usePlotStore((s) => s.setActive);
  const addTrace = usePlotStore((s) => s.addTrace);
  const removeTrace = usePlotStore((s) => s.removeTrace);
  const toggleTrace = usePlotStore((s) => s.toggleTrace);

  const score = scoreId ? SCORE_BY_ID[scoreId] : null;

  return (
    <section className="max-h-[42%] min-w-0 overflow-x-hidden overflow-y-auto border-t border-line bg-surface px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:max-h-[38%] sm:px-4">
      <div className="flex items-start justify-between gap-3 pb-2">
        <div className="min-w-0">
          {score ? (
            <>
              <p className="truncate text-xs text-muted">
                <span className="font-medium tracking-[0.14em] text-fg uppercase">{score.label}</span>
                <span className="mx-2 text-faint">·</span>
                <span className="font-mono">{score.math}</span>
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted">{score.see}</p>
            </>
          ) : (
            <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Equations</p>
          )}
        </div>
        <Button
          size="sm"
          variant="line"
          className="h-9 shrink-0 gap-1.5"
          onClick={() => addTrace("")}
          disabled={traces.length >= MAX_TRACES}
        >
          <Plus className="size-3.5" strokeWidth={1.75} />
          Add
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {traces.map((tr, i) => {
          const active = tr.id === activeId;
          return (
            <li key={tr.id}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg bg-elevated py-1.5 pr-1.5 pl-2 shadow-[var(--shadow-border)]",
                  active && "shadow-[var(--shadow-border-hover)]",
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: tr.color, opacity: tr.visible ? 1 : 0.35 }}
                  aria-hidden
                />
                <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">y{i + 1} =</span>
                <input
                  value={tr.expr}
                  onChange={(e) => setExpr(tr.id, e.target.value)}
                  onFocus={() => setActive(tr.id)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder="sin(x)"
                  aria-label={`Function ${i + 1}`}
                  aria-invalid={Boolean(tr.error)}
                  className={cn(
                    "min-h-11 min-w-0 flex-1 bg-transparent px-1 font-mono text-sm text-fg outline-none placeholder:text-faint",
                    tr.error && "text-warn",
                  )}
                />
                <Button
                  size="icon"
                  variant="quiet"
                  className="size-11 shrink-0"
                  aria-label={tr.visible ? "Hide" : "Show"}
                  onClick={() => toggleTrace(tr.id)}
                >
                  {tr.visible ? (
                    <Eye className="size-4" strokeWidth={1.75} />
                  ) : (
                    <EyeOff className="size-4" strokeWidth={1.75} />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="quiet"
                  className="size-11 shrink-0"
                  aria-label="Remove function"
                  onClick={() => removeTrace(tr.id)}
                >
                  <Trash2 className="size-4" strokeWidth={1.75} />
                </Button>
              </div>
              {tr.error ? (
                <p className="mt-1 pl-5 font-mono text-xs text-warn" role="alert">
                  {tr.error}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

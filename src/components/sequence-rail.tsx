import { GitMerge, RotateCcw, X } from "lucide-react";
import { morphBetween, PLATE_BY_ID } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SequenceRail() {
  const sequence = useStudio((s) => s.sequence);
  const activeId = useStudio((s) => s.activeId);
  const selectedMorphSrc = useStudio((s) => s.selectedMorphSrc);
  const setActive = useStudio((s) => s.setActive);
  const setPlaying = useStudio((s) => s.setPlaying);
  const setSelectedMorph = useStudio((s) => s.setSelectedMorph);
  const removeFromSequence = useStudio((s) => s.removeFromSequence);
  const resetSequence = useStudio((s) => s.resetSequence);

  return (
    <section className="rounded-2xl bg-panel p-3 shadow-[var(--shadow-border)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">Chromatic journey</p>
          <h2 className="font-display text-lg text-cream">Sequence</h2>
        </div>
        <Button size="sm" variant="ghost" onClick={resetSequence}>
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>
      <div className="loom-scroll flex items-center gap-1 overflow-x-auto pb-1">
        {sequence.map((id, i) => {
          const plate = PLATE_BY_ID[id];
          const next = sequence[i + 1];
          const morph = next ? morphBetween(id, next) : undefined;
          const on = id === activeId && !selectedMorphSrc;
          return (
            <div key={`${id}-${i}`} className="flex shrink-0 items-center gap-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setActive(id);
                  }}
                  className={cn(
                    "block size-16 overflow-hidden rounded-lg transition-shadow",
                    on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]",
                  )}
                >
                  <img src={plate.src} alt={plate.title} className="size-full object-cover" />
                </button>
                {sequence.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Remove ${plate.title}`}
                    onClick={() => removeFromSequence(i)}
                    className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-ink text-muted hover:text-cream"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
              {morph && next && (
                <button
                  type="button"
                  title={`Morph ${plate.title} → ${PLATE_BY_ID[next].title}`}
                  onClick={() => {
                    setPlaying(false);
                    setSelectedMorph(morph.src);
                  }}
                  className={cn(
                    "relative size-12 overflow-hidden rounded-full",
                    selectedMorphSrc === morph.src
                      ? "shadow-[var(--shadow-border-hover)]"
                      : "shadow-[var(--shadow-border)]",
                  )}
                >
                  <img src={morph.src} alt="" className="size-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-void/30">
                    <GitMerge className="size-3 text-gold" />
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

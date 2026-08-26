import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { REELS, formatTimecode } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function ReelStrip() {
  const activeReelId = useStudio((s) => s.activeReelId);
  const view = useStudio((s) => s.view);
  const playReel = useStudio((s) => s.playReel);
  const activeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeBtn.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeReelId, view]);

  return (
    <section className="rounded-2xl bg-panel p-3 shadow-[var(--shadow-border)]">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <p className="text-xs tracking-[0.24em] text-gold uppercase">Cinema catalog</p>
          <h2 className="font-display text-lg text-cream">Reels</h2>
        </div>
        <p className="text-xs tabular-nums text-muted">{REELS.length} loops</p>
      </div>
      <div className="loom-scroll flex gap-2 overflow-x-auto pb-1">
        {REELS.map((r) => {
          const on = view === "cinema" && r.id === activeReelId;
          return (
            <button
              key={r.id}
              ref={on ? activeBtn : undefined}
              type="button"
              onClick={() => playReel(r.id)}
              className="group w-24 shrink-0 text-left"
              aria-pressed={on}
              aria-label={`Play ${r.title}`}
            >
              <span
                className={cn(
                  "relative block aspect-square overflow-hidden rounded-xl transition-[box-shadow,transform] duration-150",
                  on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]",
                )}
              >
                <img
                  src={r.poster}
                  alt=""
                  className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-void/25 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <Play className="size-5 text-cream" />
                </span>
                <span className="absolute right-1 bottom-1 rounded bg-void/75 px-1 py-px font-mono text-xs text-gold">
                  {formatTimecode(r.durationSec)}
                </span>
                {on && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold" />
                )}
              </span>
              <span
                className={cn(
                  "mt-1.5 block truncate text-xs tracking-wide",
                  on ? "text-gold" : "text-muted",
                )}
              >
                {r.title.replace(" · ", " ")}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
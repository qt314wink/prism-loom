import { useEffect, useRef } from "react";
import { REELS } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function ReelStrip() {
  const reelId = useStudio((s) => s.cinemaReelId);
  const view = useStudio((s) => s.view);
  const paused = useStudio((s) => s.cinemaPaused);
  const playReel = useStudio((s) => s.playReel);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reelId || !rowRef.current) return;
    const el = rowRef.current.querySelector<HTMLElement>(`[data-reel="${reelId}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [reelId]);

  return (
    <div
      ref={rowRef}
      className="studio-scroll -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
      role="list"
      aria-label="Cinema reels"
    >
      {REELS.map((r, i) => {
        const active = view === "cinema" && reelId === r.id;
        const playing = active && !paused;
        return (
          <button
            key={r.id}
            type="button"
            data-reel={r.id}
            role="listitem"
            onClick={() => playReel(r.id)}
            className={cn(
              "group relative w-[4.75rem] shrink-0 overflow-hidden rounded-lg text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] active:scale-[0.98] sm:w-[5.5rem]",
              active && "shadow-[0_0_0_1px_var(--color-accent)]",
            )}
            aria-current={active ? "true" : undefined}
            title={r.title}
          >
            <img
              src={r.poster}
              alt=""
              className="aspect-square w-full object-cover"
              draggable={false}
            />
            <span className="absolute inset-x-0 bottom-0 bg-bg/75 px-1.5 py-1 text-[10px] leading-tight text-fg backdrop-blur-sm">
              {String(i + 1).padStart(2, "0")} {r.beat}
            </span>
            {playing && (
              <span className="absolute inset-x-1 top-1 h-0.5 rounded-full bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}

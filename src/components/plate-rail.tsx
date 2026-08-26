import { PLATES, reelsForPlate } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function PlateRail() {
  const activeId = useStudio((s) => s.activeId);
  const setActive = useStudio((s) => s.setActive);
  const playPlateReel = useStudio((s) => s.playPlateReel);
  const view = useStudio((s) => s.view);

  return (
    <div className="loom-scroll flex gap-3 overflow-x-auto px-1 py-2">
      {PLATES.map((p) => {
        const on = p.id === activeId;
        const hasReel = reelsForPlate(p.id).length > 0;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              if (view === "cinema" && hasReel) playPlateReel(p.id);
              else setActive(p.id);
            }}
            onDoubleClick={() => {
              if (hasReel) playPlateReel(p.id);
            }}
            className="group w-20 shrink-0 text-left"
          >
            <span
              className={cn(
                "relative block aspect-square overflow-hidden rounded-xl transition-[box-shadow,transform] duration-150",
                on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]",
              )}
            >
              <img
                src={p.src}
                alt=""
                className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {hasReel && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-gold shadow-[0_0_0_2px_rgba(8,7,12,0.7)]" />
              )}
            </span>
            <span className={cn("mt-1.5 block truncate text-[0.65rem] tracking-wide", on ? "text-gold" : "text-muted")}>
              {p.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

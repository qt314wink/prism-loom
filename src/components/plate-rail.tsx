import { PLATES } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function PlateRail() {
  const activeId = useStudio((s) => s.activeId);
  const setActive = useStudio((s) => s.setActive);
  const setPlaying = useStudio((s) => s.setPlaying);

  return (
    <div className="loom-scroll flex gap-3 overflow-x-auto px-1 py-2">
      {PLATES.map((p) => {
        const on = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPlaying(false);
              setActive(p.id);
            }}
            className="group w-20 shrink-0 text-left"
          >
            <span
              className={cn(
                "block aspect-square overflow-hidden rounded-xl transition-[box-shadow,transform] duration-150",
                on ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]",
              )}
            >
              <img
                src={p.src}
                alt=""
                className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
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

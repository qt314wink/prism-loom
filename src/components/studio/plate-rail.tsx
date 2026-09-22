import { PLATES, firstReelForPlate } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function PlateRail() {
  const plateId = useStudio((s) => s.plateId);
  const playPlateReel = useStudio((s) => s.playPlateReel);
  const setPlate = useStudio((s) => s.setPlate);
  const closeCinema = useStudio((s) => s.closeCinema);

  return (
    <nav
      className="studio-scroll flex gap-2 overflow-x-auto p-1 md:h-full md:flex-col md:overflow-y-auto md:overflow-x-hidden"
      aria-label="Plate library"
    >
      {PLATES.map((p) => {
        const active = plateId === p.id;
        const hasReel = Boolean(firstReelForPlate(p.id));
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              if (hasReel) playPlateReel(p.id);
              else {
                closeCinema();
                setPlate(p.id);
              }
            }}
            className={cn(
              "relative w-16 shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] active:scale-[0.98] md:w-[4.6rem]",
              active && "shadow-[0_0_0_1px_var(--color-accent)]",
            )}
            title={`${p.title} — ${p.epithet}`}
            aria-current={active ? "true" : undefined}
          >
            <img src={p.src} alt="" className="aspect-square w-full object-cover" draggable={false} />
            {hasReel && (
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-accent shadow-[0_0_0_1px_var(--color-bg)]" />
            )}
            <span className="sr-only">{p.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

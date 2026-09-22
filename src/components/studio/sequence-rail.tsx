import { PLATE_BY_ID } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function SequenceRail() {
  const sequence = useStudio((s) => s.sequence);
  const plateId = useStudio((s) => s.plateId);
  const setPlate = useStudio((s) => s.setPlate);
  const closeCinema = useStudio((s) => s.closeCinema);

  return (
    <div
      className="studio-scroll hidden gap-1.5 overflow-x-auto py-1 lg:flex"
      aria-label="Loom sequence"
    >
      {sequence.map((id, i) => {
        const p = PLATE_BY_ID[id];
        if (!p) return null;
        const active = plateId === id;
        return (
          <button
            key={`${id}-${i}`}
            type="button"
            onClick={() => {
              closeCinema();
              setPlate(id);
            }}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-[var(--shadow-border)]",
              active && "shadow-[0_0_0_1px_var(--color-accent)]",
            )}
            title={p.title}
          >
            <img src={p.src} alt="" className="size-full object-cover" draggable={false} />
          </button>
        );
      })}
    </div>
  );
}

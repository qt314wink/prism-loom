import { useStudio, type Journey } from "@/store/studio";
import { cn } from "@/lib/utils";

const STEPS: { id: Journey; n: string; label: string; verb: string }[] = [
  { id: "watch", n: "1", label: "Watch", verb: "Play one baked loop. Learn its unique law." },
  { id: "isolate", n: "2", label: "Isolate", verb: "Solo one mechanism until you can name it." },
  { id: "fuse", n: "3", label: "Fuse", verb: "Mix A with a legal neighbor. Blend is a law." },
  { id: "score", n: "4", label: "Score", verb: "Copy the packet this disc is running." },
];

export function AppHeader() {
  const journey = useStudio((s) => s.journey);
  const setJourney = useStudio((s) => s.setJourney);
  const step = STEPS.find((s) => s.id === journey) ?? STEPS[0];

  return (
    <header className="flex flex-col gap-3 px-1 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-medium tracking-[-0.03em] text-fg sm:text-2xl">
            Prism Loom
          </h1>
          <p className="text-sm text-muted">{step.verb}</p>
        </div>
        <p className="hidden text-right text-xs text-faint lg:block">
          Space play · arrows skip · [ ] partner · 1–0 reel
        </p>
      </div>
      <nav className="flex gap-1 rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]" aria-label="Journey">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setJourney(s.id)}
            className={cn(
              "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium text-muted transition-colors duration-150 sm:text-sm",
              journey === s.id && "bg-elevated text-fg shadow-[var(--shadow-border)]",
            )}
            aria-current={journey === s.id ? "step" : undefined}
          >
            <span className="font-mono text-[10px] text-faint">{s.n}</span>
            {s.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

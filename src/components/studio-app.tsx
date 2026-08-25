import { AppHeader } from "@/components/app-header";
import { KaleidoStage } from "@/components/kaleido-stage";
import { PlateRail } from "@/components/plate-rail";
import { SequenceRail } from "@/components/sequence-rail";
import { SideDesk } from "@/components/side-desk";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function StudioApp() {
  const mode = useStudio((s) => s.mode);
  const setMode = useStudio((s) => s.setMode);

  return (
    <div className="flex min-h-dvh flex-col bg-void text-cream">
      <AppHeader />
      <div className="flex gap-1 border-b border-line px-4 py-2 sm:hidden">
        {(["plate", "morph", "refold"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-full py-2 text-xs tracking-wide uppercase",
              mode === m ? "bg-gold text-void" : "text-muted",
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="border-b border-line px-3 md:px-5">
        <PlateRail />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-3 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:p-5">
        <div className="flex min-h-0 flex-col gap-4">
          <KaleidoStage />
          <SequenceRail />
        </div>
        <SideDesk />
      </div>
    </div>
  );
}

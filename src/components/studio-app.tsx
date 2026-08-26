import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { KaleidoStage } from "@/components/kaleido-stage";
import { PlateRail } from "@/components/plate-rail";
import { ReelStrip } from "@/components/reel-strip";
import { SequenceRail } from "@/components/sequence-rail";
import { SideDesk } from "@/components/side-desk";
import { REELS } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function StudioApp() {
  const mode = useStudio((s) => s.mode);
  const setMode = useStudio((s) => s.setMode);
  const view = useStudio((s) => s.view);
  const setView = useStudio((s) => s.setView);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const s = useStudio.getState();
      if (e.code === "Space") {
        e.preventDefault();
        s.togglePlaying();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (s.view === "cinema") s.stepReel(-1);
        else s.stepPlate(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (s.view === "cinema") s.stepReel(1);
        else s.stepPlate(1);
        return;
      }
      if (e.key === "m" || e.key === "M") {
        s.toggleMuted();
        return;
      }
      if (e.key === "l" || e.key === "L") {
        s.cycleLoopMode();
        return;
      }
      if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
        return;
      }
      if (e.key === "c" || e.key === "C") {
        s.setView(s.view === "cinema" ? "loom" : "cinema");
        return;
      }
      if (e.key === "Escape") {
        if (s.view === "cinema") s.closeCinema();
        return;
      }
      if (e.key >= "1" && e.key <= "9") {
        const reel = REELS[Number(e.key) - 1];
        if (reel) s.playReel(reel.id);
        return;
      }
      if (e.key === "0") {
        const reel = REELS[9];
        if (reel) s.playReel(reel.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
              view === "loom" && mode === m ? "bg-gold text-void" : "text-muted",
            )}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setView(view === "cinema" ? "loom" : "cinema")}
          className={cn(
            "flex-1 rounded-full py-2 text-xs tracking-wide uppercase",
            view === "cinema" ? "bg-gold text-void" : "text-muted",
          )}
        >
          cinema
        </button>
      </div>
      <div className="border-b border-line px-3 md:px-5">
        <PlateRail />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-3 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:p-5">
        <div className="flex min-h-0 flex-col gap-4">
          <KaleidoStage />
          <ReelStrip />
          <SequenceRail />
        </div>
        <SideDesk />
      </div>
    </div>
  );
}

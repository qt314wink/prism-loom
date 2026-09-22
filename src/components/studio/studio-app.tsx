import { useEffect } from "react";
import { AppHeader } from "@/components/studio/app-header";
import { KaleidoStage } from "@/components/studio/kaleido-stage";
import { PlateRail } from "@/components/studio/plate-rail";
import { SideDesk } from "@/components/studio/side-desk";
import { REELS } from "@/lib/plates";
import { useStudio, type Journey } from "@/store/studio";
import { cn } from "@/lib/utils";

const KEY_JOURNEY: Record<string, Journey> = {
  w: "watch",
  W: "watch",
  i: "isolate",
  I: "isolate",
  u: "fuse",
  U: "fuse",
  o: "score",
  O: "score",
};

export function StudioApp() {
  const mobileTab = useStudio((s) => s.mobileTab);
  const setMobileTab = useStudio((s) => s.setMobileTab);
  const ensureCinema = useStudio((s) => s.ensureCinema);

  useEffect(() => {
    ensureCinema();
  }, [ensureCinema]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const s = useStudio.getState();
      if (e.code === "Space") {
        e.preventDefault();
        s.togglePause();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        s.stepReel(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        s.stepReel(-1);
      } else if (e.key === "[") {
        e.preventDefault();
        s.stepLegal(-1);
      } else if (e.key === "]") {
        e.preventDefault();
        s.stepLegal(1);
      } else if (e.key === "m" || e.key === "M") {
        s.setMuted(!s.muted);
      } else if (e.key === "l" || e.key === "L") {
        s.cycleLoop();
      } else if (KEY_JOURNEY[e.key]) {
        s.setJourney(KEY_JOURNEY[e.key]);
      } else if (e.key === "Escape") {
        if (s.journey !== "watch") s.setJourney("watch");
      } else if (e.key >= "1" && e.key <= "9") {
        const r = REELS[Number(e.key) - 1];
        if (r) s.playReel(r.id);
      } else if (e.key === "0") {
        const r = REELS[9];
        if (r) s.playReel(r.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-3 px-3 pb-20 sm:px-5 lg:pb-6">
        <AppHeader />
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <div
            className={cn(
              "lg:flex lg:w-[5.4rem] lg:shrink-0",
              mobileTab === "library" ? "flex" : "hidden lg:flex",
            )}
          >
            <PlateRail />
          </div>
          <div
            className={cn(
              "min-w-0 flex-1 flex-col gap-3",
              mobileTab === "library" ? "hidden lg:flex" : "flex",
            )}
          >
            <KaleidoStage />
          </div>
          <div className="hidden lg:flex">
            <SideDesk />
          </div>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-bg/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
        {(
          [
            ["stage", "Stage"],
            ["library", "Library"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobileTab(id)}
            className={cn(
              "h-11 flex-1 rounded-md text-sm font-medium text-muted",
              mobileTab === id && "bg-elevated text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

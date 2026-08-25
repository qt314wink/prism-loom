import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { LoomGL, loadImage } from "@/lib/loom-gl";
import { MOTION_BY_ID, MOTIONS } from "@/lib/motions";
import { PLATE_BY_ID, PLATES } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHOT_SEC = 6;
const MORPH_SEC = 2;

export function KaleidoStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const activeId = useStudio((s) => s.activeId);
  const nextId = useStudio((s) => s.nextId);
  const blend = useStudio((s) => s.blend);
  const selectedMorphSrc = useStudio((s) => s.selectedMorphSrc);
  const playing = useStudio((s) => s.playing);
  const plate = PLATE_BY_ID[activeId] ?? PLATES[0];
  const next = PLATE_BY_ID[nextId] ?? plate;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let loom: LoomGL;
    try {
      loom = new LoomGL(canvas);
    } catch {
      setFailed(true);
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    let lastA = "";
    let lastB = "";
    let dead = false;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const size = Math.min(parent.clientWidth, parent.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      loom.resize(Math.max(2, Math.floor(size * dpr)), Math.max(2, Math.floor(size * dpr)));
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const tick = (now: number) => {
      if (dead) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = useStudio.getState();
      if (!reduced) elapsed += dt * s.speed;

      if (s.playing && s.sequence.length > 1 && !s.selectedMorphSrc) {
        const n = s.sequence.length;
        const total = n * SHOT_SEC;
        const pos = elapsed % total;
        const i = Math.min(n - 1, Math.max(0, Math.floor(pos / SHOT_SEC)));
        const local = pos - i * SHOT_SEC;
        const id = s.sequence[i];
        const nid = s.sequence[(i + 1) % n];
        const b = local > SHOT_SEC - MORPH_SEC ? (local - (SHOT_SEC - MORPH_SEC)) / MORPH_SEC : 0;
        if (id && nid && (id !== s.activeId || nid !== s.nextId || Math.abs(b - s.blend) > 0.02)) {
          s.syncShot(id, nid, b);
        }
      }

      const st = useStudio.getState();
      const aPlate = PLATE_BY_ID[st.activeId] ?? PLATES[0];
      const bPlate = PLATE_BY_ID[st.nextId] ?? aPlate;
      const srcA = st.selectedMorphSrc ?? aPlate.src;
      const srcB = bPlate.src;
      if (srcA !== lastA) {
        lastA = srcA;
        loadImage(srcA)
          .then((img) => {
            if (!dead) loom.upload(0, img);
          })
          .catch(() => {});
      }
      if (srcB !== lastB) {
        lastB = srcB;
        loadImage(srcB)
          .then((img) => {
            if (!dead) loom.upload(1, img);
          })
          .catch(() => {});
      }

      const motion = MOTION_BY_ID[st.motionId] ?? MOTIONS[0];
      const rot = st.rotManual + (reduced ? 0 : elapsed * motion.rotSpeed);
      const zoom =
        st.zoom * (1 + (reduced ? 0 : motion.zoomAmp * Math.sin(elapsed * motion.zoomHz * Math.PI * 2)));
      const folds =
        st.mode === "refold"
          ? st.folds + (reduced ? 0 : motion.foldOsc * Math.sin(elapsed * 0.6))
          : 0;
      loom.draw({
        blend: st.selectedMorphSrc ? 0 : st.mode === "morph" || st.playing ? st.blend : 0,
        rot,
        zoom,
        folds: Math.max(2, folds),
        offset: st.offset + (reduced ? 0 : motion.offsetAmp),
        hue: st.hue + (reduced ? 0 : motion.hueAmp * Math.sin(elapsed * 0.45)),
        pulse: st.pulse * motion.pulseAmp,
        time: elapsed,
        refold: st.mode === "refold",
        vignette: st.vignette,
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    setReady(true);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      loom.destroy();
    };
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
      <div className="relative aspect-square w-full max-w-[min(100%,72vh)]">
        {!ready && !failed && (
          <img
            src={selectedMorphSrc ?? plate.src}
            alt={plate.title}
            className="absolute inset-0 size-full rounded-full object-cover opacity-80"
          />
        )}
        {failed && (
          <img
            src={selectedMorphSrc ?? plate.src}
            alt={plate.title}
            className="absolute inset-0 size-full rounded-full object-cover"
          />
        )}
        <canvas
          ref={canvasRef}
          className={cn("absolute inset-0 size-full", failed && "hidden")}
          aria-label={`${plate.title} kaleidoscope loom`}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="rounded-full bg-void/70 px-4 py-1.5 text-center backdrop-blur-sm">
            <p className="font-display text-sm text-cream">
              {selectedMorphSrc ? "Morph keyframe" : plate.title}
              {!selectedMorphSrc && blend > 0.04 ? (
                <span className="text-gold"> → {next.title}</span>
              ) : null}
            </p>
            <p className="text-[0.65rem] tracking-[0.22em] text-muted uppercase">
              {plate.symmetry}-fold · {plate.folds}
              {blend > 0.04 ? ` · blend ${Math.round(blend * 100)}%` : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button size="icon" variant="ghost" aria-label="Previous plate" onClick={() => useStudio.getState().stepPlate(-1)}>
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="gold"
          aria-label={playing ? "Pause sequence" : "Play sequence"}
          onClick={() => useStudio.getState().togglePlaying()}
        >
          {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
        </Button>
        <Button size="icon" variant="ghost" aria-label="Next plate" onClick={() => useStudio.getState().stepPlate(1)}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Hexagon,
  Maximize,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Wand2,
} from "lucide-react";
import { LoomGL, loadImage } from "@/lib/loom-gl";
import { cinemaVideoRef } from "@/lib/cinema-ref";
import { MOTION_BY_ID, MOTIONS } from "@/lib/motions";
import { PLATE_BY_ID, PLATES, REELS, formatTimecode, reelById, reelOrdinal } from "@/lib/plates";
import { useStudio, type LoopMode } from "@/store/studio";
import { Button } from "@/components/ui/button";
import { CinemaPlayer, CinemaScrubber } from "@/components/cinema-player";
import { cn } from "@/lib/utils";

const SHOT_SEC = 6;
const MORPH_SEC = 2;
const RATES = [0.5, 1, 1.5, 2];

export function KaleidoStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const activeId = useStudio((s) => s.activeId);
  const nextId = useStudio((s) => s.nextId);
  const blend = useStudio((s) => s.blend);
  const selectedMorphSrc = useStudio((s) => s.selectedMorphSrc);
  const playing = useStudio((s) => s.playing);
  const view = useStudio((s) => s.view);
  const cinemaPaused = useStudio((s) => s.cinemaPaused);
  const refoldLive = useStudio((s) => s.refoldLive);
  const activeReelId = useStudio((s) => s.activeReelId);
  const loopMode = useStudio((s) => s.loopMode);
  const plate = PLATE_BY_ID[activeId] ?? PLATES[0];
  const next = PLATE_BY_ID[nextId] ?? plate;
  const reel = activeReelId ? reelById(activeReelId) : undefined;
  const cinema = view === "cinema";
  const showVideo = cinema;
  const hideCanvas = cinema && !refoldLive;

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
      if (!reduced && !s.frozen) elapsed += dt * s.speed;

      if (s.playing && s.sequence.length > 1 && !s.selectedMorphSrc && s.view === "loom") {
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
      const skipDraw = st.view === "cinema" && !st.refoldLive;

      if (!skipDraw) {
        const aPlate = PLATE_BY_ID[st.activeId] ?? PLATES[0];
        const bPlate = PLATE_BY_ID[st.nextId] ?? aPlate;
        const vid = cinemaVideoRef.current;
        const live = st.view === "cinema" && st.refoldLive && vid && vid.readyState >= 2;

        if (live && vid) {
          loom.upload(0, vid);
          lastA = "__video__";
        } else {
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
        }

        const motion = MOTION_BY_ID[st.motionId] ?? MOTIONS[0];
        const rot = st.rotManual + (reduced || st.frozen ? 0 : elapsed * motion.rotSpeed);
        const zoom =
          st.zoom *
          (1 +
            (reduced || st.frozen
              ? 0
              : motion.zoomAmp * Math.sin(elapsed * motion.zoomHz * Math.PI * 2)));
        const folds =
          st.mode === "refold" || (st.view === "cinema" && st.refoldLive)
            ? st.folds + (reduced || st.frozen ? 0 : motion.foldOsc * Math.sin(elapsed * 0.6))
            : 0;
        loom.draw({
          blend: live
            ? 0
            : st.selectedMorphSrc
              ? 0
              : st.mode === "morph" || st.playing
                ? st.blend
                : 0,
          rot,
          zoom,
          folds: Math.max(2, folds),
          offset: st.offset + (reduced || st.frozen ? 0 : motion.offsetAmp),
          hue: st.hue + (reduced || st.frozen ? 0 : motion.hueAmp * Math.sin(elapsed * 0.45)),
          pulse: st.pulse * motion.pulseAmp,
          time: elapsed,
          refold: st.mode === "refold" || (st.view === "cinema" && st.refoldLive),
          vignette: st.vignette,
        });
      }
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

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (useStudio.getState().view === "cinema" && !useStudio.getState().refoldLive) return;
      e.preventDefault();
      const z = useStudio.getState().zoom;
      const nextZ = Math.min(1.8, Math.max(0.6, z + (e.deltaY > 0 ? -0.045 : 0.045)));
      useStudio.getState().setZoom(nextZ);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const drag = useRef<{ x: number; r: number } | null>(null);
  const isPaused = cinema ? cinemaPaused : !playing;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
      <div
        ref={stageRef}
        className="relative aspect-square w-full max-w-[min(100%,68vh)] touch-none"
        onPointerDown={(e) => {
          if (useStudio.getState().view === "cinema" && !useStudio.getState().refoldLive) return;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, r: useStudio.getState().rotManual };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          useStudio.getState().setRotManual(drag.current.r + dx * 0.008);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onDoubleClick={() => {
          useStudio.getState().setRotManual(0);
          useStudio.getState().setZoom(1.05);
        }}
      >
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
          className={cn("absolute inset-0 size-full", (failed || hideCanvas) && "hidden")}
          aria-label={`${plate.title} kaleidoscope loom`}
        />
        {showVideo && <CinemaPlayer hiddenVisually={refoldLive} />}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="rounded-full bg-void/70 px-4 py-1.5 text-center backdrop-blur-sm">
            <p className="font-display text-sm text-cream">
              {cinema
                ? (reel?.title ?? plate.title)
                : selectedMorphSrc
                  ? "Morph keyframe"
                  : plate.title}
              {!cinema && !selectedMorphSrc && blend > 0.04 ? (
                <span className="text-gold"> → {next.title}</span>
              ) : null}
            </p>
            <p className="text-xs tracking-[0.22em] text-muted uppercase">
              {cinema
                ? `${reelOrdinal(reel?.id ?? "") + 1} / ${REELS.length} · ${reel?.beat ?? "Reel"} · ${formatTimecode(reel?.durationSec ?? 0)} · ${loopLabel(loopMode)}`
                : `${plate.symmetry}-fold · ${plate.folds}${blend > 0.04 ? ` · blend ${Math.round(blend * 100)}%` : ""}`}
            </p>
          </div>
        </div>
      </div>
      <Transport isPaused={isPaused} cinema={cinema} />
    </div>
  );
}

function loopLabel(mode: LoopMode) {
  if (mode === "one") return "loop one";
  if (mode === "all") return "loop all";
  return "play once";
}

function Transport({ isPaused, cinema }: { isPaused: boolean; cinema: boolean }) {
  const muted = useStudio((s) => s.muted);
  const loopMode = useStudio((s) => s.loopMode);
  const rate = useStudio((s) => s.rate);
  const refoldLive = useStudio((s) => s.refoldLive);
  const view = useStudio((s) => s.view);
  const s = useStudio.getState;

  const onStep = (dir: 1 | -1) => {
    if (cinema) s().stepReel(dir);
    else s().stepPlate(dir);
  };

  return (
    <div className="mt-3 flex w-full max-w-[min(100%,68vh)] flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button
          size="sm"
          variant={view === "loom" ? "gold" : "ghost"}
          aria-pressed={view === "loom"}
          onClick={() => s().setView("loom")}
        >
          <Hexagon className="size-3.5" />
          Loom
        </Button>
        <Button
          size="sm"
          variant={view === "cinema" ? "gold" : "ghost"}
          aria-pressed={view === "cinema"}
          onClick={() => s().setView("cinema")}
        >
          <Clapperboard className="size-3.5" />
          Cinema
        </Button>
        <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <Button
          size="icon"
          variant="ghost"
          className="size-11"
          aria-label={cinema ? "Previous reel" : "Previous plate"}
          onClick={() => onStep(-1)}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="gold"
          className="size-11"
          aria-label={isPaused ? (cinema ? "Play reel" : "Play sequence") : cinema ? "Pause reel" : "Pause sequence"}
          onClick={() => s().togglePlaying()}
        >
          {isPaused ? <Play className="ml-0.5 size-4" /> : <Pause className="size-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-11"
          aria-label={cinema ? "Next reel" : "Next plate"}
          onClick={() => onStep(1)}
        >
          <ChevronRight className="size-5" />
        </Button>
        {cinema && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="size-11"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => s().toggleMuted()}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-11"
              aria-label={`Loop ${loopMode}`}
              onClick={() => s().cycleLoopMode()}
            >
              {loopMode === "one" ? (
                <Repeat1 className="size-4 text-gold" />
              ) : (
                <Repeat className={cn("size-4", loopMode === "all" && "text-gold")} />
              )}
            </Button>
            <Button
              size="sm"
              variant={refoldLive ? "gold" : "ghost"}
              aria-pressed={refoldLive}
              onClick={() => s().setRefoldLive(!refoldLive)}
              title="Feed the reel through the kaleidoscope"
            >
              <Wand2 className="size-3.5" />
              Fold
            </Button>
            <button
              type="button"
              className="rounded-md px-2 py-2 text-xs tabular-nums text-muted hover:text-cream"
              onClick={() => {
                const i = RATES.indexOf(rate);
                s().setRate(RATES[(i + 1) % RATES.length]);
              }}
              aria-label={`Playback speed ${rate}x`}
            >
              {rate}×
            </button>
            <Button
              size="icon"
              variant="ghost"
              className="size-11"
              aria-label="Fullscreen"
              onClick={() => {
                const root = document.documentElement;
                if (document.fullscreenElement) void document.exitFullscreen();
                else void root.requestFullscreen?.();
              }}
            >
              <Maximize className="size-4" />
            </Button>
          </>
        )}
      </div>
      {cinema && (
        <div className="flex w-full items-center gap-3 px-2">
          <CinemaScrubber />
        </div>
      )}
      <p className="hidden text-[0.65rem] tracking-wide text-muted sm:block">
        {cinema
          ? "Space play · ← → skip · M mute · L loop · F full · 1–0 jump"
          : "Drag to rotate · scroll to zoom · double-click reset · Space play"}
      </p>
    </div>
  );
}

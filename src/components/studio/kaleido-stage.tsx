import { useEffect, useRef, useState, type PointerEvent as REPointerEvent, type WheelEvent } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CinemaPlayer } from "@/components/studio/cinema-player";
import { JourneyPanel } from "@/components/studio/journey-panel";
import { ReelStrip } from "@/components/studio/reel-strip";
import { fusionOf } from "@/lib/fusions";
import { LoomGL } from "@/lib/loom-gl";
import { BLEND_INDEX, ISOLATE_INDEX, MECHANISM_BY_ID, clamp } from "@/lib/mechanisms";
import { MOTION_BY_ID, MOTIONS } from "@/lib/motions";
import {
  PLATE_BY_ID,
  PLATES,
  REEL_BY_ID,
  REELS,
  formatTimecode,
  loopLabel,
} from "@/lib/plates";
import { REEL_SIGNATURE, nearestFold } from "@/lib/voices";
import { cinemaVideoRef, fuseVideoRef, liveFolds, loomClock, useStudio } from "@/store/studio";

const RATES = [0.5, 1, 1.5, 2];

function LoopIcon({ mode }: { mode: "one" | "all" | "off" }) {
  if (mode === "one") return <Repeat1 className="size-4" strokeWidth={1.7} />;
  if (mode === "off") return <Repeat className="size-4 opacity-40" strokeWidth={1.7} />;
  return <Repeat className="size-4" strokeWidth={1.7} />;
}

export function KaleidoStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const loomRef = useRef<LoomGL | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgBRef = useRef<HTMLImageElement | null>(null);
  const fuseEl = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{ x: number; spin: number } | null>(null);
  const movedRef = useRef(false);
  const [tc, setTc] = useState(0);
  const [dur, setDur] = useState(0);
  const [fs, setFs] = useState(false);
  const [glOk, setGlOk] = useState(true);

  const plateId = useStudio((s) => s.plateId);
  const motionId = useStudio((s) => s.motionId);
  const view = useStudio((s) => s.view);
  const journey = useStudio((s) => s.journey);
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const cinemaPaused = useStudio((s) => s.cinemaPaused);
  const muted = useStudio((s) => s.muted);
  const loopMode = useStudio((s) => s.loopMode);
  const rate = useStudio((s) => s.rate);
  const frozen = useStudio((s) => s.frozen);
  const fuseB = useStudio((s) => s.fuseB);
  const isolate = useStudio((s) => s.isolate);
  const mix = useStudio((s) => s.mix);
  const blend = useStudio((s) => s.blend);
  const stepReel = useStudio((s) => s.stepReel);
  const togglePause = useStudio((s) => s.togglePause);
  const setMuted = useStudio((s) => s.setMuted);
  const cycleLoop = useStudio((s) => s.cycleLoop);
  const setRate = useStudio((s) => s.setRate);
  const setUserSpin = useStudio((s) => s.setUserSpin);
  const setUserZoom = useStudio((s) => s.setUserZoom);
  const resetView = useStudio((s) => s.resetView);

  const plate = PLATE_BY_ID[plateId] ?? PLATES[0];
  const reel = cinemaReelId ? REEL_BY_ID[cinemaReelId] : null;
  const motion = MOTION_BY_ID[motionId] ?? MOTIONS[0];
  const partner = fuseB ? REEL_BY_ID[fuseB] : null;
  const fuse = reel && partner ? fusionOf(reel.id, partner.id) : null;
  const useGL = journey !== "watch";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const loom = new LoomGL(canvas);
      loomRef.current = loom;
      setGlOk(loom.ok);
    } catch {
      setGlOk(false);
    }
    return () => {
      loomRef.current?.dispose();
      loomRef.current = null;
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      imgRef.current = img;
    };
    img.src = plate.src;
    return () => {
      img.onload = null;
    };
  }, [plate.src]);

  useEffect(() => {
    if (!partner) {
      imgBRef.current = null;
      return;
    }
    const plateB = PLATE_BY_ID[partner.plateId];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgBRef.current = img;
    };
    img.src = plateB.src;
    return () => {
      img.onload = null;
    };
  }, [partner]);

  useEffect(() => {
    const el = fuseEl.current;
    fuseVideoRef.current = el;
    if (!el || !partner || (journey !== "fuse" && journey !== "score")) {
      if (el) el.pause();
      return;
    }
    if (el.dataset.src !== partner.src) {
      el.dataset.src = partner.src;
      el.src = partner.src;
      el.load();
    }
    el.muted = true;
    el.loop = true;
    el.playbackRate = useStudio.getState().rate;
    void el.play().catch(() => {});
  }, [partner, journey, rate]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      loomClock.tick(dt);
      const s = useStudio.getState();
      const m = MOTION_BY_ID[s.motionId] ?? MOTIONS[0];
      const t = loomClock.now();
      const live = s.journey !== "watch";
      const loom = loomRef.current;
      if (loom && live) {
        const aVid = cinemaVideoRef.current;
        if (s.view === "cinema" && aVid && aVid.readyState >= 2) loom.setSource(aVid);
        else if (imgRef.current) loom.setSource(imgRef.current);

        const wantB = s.journey === "fuse" || s.journey === "score";
        const bVid = fuseVideoRef.current;
        if (wantB && bVid && bVid.readyState >= 2 && bVid.videoWidth > 0) loom.setSourceB(bVid);
        else if (wantB && imgBRef.current) loom.setSourceB(imgBRef.current);
        else loom.setSourceB(null);

        const sig = s.cinemaReelId ? REEL_SIGNATURE[s.cinemaReelId] : null;
        const omega = sig?.omega ?? m.zoomHz;
        const tau = Math.max(0.4, sig?.tau ?? 3.2);
        const damp = Math.exp(-Math.min(t, tau * 4) / tau);
        const w = s.weather;
        const folds = liveFolds(s.plateId, nearestFold(s.plateId, m.folds), s.isolate);
        const spin = m.spin * t * (s.isolate === "spin" ? 1 : 0.35 + 0.65 * damp) * w + s.userSpin;
        const zoom = clamp(
          (1 + m.zoomAmp * w * damp * Math.sin(t * omega * Math.PI * 2) + m.breath * w * Math.sin(t * 0.7)) *
            s.userZoom,
          0.55,
          1.85,
        );
        const chroma = s.isolate === "chroma" || s.isolate === "all" ? s.chroma * w : 0;
        const flare = s.isolate === "flare" || s.isolate === "all" ? s.flare * w : 0;
        loom.setParams({
          folds,
          spin,
          zoom,
          mix: wantB ? s.mix : 0,
          blend: BLEND_INDEX[s.blend],
          isolate: ISOLATE_INDEX[s.isolate],
          chroma,
          vignette: s.vignette,
          flare,
        });
        loom.frame();
      }
      const v = cinemaVideoRef.current;
      if (s.view === "cinema" && v) {
        setTc(v.currentTime || 0);
        setDur(Number.isFinite(v.duration) ? v.duration : 0);
      } else {
        setTc(t);
        setDur(0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onFs = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const interactive = useGL;
  const onPointerDown = (e: REPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    movedRef.current = false;
    dragRef.current = { x: e.clientX, spin: useStudio.getState().userSpin };
  };
  const onPointerMove = (e: REPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    if (Math.abs(dx) > 3) movedRef.current = true;
    setUserSpin(dragRef.current.spin + dx * 0.008);
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!interactive) return;
    e.preventDefault();
    const z = useStudio.getState().userZoom;
    setUserZoom(z * (e.deltaY > 0 ? 0.94 : 1.06));
  };
  const onDiscClick = () => {
    if (movedRef.current) return;
    if (view === "cinema") togglePause();
  };

  const toggleFs = () => {
    const el = discRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  };

  const loomPaused = frozen != null && view === "loom";
  const playing = view === "cinema" ? !cinemaPaused : !loomPaused;
  const title = reel?.title ?? plate.title;
  const sig = reel ? REEL_SIGNATURE[reel.id] : null;
  const overlay =
    journey === "fuse" && partner
      ? `Fuse · ${fuse?.name ?? `${reel?.beat} × ${partner.beat}`} · ${Math.round(mix * 100)}% ${blend}`
      : journey === "isolate"
        ? `Isolate · ${MECHANISM_BY_ID[isolate].title} · fold ${isolate === "fold" || isolate === "all" ? "native" : "held at 2"}`
        : journey === "score"
          ? `Score · ${fuse?.name ?? title}`
          : reel
            ? `Watch · ${reel.beat} · ${formatTimecode(tc)}`
            : `${plate.title} · ${formatTimecode(tc)}`;

  const epithet =
    journey === "fuse" && fuse
      ? fuse.unique
      : journey === "isolate"
        ? MECHANISM_BY_ID[isolate].math
        : journey === "score"
          ? (fuse?.keep ?? sig?.unique ?? plate.epithet)
          : (sig?.unique ?? plate.epithet);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-3">
      <video
        ref={fuseEl}
        className="pointer-events-none absolute h-px w-px opacity-0"
        playsInline
        muted
        loop
        crossOrigin="anonymous"
        aria-hidden
      />
      <div
        ref={discRef}
        className="relative mx-auto aspect-square w-full max-w-[min(100%,62vh)] select-none"
      >
        <div
          className="cinema-disc relative size-full bg-elevated shadow-[var(--shadow-disc)]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          onDoubleClick={() => (interactive ? resetView() : undefined)}
          onClick={onDiscClick}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full"
            style={{ opacity: useGL ? 1 : 0, pointerEvents: "none" }}
          />
          {view === "cinema" && (
            <div
              className="absolute inset-0"
              style={{
                opacity: useGL ? 0 : 1,
                pointerEvents: useGL ? "none" : "auto",
              }}
            >
              <CinemaPlayer />
            </div>
          )}
          {!glOk && useGL && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
              WebGL2 unavailable
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-6">
          <div className="max-w-[90%] rounded-full bg-bg/70 px-3 py-1 text-center font-mono text-[11px] leading-tight tabular-nums text-fg/90 backdrop-blur-sm">
            {overlay}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button size="icon" variant="ghost" onClick={() => stepReel(-1)} aria-label="Previous reel" title="Previous">
          <ChevronsLeft className="size-4" strokeWidth={1.7} />
        </Button>
        <Button size="icon" variant="primary" onClick={togglePause} aria-label={playing ? "Pause" : "Play"} title="Play">
          {playing ? <Pause className="size-4" strokeWidth={1.7} /> : <Play className="size-4" strokeWidth={1.7} />}
        </Button>
        <Button size="icon" variant="ghost" onClick={() => stepReel(1)} aria-label="Next reel" title="Next">
          <ChevronsRight className="size-4" strokeWidth={1.7} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMuted(!muted)}
          aria-label={muted ? "Unmute" : "Mute"}
          title="Mute"
        >
          {muted ? <VolumeX className="size-4" strokeWidth={1.7} /> : <Volume2 className="size-4" strokeWidth={1.7} />}
        </Button>
        <Button size="icon" variant="ghost" onClick={cycleLoop} aria-label={loopLabel(loopMode)} title={loopLabel(loopMode)}>
          <LoopIcon mode={loopMode} />
        </Button>
        {RATES.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={rate === r ? "primary" : "quiet"}
            onClick={() => setRate(r)}
            className="hidden min-w-10 font-mono tabular-nums sm:inline-flex"
          >
            {r === 1 ? "1×" : `${r}×`}
          </Button>
        ))}
        <Button size="icon" variant="ghost" onClick={toggleFs} aria-label="Fullscreen" title="Fullscreen">
          {fs ? <Minimize2 className="size-4" strokeWidth={1.7} /> : <Maximize2 className="size-4" strokeWidth={1.7} />}
        </Button>
      </div>

      {view === "cinema" && reel && dur > 0 && (
        <input
          type="range"
          min={0}
          max={dur}
          step={0.01}
          value={Math.min(tc, dur)}
          aria-label="Scrub reel"
          className="mx-auto h-1 w-full max-w-md cursor-pointer appearance-none rounded-full bg-line accent-accent"
          onChange={(e) => {
            const v = cinemaVideoRef.current;
            if (!v) return;
            v.currentTime = Number(e.target.value);
          }}
        />
      )}

      <p className="text-center text-sm text-muted">
        <span className="font-display text-fg">{title}</span>
        <span className="mx-2 text-faint">/</span>
        <span className="text-muted">{epithet}</span>
      </p>

      <JourneyPanel />
      <ReelStrip />
    </section>
  );
}

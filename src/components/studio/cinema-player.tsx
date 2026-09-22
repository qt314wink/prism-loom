import { useCallback, useEffect, useRef, useState } from "react";
import { Loader, RotateCcw, VolumeX } from "lucide-react";
import { REEL_BY_ID, nextReel, type Reel } from "@/lib/plates";
import { cinemaVideoRef, useStudio } from "@/store/studio";

const LOOP_AHEAD = 0.22;

function loadSrc(el: HTMLVideoElement, src: string): Promise<void> {
  if (el.dataset.src === src && el.readyState >= 2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const onCan = () => {
      cleanup();
      resolve();
    };
    const onErr = () => {
      cleanup();
      reject(new Error("load"));
    };
    const cleanup = () => {
      el.removeEventListener("canplay", onCan);
      el.removeEventListener("error", onErr);
    };
    el.addEventListener("canplay", onCan);
    el.addEventListener("error", onErr);
    el.dataset.src = src;
    el.src = src;
    el.load();
  });
}

export function CinemaPlayer() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const frontIsA = useRef(true);
  const warming = useRef(false);
  const gen = useRef(0);
  const [frontA, setFrontA] = useState(true);
  const [posterOn, setPosterOn] = useState(true);
  const [spin, setSpin] = useState(false);
  const [failed, setFailed] = useState(false);
  const [needSound, setNeedSound] = useState(false);

  const reelId = useStudio((s) => s.cinemaReelId);
  const paused = useStudio((s) => s.cinemaPaused);
  const muted = useStudio((s) => s.muted);
  const loopMode = useStudio((s) => s.loopMode);
  const rate = useStudio((s) => s.rate);
  const playReel = useStudio((s) => s.playReel);
  const setPaused = useStudio((s) => s.setCinemaPaused);
  const setMuted = useStudio((s) => s.setMuted);

  const front = useCallback(() => (frontIsA.current ? aRef.current : bRef.current), []);
  const back = useCallback(() => (frontIsA.current ? bRef.current : aRef.current), []);

  const syncRef = useCallback(() => {
    cinemaVideoRef.current = front();
  }, [front]);

  const applyTransport = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = useStudio.getState().muted;
    el.playbackRate = useStudio.getState().rate;
    el.loop = useStudio.getState().loopMode === "one";
  }, []);

  const preloadNext = useCallback(
    (current: Reel) => {
      if (useStudio.getState().loopMode !== "all") return;
      const b = back();
      const nxt = nextReel(current.id);
      if (!b || !nxt) return;
      applyTransport(b);
      void loadSrc(b, nxt.src).catch(() => {});
    },
    [applyTransport, back],
  );

  const swapToBack = useCallback(() => {
    frontIsA.current = !frontIsA.current;
    setFrontA(frontIsA.current);
    warming.current = false;
    const old = back();
    old?.pause();
    syncRef();
    const nf = front();
    applyTransport(nf);
    if (nf && !useStudio.getState().cinemaPaused) {
      void nf.play().catch(() => {});
    }
    setPosterOn(!(nf && nf.currentTime > 0.04));
  }, [applyTransport, back, front, syncRef]);

  useEffect(() => {
    if (!reelId) {
      cinemaVideoRef.current = null;
      return;
    }
    const reel = REEL_BY_ID[reelId];
    if (!reel) return;
    const f = front();
    const b = back();
    if (!f || !b) return;

    const backHas =
      b.dataset.src === reel.src && b.readyState >= 2 && (b.currentTime > 0.02 || warming.current);
    if (backHas) {
      swapToBack();
      preloadNext(reel);
      return;
    }

    gen.current += 1;
    const g = gen.current;
    warming.current = false;
    setFailed(false);
    setPosterOn(true);
    applyTransport(f);
    try {
      if (f.dataset.src === reel.src && f.currentTime > 0.2) {
        /* keep going */
      } else {
        f.currentTime = 0;
      }
    } catch {
      /* ignore seek */
    }
    syncRef();
    void loadSrc(f, reel.src)
      .then(() => {
        if (g !== gen.current) return;
        if (!useStudio.getState().cinemaPaused) {
          return f.play().catch(() => setNeedSound(true));
        }
      })
      .then(() => {
        if (g !== gen.current) return;
        preloadNext(reel);
      })
      .catch(() => {
        if (g === gen.current) setFailed(true);
      });
  }, [reelId, applyTransport, back, front, preloadNext, swapToBack, syncRef]);

  useEffect(() => {
    applyTransport(aRef.current);
    applyTransport(bRef.current);
  }, [muted, rate, loopMode, applyTransport]);

  useEffect(() => {
    const v = front();
    if (!v || !reelId) return;
    if (paused) v.pause();
    else void v.play().catch(() => setNeedSound(true));
  }, [paused, reelId, front]);

  useEffect(() => {
    let t = 0;
    if (posterOn && !paused && reelId && !failed) {
      t = window.setTimeout(() => setSpin(true), 160);
    } else {
      setSpin(false);
    }
    return () => clearTimeout(t);
  }, [posterOn, paused, reelId, failed]);

  const onTime = useCallback(
    (el: HTMLVideoElement) => {
      if (el !== front()) return;
      if (el.currentTime > 0.04) setPosterOn(false);
      const reel = reelId ? REEL_BY_ID[reelId] : null;
      if (!reel || !el.duration || !Number.isFinite(el.duration)) return;
      const remain = el.duration - el.currentTime;
      const mode = useStudio.getState().loopMode;
      if (mode === "all" && remain < LOOP_AHEAD && !warming.current) {
        const nxt = nextReel(reel.id);
        const b = back();
        if (b && b.dataset.src === nxt.src && b.readyState >= 2) {
          warming.current = true;
          applyTransport(b);
          if (b.paused) {
            void b.play().catch(() => {});
          }
        }
      }
    },
    [applyTransport, back, front, reelId],
  );

  const onEnded = useCallback(
    (el: HTMLVideoElement) => {
      if (el !== front()) return;
      const reel = reelId ? REEL_BY_ID[reelId] : null;
      if (!reel) return;
      const mode = useStudio.getState().loopMode;
      if (mode === "all") {
        playReel(nextReel(reel.id).id);
      } else if (mode === "off") {
        setPaused(true);
        setPosterOn(false);
      }
    },
    [front, playReel, reelId, setPaused],
  );

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    const timeA = () => a && onTime(a);
    const timeB = () => b && onTime(b);
    const endA = () => a && onEnded(a);
    const endB = () => b && onEnded(b);
    a?.addEventListener("timeupdate", timeA);
    b?.addEventListener("timeupdate", timeB);
    a?.addEventListener("ended", endA);
    b?.addEventListener("ended", endB);
    const playing = () => {
      const f = front();
      if (f && f.currentTime > 0.04) setPosterOn(false);
    };
    a?.addEventListener("playing", playing);
    b?.addEventListener("playing", playing);
    return () => {
      a?.removeEventListener("timeupdate", timeA);
      b?.removeEventListener("timeupdate", timeB);
      a?.removeEventListener("ended", endA);
      b?.removeEventListener("ended", endB);
      a?.removeEventListener("playing", playing);
      b?.removeEventListener("playing", playing);
    };
  }, [front, onEnded, onTime]);

  const retry = useCallback(() => {
    const f = front();
    const reel = reelId ? REEL_BY_ID[reelId] : null;
    if (!f || !reel) return;
    setFailed(false);
    setPosterOn(true);
    delete f.dataset.src;
    void loadSrc(f, reel.src)
      .then(() => f.play())
      .catch(() => setFailed(true));
  }, [front, reelId]);

  const reel = reelId ? REEL_BY_ID[reelId] : null;
  if (!reel) return null;

  return (
    <div className="cinema-disc absolute inset-0 overflow-hidden bg-bg">
      <video
        ref={aRef}
        id={frontA ? "cinema-video" : undefined}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: frontA ? 1 : 0, zIndex: frontA ? 2 : 1 }}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        poster={frontA ? reel.poster : undefined}
        aria-label={reel.title}
      />
      <video
        ref={bRef}
        id={frontA ? undefined : "cinema-video"}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: frontA ? 0 : 1, zIndex: frontA ? 1 : 2 }}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        aria-hidden={frontA}
      />
      <img
        src={reel.poster}
        alt=""
        className="pointer-events-none absolute inset-0 z-[3] size-full object-cover transition-opacity duration-[400ms] ease-[var(--ease-smooth-out)]"
        style={{ opacity: posterOn ? 1 : 0 }}
      />
      {spin && (
        <div className="absolute inset-0 z-[4] flex items-center justify-center">
          <Loader className="size-7 animate-spin text-fg/70" strokeWidth={1.5} />
        </div>
      )}
      {failed && (
        <button
          type="button"
          onClick={retry}
          className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-2 bg-bg/70 text-sm text-fg"
        >
          <RotateCcw className="size-5" strokeWidth={1.6} />
          Retry reel
        </button>
      )}
      {muted && !failed && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMuted(false);
            setNeedSound(false);
          }}
          className="absolute bottom-4 left-1/2 z-[5] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-elevated/90 px-3 py-1.5 text-xs font-medium text-fg shadow-[var(--shadow-border)] backdrop-blur-sm"
        >
          <VolumeX className="size-3.5" strokeWidth={1.8} />
          {needSound ? "Tap to play" : "Tap for sound"}
        </button>
      )}
    </div>
  );
}

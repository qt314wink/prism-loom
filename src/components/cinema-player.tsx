import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";
import { cinemaVideoRef } from "@/lib/cinema-ref";
import { formatTimecode, nextReel, reelById, REELS } from "@/lib/plates";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  hiddenVisually?: boolean;
};

const LOOP_AHEAD = 0.22;

function slotHas(el: HTMLVideoElement | null, src: string) {
  return Boolean(el && el.getAttribute("data-src") === src && el.readyState >= 2);
}

export function CinemaPlayer({ className, hiddenVisually }: Props) {
  const slotA = useRef<HTMLVideoElement>(null);
  const slotB = useRef<HTMLVideoElement>(null);
  const frontRef = useRef<0 | 1>(0);
  const warmingRef = useRef(false);
  const playGen = useRef(0);
  const [front, setFront] = useState<0 | 1>(0);

  const activeReelId = useStudio((s) => s.activeReelId);
  const cinemaPaused = useStudio((s) => s.cinemaPaused);
  const muted = useStudio((s) => s.muted);
  const loopMode = useStudio((s) => s.loopMode);
  const rate = useStudio((s) => s.rate);
  const reel = activeReelId ? reelById(activeReelId) : undefined;

  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(reel?.durationSec ?? 0);
  const [buffering, setBuffering] = useState(true);
  const [spin, setSpin] = useState(false);
  const [failed, setFailed] = useState(false);

  const frontEl = () => (frontRef.current === 0 ? slotA.current : slotB.current);
  const backEl = () => (frontRef.current === 0 ? slotB.current : slotA.current);

  const bindFront = (el: HTMLVideoElement | null) => {
    cinemaVideoRef.current = el;
    if (el) el.id = "cinema-video";
    const other = el === slotA.current ? slotB.current : slotA.current;
    if (other && other.id === "cinema-video") other.removeAttribute("id");
  };

  const swapTo = (which: 0 | 1) => {
    warmingRef.current = false;
    frontRef.current = which;
    setFront(which);
    bindFront(which === 0 ? slotA.current : slotB.current);
    const idle = which === 0 ? slotB.current : slotA.current;
    idle?.pause();
  };

  const armNext = (fromId: string) => {
    const nxt = nextReel(fromId);
    const back = backEl();
    if (!back || !nxt) return;
    if (back.getAttribute("data-src") === nxt.src) return;
    back.setAttribute("data-src", nxt.src);
    back.src = nxt.src;
    back.muted = true;
    back.load();
  };

  useEffect(() => {
    bindFront(frontEl());
    return () => {
      if (cinemaVideoRef.current === slotA.current || cinemaVideoRef.current === slotB.current) {
        cinemaVideoRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!reel) return;
    const a = slotA.current;
    const b = slotB.current;
    if (!a || !b) return;
    setFailed(false);
    setProgress(0);
    setCurrent(0);
    setDuration(reel.durationSec);

    if (slotHas(frontEl(), reel.src)) {
      bindFront(frontEl());
      setBuffering(false);
      armNext(reel.id);
      return;
    }
    if (slotHas(backEl(), reel.src)) {
      const incoming = backEl()!;
      if (!warmingRef.current) {
        try {
          incoming.currentTime = 0;
        } catch {
          /* not seekable yet */
        }
      }
      incoming.muted = useStudio.getState().muted;
      incoming.playbackRate = useStudio.getState().rate;
      incoming.loop = useStudio.getState().loopMode === "one";
      swapTo(frontRef.current === 0 ? 1 : 0);
      setBuffering(incoming.readyState < 3);
      armNext(reel.id);
      return;
    }

    warmingRef.current = false;
    setBuffering(true);
    const f = frontEl()!;
    f.setAttribute("data-src", reel.src);
    f.src = reel.src;
    f.loop = useStudio.getState().loopMode === "one";
    f.load();
    bindFront(f);
    armNext(reel.id);
  }, [reel?.id, reel?.src, reel?.durationSec]);

  useEffect(() => {
    const f = frontEl();
    if (f) {
      f.muted = muted;
      f.playbackRate = rate;
      f.loop = loopMode === "one";
    }
    const b = backEl();
    if (b) {
      b.playbackRate = rate;
      b.loop = false;
    }
  }, [muted, rate, loopMode, front]);

  useEffect(() => {
    const v = frontEl();
    if (!v || !reel) return;
    const gen = ++playGen.current;
    if (cinemaPaused) {
      v.pause();
      backEl()?.pause();
      return;
    }
    let cancelled = false;
    const kick = async () => {
      if (cancelled || playGen.current !== gen) return;
      try {
        await v.play();
      } catch {
        if (cancelled || playGen.current !== gen) return;
        if (!v.muted) {
          v.muted = true;
          useStudio.getState().setMuted(true);
          try {
            await v.play();
            return;
          } catch {
            /* fall through */
          }
        }
        useStudio.getState().setCinemaPaused(true);
      }
    };
    if (v.readyState >= 3) void kick();
    else v.addEventListener("canplay", kick, { once: true });
    return () => {
      cancelled = true;
      v.removeEventListener("canplay", kick);
    };
  }, [cinemaPaused, reel?.id, front]);

  useEffect(() => {
    if (!buffering) {
      setSpin(false);
      return;
    }
    const t = window.setTimeout(() => setSpin(true), 160);
    return () => window.clearTimeout(t);
  }, [buffering]);

  useEffect(() => {
    const a = slotA.current;
    const b = slotB.current;
    if (!a || !b) return;

    const onTime = (ev: Event) => {
      const v = ev.currentTarget as HTMLVideoElement;
      if (v !== frontEl()) return;
      const d = v.duration || reel?.durationSec || 0;
      const t = v.currentTime || 0;
      setCurrent(t);
      setDuration(d);
      setProgress(d > 0 ? Math.min(1, t / d) : 0);
      const st = useStudio.getState();
      if (st.loopMode === "one" && d > 0 && d - t < 0.05 && t > 0.2) {
        try {
          v.currentTime = 0.001;
        } catch {
          /* ignore */
        }
      }
      if (st.loopMode === "all" && d > 0 && d - t < LOOP_AHEAD && t > 0.4 && !warmingRef.current) {
        const nxt = reel ? nextReel(reel.id) : REELS[0];
        const back = backEl();
        if (back && nxt) {
          if (back.getAttribute("data-src") !== nxt.src) {
            back.setAttribute("data-src", nxt.src);
            back.src = nxt.src;
            back.load();
          }
          if (back.readyState >= 2) {
            warmingRef.current = true;
            back.muted = true;
            back.playbackRate = st.rate;
            try {
              back.currentTime = 0;
            } catch {
              /* ignore */
            }
            void back.play().catch(() => {
              warmingRef.current = false;
            });
          }
        }
      }
    };
    const onWaiting = (ev: Event) => {
      if (ev.currentTarget === frontEl()) setBuffering(true);
    };
    const onPlaying = (ev: Event) => {
      if (ev.currentTarget === frontEl()) {
        setBuffering(false);
        setFailed(false);
      }
    };
    const onCanPlay = (ev: Event) => {
      if (ev.currentTarget === frontEl()) setBuffering(false);
    };
    const onError = (ev: Event) => {
      if (ev.currentTarget === frontEl()) {
        setFailed(true);
        setBuffering(false);
      }
    };
    const onEnded = (ev: Event) => {
      if (ev.currentTarget !== frontEl()) return;
      const st = useStudio.getState();
      if (st.loopMode === "all") {
        const nxt = reel ? nextReel(reel.id) : REELS[0];
        if (nxt) st.playReel(nxt.id);
      } else if (st.loopMode === "off") {
        st.setCinemaPaused(true);
      }
    };
    const onLoaded = (ev: Event) => {
      const v = ev.currentTarget as HTMLVideoElement;
      if (v === frontEl() && v.duration && Number.isFinite(v.duration)) setDuration(v.duration);
    };

    for (const v of [a, b]) {
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("waiting", onWaiting);
      v.addEventListener("playing", onPlaying);
      v.addEventListener("canplay", onCanPlay);
      v.addEventListener("error", onError);
      v.addEventListener("ended", onEnded);
      v.addEventListener("loadedmetadata", onLoaded);
    }
    return () => {
      for (const v of [a, b]) {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("waiting", onWaiting);
        v.removeEventListener("playing", onPlaying);
        v.removeEventListener("canplay", onCanPlay);
        v.removeEventListener("error", onError);
        v.removeEventListener("ended", onEnded);
        v.removeEventListener("loadedmetadata", onLoaded);
      }
    };
  }, [reel?.id, reel?.durationSec, loopMode, front]);

  if (!reel) return null;

  const ring = 49.2;
  const circ = 2 * Math.PI * ring;

  const onDiscClick = () => {
    useStudio.getState().togglePlaying();
  };

  const retry = () => {
    setFailed(false);
    setBuffering(true);
    const f = frontEl();
    if (f && reel) {
      f.setAttribute("data-src", reel.src);
      f.src = reel.src;
      f.load();
      useStudio.getState().setCinemaPaused(false);
    }
  };

  return (
    <div
      className={cn("absolute inset-0", hiddenVisually && "pointer-events-none opacity-0", className)}
      onClick={onDiscClick}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <img
        src={reel.poster}
        alt=""
        className={cn(
          "cinema-disc absolute inset-0 size-full object-cover transition-opacity duration-200",
          current > 0.04 && !buffering ? "opacity-0" : "opacity-100",
        )}
      />
      <video
        ref={slotA}
        className={cn(
          "cinema-disc absolute inset-0 size-full object-cover transition-opacity duration-150",
          front === 0 ? "opacity-100" : "opacity-0",
        )}
        poster={reel.poster}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        muted={front === 0 ? muted : true}
        loop={front === 0 && loopMode === "one"}
        aria-label={front === 0 ? reel.title : undefined}
        aria-hidden={front !== 0}
      />
      <video
        ref={slotB}
        className={cn(
          "cinema-disc absolute inset-0 size-full object-cover transition-opacity duration-150",
          front === 1 ? "opacity-100" : "opacity-0",
        )}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        muted={front === 1 ? muted : true}
        loop={front === 1 && loopMode === "one"}
        aria-label={front === 1 ? reel.title : undefined}
        aria-hidden={front !== 1}
      />
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r={ring}
          fill="none"
          stroke="rgba(212,175,90,0.18)"
          strokeWidth="0.55"
        />
        <circle
          cx="50"
          cy="50"
          r={ring}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      {spin && !failed && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="size-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 grid place-items-center">
          <button
            type="button"
            className="rounded-full bg-void/80 px-4 py-2 text-sm text-cream"
            onClick={(e) => {
              e.stopPropagation();
              retry();
            }}
          >
            Reel failed — retry
          </button>
        </div>
      )}
      {muted && !failed && (
        <button
          type="button"
          className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-void/75 px-3 py-1.5 text-xs tracking-wide text-gold uppercase backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            useStudio.getState().setMuted(false);
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <VolumeX className="size-3.5" />
            Tap for sound
          </span>
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <p className="rounded-full bg-void/70 px-3 py-1 font-mono text-xs tabular-nums text-gold backdrop-blur-sm">
          {formatTimecode(current)} / {formatTimecode(duration)}
        </p>
      </div>
    </div>
  );
}

export function CinemaScrubber() {
  const video = () => cinemaVideoRef.current;
  const activeReelId = useStudio((s) => s.activeReelId);
  const reel = activeReelId ? reelById(activeReelId) : undefined;
  const [value, setValue] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const v = video();
      if (!v || dragging) return;
      const d = v.duration || reel?.durationSec || 1;
      setValue(d > 0 ? v.currentTime / d : 0);
    }, 80);
    return () => window.clearInterval(id);
  }, [dragging, reel?.durationSec, activeReelId]);

  if (!reel) return null;

  return (
    <label className="flex min-w-0 flex-1 items-center gap-2">
      <span className="sr-only">Seek {reel.title}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={value}
        className="h-2 w-full accent-gold"
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onChange={(e) => {
          const n = Number(e.target.value);
          setValue(n);
          const v = video();
          if (v && v.duration) v.currentTime = n * v.duration;
        }}
      />
    </label>
  );
}

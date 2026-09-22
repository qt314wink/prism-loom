import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fusionOf } from "@/lib/fusions";
import { BLEND_INDEX, clamp, type BlendId, type IsolateId } from "@/lib/mechanisms";
import {
  DEFAULT_SEQUENCE,
  REELS,
  REEL_BY_ID,
  firstReelForPlate,
  nextReel,
  prevReel,
  type PlateId,
  type ReelId,
} from "@/lib/plates";
import type { MotionId } from "@/lib/motions";
import { REEL_SIGNATURE, legalPartnerReels, nearestFold, voiceOf } from "@/lib/voices";

export type View = "loom" | "cinema";
export type LoopMode = "one" | "all" | "off";
export type Journey = "watch" | "isolate" | "fuse" | "score";

export const cinemaVideoRef: { current: HTMLVideoElement | null } = { current: null };
export const fuseVideoRef: { current: HTMLVideoElement | null } = { current: null };

export const loomClock = {
  elapsed: 0,
  frozen: null as number | null,
  now() {
    return this.frozen ?? this.elapsed;
  },
  tick(dt: number) {
    if (this.frozen == null) this.elapsed += dt;
  },
  freeze() {
    this.frozen = this.elapsed;
  },
  thaw() {
    this.frozen = null;
  },
  reset() {
    this.elapsed = 0;
    this.frozen = null;
  },
};

const LOOP_CYCLE: LoopMode[] = ["all", "one", "off"];
const JOURNEY: Journey[] = ["watch", "isolate", "fuse", "score"];

export const JOURNEY_NEXT: Record<Journey, Journey | null> = {
  watch: "isolate",
  isolate: "fuse",
  fuse: "score",
  score: null,
};

type Studio = {
  plateId: PlateId;
  motionId: MotionId;
  view: View;
  journey: Journey;
  sequence: PlateId[];
  cinemaReelId: ReelId | null;
  cinemaPaused: boolean;
  muted: boolean;
  loopMode: LoopMode;
  rate: number;
  refoldLive: boolean;
  frozen: number | null;
  userSpin: number;
  userZoom: number;
  isolate: IsolateId;
  fuseB: ReelId | null;
  mix: number;
  blend: BlendId;
  weather: number;
  chroma: number;
  flare: number;
  vignette: number;
  seed: number;
  mobileTab: "stage" | "library";
  setPlate: (id: PlateId) => void;
  setMotion: (id: MotionId) => void;
  setJourney: (j: Journey) => void;
  setMobileTab: (t: "stage" | "library") => void;
  setIsolate: (id: IsolateId) => void;
  setFuseB: (id: ReelId | null) => void;
  setMix: (n: number) => void;
  setBlend: (b: BlendId) => void;
  setWeather: (n: number) => void;
  setChroma: (n: number) => void;
  setFlare: (n: number) => void;
  rerollSeed: () => void;
  playReel: (id: ReelId) => void;
  playPlateReel: (id: PlateId) => void;
  playJourney: () => void;
  ensureCinema: () => void;
  closeCinema: () => void;
  stepReel: (dir: -1 | 1) => void;
  stepLegal: (dir: -1 | 1) => void;
  togglePause: () => void;
  setCinemaPaused: (p: boolean) => void;
  setMuted: (m: boolean) => void;
  cycleLoop: () => void;
  setLoopMode: (m: LoopMode) => void;
  setRate: (r: number) => void;
  toggleRefold: () => void;
  setUserSpin: (n: number) => void;
  setUserZoom: (n: number) => void;
  resetView: () => void;
};

function pickLegal(plateId: PlateId, current: ReelId | null): ReelId | null {
  const list = legalPartnerReels(plateId);
  if (current && list.includes(current)) return current;
  return list[0] ?? null;
}

function ensureReel(s: { cinemaReelId: ReelId | null; plateId: PlateId }): ReelId {
  if (s.cinemaReelId && REEL_BY_ID[s.cinemaReelId]) return s.cinemaReelId;
  return (firstReelForPlate(s.plateId) ?? REELS[0]).id;
}

export const useStudio = create<Studio>()(
  persist(
    (set, get) => ({
      plateId: "orchid-veil",
      motionId: "drift",
      view: "cinema",
      journey: "watch",
      sequence: DEFAULT_SEQUENCE,
      cinemaReelId: "orchid-veil-bloom",
      cinemaPaused: false,
      muted: true,
      loopMode: "all",
      rate: 1,
      refoldLive: false,
      frozen: null,
      userSpin: 0,
      userZoom: 1,
      isolate: "all",
      fuseB: "jewel-garden-spin",
      mix: 0.42,
      blend: "radial",
      weather: 0.55,
      chroma: 0.04,
      flare: 0.08,
      vignette: 1,
      seed: 424242,
      mobileTab: "stage",
      setPlate: (id) =>
        set({
          plateId: id,
          fuseB: pickLegal(id, get().fuseB),
        }),
      setMotion: (id) => set({ motionId: id }),
      setJourney: (journey) => {
        const s = get();
        const reelId = ensureReel(s);
        const reel = REEL_BY_ID[reelId];
        const next: Partial<Studio> = {
          journey,
          mobileTab: "stage",
          cinemaReelId: reelId,
          view: "cinema",
          plateId: reel.plateId,
        };
        if (journey === "watch") {
          next.isolate = "all";
          next.refoldLive = false;
          next.loopMode = "all";
        }
        if (journey === "isolate") {
          const sig = REEL_SIGNATURE[reelId]?.signature ?? voiceOf(reel.plateId).signature;
          next.isolate = sig;
          next.refoldLive = true;
          next.loopMode = "one";
          if (s.cinemaPaused) {
            next.cinemaPaused = false;
            loomClock.thaw();
            next.frozen = null;
          }
        }
        if (journey === "fuse") {
          const b = pickLegal(reel.plateId, s.fuseB);
          next.fuseB = b;
          next.isolate = "all";
          next.refoldLive = true;
          next.loopMode = "one";
          if (b) {
            const fuse = fusionOf(reelId, b);
            if (fuse) {
              next.mix = fuse.mixBias;
              next.blend = fuse.blendBias;
            }
          }
          if (s.cinemaPaused) {
            next.cinemaPaused = false;
            loomClock.thaw();
            next.frozen = null;
          }
        }
        if (journey === "score") {
          next.refoldLive = true;
          next.loopMode = "one";
          next.isolate = s.isolate === "all" ? "all" : s.isolate;
        }
        set(next);
      },
      setMobileTab: (mobileTab) => set({ mobileTab }),
      setIsolate: (isolate) => set({ isolate }),
      setFuseB: (fuseB) => {
        const a = get().cinemaReelId;
        const fuse = a && fuseB ? fusionOf(a, fuseB) : null;
        set({
          fuseB,
          mix: fuse?.mixBias ?? get().mix,
          blend: fuse?.blendBias ?? get().blend,
        });
      },
      setMix: (n) => set({ mix: clamp(n, 0, 1) }),
      setBlend: (blend) => set({ blend }),
      setWeather: (n) => set({ weather: clamp(n, 0, 1) }),
      setChroma: (n) => set({ chroma: clamp(n, 0, 0.12) }),
      setFlare: (n) => set({ flare: clamp(n, 0, 0.28) }),
      rerollSeed: () => set({ seed: (Math.random() * 1e9) | 0 }),
      playReel: (id) => {
        const reel = REEL_BY_ID[id];
        if (!reel) return;
        const fuseB = pickLegal(reel.plateId, get().fuseB);
        const fuse = fuseB ? fusionOf(id, fuseB) : null;
        loomClock.freeze();
        set({
          cinemaReelId: id,
          view: "cinema",
          cinemaPaused: false,
          frozen: loomClock.elapsed,
          plateId: reel.plateId,
          fuseB,
          mix: fuse?.mixBias ?? get().mix,
          blend: fuse?.blendBias ?? get().blend,
          mobileTab: "stage",
        });
      },
      playPlateReel: (id) => {
        const reel = firstReelForPlate(id);
        if (reel) get().playReel(reel.id);
        else set({ plateId: id, view: "loom", fuseB: pickLegal(id, get().fuseB) });
      },
      playJourney: () => {
        const first = REELS[0];
        if (!first) return;
        set({ loopMode: "all", journey: "watch" });
        get().playReel(first.id);
      },
      ensureCinema: () => {
        const s = get();
        if (s.view === "cinema" && s.cinemaReelId) return;
        const id = ensureReel(s);
        get().playReel(id);
      },
      closeCinema: () => {
        loomClock.thaw();
        set({
          view: "loom",
          cinemaPaused: true,
          frozen: null,
          refoldLive: false,
        });
      },
      stepReel: (dir) => {
        const current =
          get().cinemaReelId ?? firstReelForPlate(get().plateId)?.id ?? REELS[0]?.id;
        if (!current) return;
        const next = dir === 1 ? nextReel(current) : prevReel(current);
        get().playReel(next.id);
      },
      stepLegal: (dir) => {
        const s = get();
        const list = legalPartnerReels(s.plateId);
        if (list.length === 0) return;
        const i = Math.max(0, list.indexOf(s.fuseB as ReelId));
        const n = list[(i + dir + list.length) % list.length];
        if (n) get().setFuseB(n);
      },
      togglePause: () => {
        const s = get();
        if (s.view === "cinema") {
          const cinemaPaused = !s.cinemaPaused;
          if (cinemaPaused) loomClock.freeze();
          else loomClock.thaw();
          set({ cinemaPaused, frozen: cinemaPaused ? loomClock.elapsed : null });
          return;
        }
        if (s.frozen == null) {
          loomClock.freeze();
          set({ frozen: loomClock.elapsed });
        } else {
          loomClock.thaw();
          set({ frozen: null });
        }
      },
      setCinemaPaused: (cinemaPaused) => {
        if (cinemaPaused) loomClock.freeze();
        else loomClock.thaw();
        set({ cinemaPaused, frozen: cinemaPaused ? loomClock.elapsed : null });
      },
      setMuted: (muted) => set({ muted }),
      cycleLoop: () => {
        const i = LOOP_CYCLE.indexOf(get().loopMode);
        set({ loopMode: LOOP_CYCLE[(i + 1) % LOOP_CYCLE.length] ?? "all" });
      },
      setLoopMode: (loopMode) => set({ loopMode }),
      setRate: (rate) => set({ rate }),
      toggleRefold: () => set((s) => ({ refoldLive: !s.refoldLive })),
      setUserSpin: (userSpin) => set({ userSpin }),
      setUserZoom: (userZoom) => set({ userZoom: clamp(userZoom, 0.55, 1.85) }),
      resetView: () => set({ userSpin: 0, userZoom: 1 }),
    }),
    {
      name: "prism-loom-v3",
      partialize: (s) => ({
        plateId: s.plateId,
        motionId: s.motionId,
        muted: s.muted,
        loopMode: s.loopMode,
        rate: s.rate,
        sequence: s.sequence,
        blend: s.blend,
        mix: s.mix,
        weather: s.weather,
        cinemaReelId: s.cinemaReelId,
      }),
    },
  ),
);

export function liveFolds(plateId: PlateId, motionFolds: number, isolate: IsolateId) {
  if (isolate === "spin" || isolate === "breath" || isolate === "chroma" || isolate === "vignette" || isolate === "flare") {
    return 2;
  }
  return nearestFold(plateId, motionFolds);
}

export { BLEND_INDEX, JOURNEY };

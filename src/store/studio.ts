import { create } from "zustand";
import {
  DEFAULT_SEQUENCE,
  REELS,
  nextReel,
  prevReel,
  reelById,
  reelsForPlate,
  type PlateId,
} from "@/lib/plates";
import { type MotionId } from "@/lib/motions";

export type LoomMode = "plate" | "refold" | "morph";
export type DeskTab = "plates" | "motion" | "sequence" | "tokens" | "reels";
export type StudioView = "loom" | "cinema";
export type LoopMode = "one" | "all" | "off";

type StudioState = {
  sequence: PlateId[];
  activeId: PlateId;
  nextId: PlateId;
  blend: number;
  motionId: MotionId;
  mode: LoomMode;
  playing: boolean;
  frozen: boolean;
  speed: number;
  folds: number;
  zoom: number;
  offset: number;
  hue: number;
  pulse: number;
  vignette: number;
  rotManual: number;
  desk: DeskTab;
  selectedMorphSrc: string | null;
  view: StudioView;
  activeReelId: string | null;
  cinemaPaused: boolean;
  muted: boolean;
  loopMode: LoopMode;
  rate: number;
  refoldLive: boolean;
  setActive: (id: PlateId) => void;
  setNext: (id: PlateId) => void;
  setBlend: (n: number) => void;
  setMotion: (id: MotionId) => void;
  setMode: (m: LoomMode) => void;
  setPlaying: (p: boolean) => void;
  togglePlaying: () => void;
  setSpeed: (n: number) => void;
  setFolds: (n: number) => void;
  setZoom: (n: number) => void;
  setOffset: (n: number) => void;
  setHue: (n: number) => void;
  setPulse: (n: number) => void;
  setVignette: (n: number) => void;
  setRotManual: (n: number) => void;
  setDesk: (t: DeskTab) => void;
  setSelectedMorph: (src: string | null) => void;
  syncShot: (id: PlateId, nextId: PlateId, blend: number) => void;
  addToSequence: (id: PlateId) => void;
  removeFromSequence: (index: number) => void;
  resetSequence: () => void;
  stepPlate: (dir: 1 | -1) => void;
  setView: (v: StudioView) => void;
  playReel: (id: string) => void;
  closeCinema: () => void;
  stepReel: (dir: 1 | -1) => void;
  setCinemaPaused: (p: boolean) => void;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;
  setLoopMode: (m: LoopMode) => void;
  cycleLoopMode: () => void;
  setRate: (n: number) => void;
  setRefoldLive: (b: boolean) => void;
  playPlateReel: (id: PlateId) => void;
};

function neighbor(seq: PlateId[], id: PlateId): PlateId {
  const i = seq.indexOf(id);
  if (i < 0) return seq[0] ?? id;
  return seq[(i + 1) % seq.length] ?? id;
}

const LOOP_CYCLE: LoopMode[] = ["one", "all", "off"];

export const useStudio = create<StudioState>((set, get) => ({
  sequence: [...DEFAULT_SEQUENCE],
  activeId: DEFAULT_SEQUENCE[0],
  nextId: DEFAULT_SEQUENCE[1],
  blend: 0,
  motionId: "spin-breathe",
  mode: "plate",
  playing: true,
  frozen: false,
  speed: 1,
  folds: 8,
  zoom: 1.05,
  offset: 0,
  hue: 0,
  pulse: 0.4,
  vignette: 0.65,
  rotManual: 0,
  desk: "reels",
  selectedMorphSrc: null,
  view: "loom",
  activeReelId: null,
  cinemaPaused: true,
  muted: true,
  loopMode: "one",
  rate: 1,
  refoldLive: false,
  setActive: (id) =>
    set((s) => ({
      activeId: id,
      nextId: neighbor(s.sequence, id),
      blend: 0,
      selectedMorphSrc: null,
      view: "loom",
      cinemaPaused: true,
      activeReelId: reelsForPlate(id)[0]?.id ?? s.activeReelId,
    })),
  setNext: (id) => set({ nextId: id }),
  setBlend: (n) => set({ blend: n }),
  setMotion: (id) => set({ motionId: id }),
  setMode: (m) => set({ mode: m, view: "loom" }),
  setPlaying: (p) => set({ playing: p, frozen: !p }),
  togglePlaying: () => {
    const s = get();
    if (s.view === "cinema") {
      set({ cinemaPaused: !s.cinemaPaused });
      return;
    }
    const playing = !s.playing;
    set({ playing, frozen: !playing });
  },
  setSpeed: (n) => set({ speed: n }),
  setFolds: (n) => set({ folds: n }),
  setZoom: (n) => set({ zoom: n }),
  setOffset: (n) => set({ offset: n }),
  setHue: (n) => set({ hue: n }),
  setPulse: (n) => set({ pulse: n }),
  setVignette: (n) => set({ vignette: n }),
  setRotManual: (n) => set({ rotManual: n }),
  setDesk: (t) => set({ desk: t }),
  setSelectedMorph: (src) =>
    set({
      selectedMorphSrc: src,
      blend: src ? 0 : get().blend,
      view: "loom",
      cinemaPaused: true,
    }),
  syncShot: (id, nextId, blend) =>
    set({ activeId: id, nextId, blend, selectedMorphSrc: null }),
  addToSequence: (id) =>
    set((s) => ({ sequence: s.sequence.length >= 16 ? s.sequence : [...s.sequence, id] })),
  removeFromSequence: (index) =>
    set((s) => {
      if (s.sequence.length <= 1) return s;
      const sequence = s.sequence.filter((_, i) => i !== index);
      const activeId = sequence.includes(s.activeId) ? s.activeId : sequence[0];
      return { sequence, activeId, nextId: neighbor(sequence, activeId) };
    }),
  resetSequence: () =>
    set({
      sequence: [...DEFAULT_SEQUENCE],
      activeId: DEFAULT_SEQUENCE[0],
      nextId: DEFAULT_SEQUENCE[1],
      blend: 0,
    }),
  stepPlate: (dir) =>
    set((s) => {
      const i = s.sequence.indexOf(s.activeId);
      const n = s.sequence.length;
      const next = s.sequence[(i + dir + n) % n];
      return {
        activeId: next,
        nextId: neighbor(s.sequence, next),
        blend: 0,
        selectedMorphSrc: null,
        view: "loom",
        cinemaPaused: true,
      };
    }),
  setView: (v) => {
    if (v === "cinema") {
      const s = get();
      const reel =
        (s.activeReelId && reelById(s.activeReelId)) ||
        reelsForPlate(s.activeId)[0] ||
        REELS[0];
      if (!reel) return;
      set({
        view: "cinema",
        activeReelId: reel.id,
        activeId: reel.plateId,
        cinemaPaused: false,
        playing: false,
        frozen: true,
        selectedMorphSrc: null,
        desk: "reels",
      });
      return;
    }
    set({ view: "loom", cinemaPaused: true, frozen: false, playing: true });
  },
  playReel: (id) => {
    const reel = reelById(id);
    if (!reel) return;
    const s = get();
    set({
      view: "cinema",
      activeReelId: id,
      activeId: reel.plateId,
      nextId: neighbor(s.sequence, reel.plateId),
      cinemaPaused: false,
      playing: false,
      frozen: true,
      selectedMorphSrc: null,
      blend: 0,
      motionId: reel.motionId as MotionId,
      desk: "reels",
    });
  },
  closeCinema: () =>
    set({
      view: "loom",
      cinemaPaused: true,
      frozen: false,
      playing: true,
      refoldLive: false,
    }),
  stepReel: (dir) => {
    const s = get();
    const current = s.activeReelId ?? REELS[0]?.id;
    if (!current) return;
    const next = dir === 1 ? nextReel(current) : prevReel(current);
    get().playReel(next.id);
  },
  setCinemaPaused: (p) => set({ cinemaPaused: p }),
  setMuted: (m) => set({ muted: m }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
  setLoopMode: (m) => set({ loopMode: m }),
  cycleLoopMode: () =>
    set((s) => ({
      loopMode: LOOP_CYCLE[(LOOP_CYCLE.indexOf(s.loopMode) + 1) % LOOP_CYCLE.length],
    })),
  setRate: (n) => set({ rate: n }),
  setRefoldLive: (b) => set({ refoldLive: b, mode: b ? "refold" : get().mode }),
  playPlateReel: (id) => {
    const reel = reelsForPlate(id)[0];
    if (reel) get().playReel(reel.id);
    else get().setActive(id);
  },
}));

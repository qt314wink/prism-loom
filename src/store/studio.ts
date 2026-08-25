import { create } from "zustand";
import {
  DEFAULT_SEQUENCE,
  type PlateId,
} from "@/lib/plates";
import { type MotionId } from "@/lib/motions";

export type LoomMode = "plate" | "refold" | "morph";
export type DeskTab = "plates" | "motion" | "sequence" | "tokens" | "reels";

type StudioState = {
  sequence: PlateId[];
  activeId: PlateId;
  nextId: PlateId;
  blend: number;
  motionId: MotionId;
  mode: LoomMode;
  playing: boolean;
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
};

function neighbor(seq: PlateId[], id: PlateId): PlateId {
  const i = seq.indexOf(id);
  if (i < 0) return seq[0] ?? id;
  return seq[(i + 1) % seq.length] ?? id;
}

export const useStudio = create<StudioState>((set, get) => ({
  sequence: [...DEFAULT_SEQUENCE],
  activeId: DEFAULT_SEQUENCE[0],
  nextId: DEFAULT_SEQUENCE[1],
  blend: 0,
  motionId: "spin-breathe",
  mode: "plate",
  playing: true,
  speed: 1,
  folds: 8,
  zoom: 1.05,
  offset: 0,
  hue: 0,
  pulse: 0.4,
  vignette: 0.65,
  rotManual: 0,
  desk: "tokens",
  selectedMorphSrc: null,
  setActive: (id) =>
    set((s) => ({
      activeId: id,
      nextId: neighbor(s.sequence, id),
      blend: 0,
      selectedMorphSrc: null,
    })),
  setNext: (id) => set({ nextId: id }),
  setBlend: (n) => set({ blend: n }),
  setMotion: (id) => set({ motionId: id }),
  setMode: (m) => set({ mode: m }),
  setPlaying: (p) => set({ playing: p }),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  setSpeed: (n) => set({ speed: n }),
  setFolds: (n) => set({ folds: n }),
  setZoom: (n) => set({ zoom: n }),
  setOffset: (n) => set({ offset: n }),
  setHue: (n) => set({ hue: n }),
  setPulse: (n) => set({ pulse: n }),
  setVignette: (n) => set({ vignette: n }),
  setRotManual: (n) => set({ rotManual: n }),
  setDesk: (t) => set({ desk: t }),
  setSelectedMorph: (src) => set({ selectedMorphSrc: src, blend: src ? 0 : get().blend }),
  syncShot: (id, nextId, blend) => set({ activeId: id, nextId, blend, selectedMorphSrc: null }),
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
      return { activeId: next, nextId: neighbor(s.sequence, next), blend: 0, selectedMorphSrc: null };
    }),
}));

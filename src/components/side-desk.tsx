import { useMemo, useState } from "react";
import { Copy, Clapperboard, Hexagon, Layers, Plus, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { SignedIn } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { KEYFRAME_EDITS, PLATE_BY_ID, PLATES, REELS } from "@/lib/plates";
import { compileJsonContext, MOTIONS, promptList, type MotionId } from "@/lib/motions";
import { forgeKeyframe, saveLoom } from "@/lib/loom-api";
import { useStudio, type DeskTab } from "@/store/studio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS: { id: DeskTab; label: string; icon: typeof Hexagon }[] = [
  { id: "tokens", label: "Tokens", icon: Hexagon },
  { id: "motion", label: "Motion", icon: Wand2 },
  { id: "sequence", label: "JSON", icon: Layers },
  { id: "reels", label: "Reels", icon: Clapperboard },
];

export function SideDesk() {
  const desk = useStudio((s) => s.desk);
  const setDesk = useStudio((s) => s.setDesk);

  return (
    <aside className="flex min-h-0 flex-col rounded-2xl bg-panel shadow-[var(--shadow-border)]">
      <div className="flex border-b border-line">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = desk === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setDesk(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs tracking-wide uppercase",
                on ? "text-gold" : "text-muted hover:text-cream",
              )}
            >
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="loom-scroll min-h-0 flex-1 overflow-y-auto p-4">
        {desk === "tokens" && <TokenDesk />}
        {desk === "motion" && <MotionDesk />}
        {desk === "sequence" && <JsonDesk />}
        {desk === "reels" && <ReelDesk />}
      </div>
    </aside>
  );
}

function TokenDesk() {
  const activeId = useStudio((s) => s.activeId);
  const addToSequence = useStudio((s) => s.addToSequence);
  const plate = PLATE_BY_ID[activeId] ?? PLATES[0];
  const user = useCurrentUser();
  const edits = KEYFRAME_EDITS.filter((k) => k.plateId === activeId);
  const [forging, setForging] = useState(false);
  const [forged, setForged] = useState<string | null>(null);

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          id: plate.id,
          title: plate.title,
          symmetry: plate.symmetry,
          folds: plate.folds,
          energy: plate.energy,
          temperature: plate.temperature,
          center: plate.center,
          motifs: plate.motifs,
          texture: plate.texture,
          palette: plate.palette,
          motionNative: plate.motionNative,
          videoStill: plate.videoStill,
          editStill: plate.editStill,
        },
        null,
        2,
      ),
    [plate],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">Extracted tokens</p>
          <h3 className="font-display text-xl text-cream">{plate.title}</h3>
        </div>
        <Button size="sm" onClick={() => addToSequence(plate.id)}>
          <Plus className="size-3.5" />
          Sequence
        </Button>
      </div>
      <p className="text-sm text-muted">{plate.energy}. {plate.texture}.</p>
      <div>
        <p className="mb-2 text-[0.65rem] tracking-[0.2em] text-muted uppercase">Palette</p>
        <div className="flex flex-wrap gap-2">
          {[plate.palette.ground, ...plate.palette.primary, ...plate.palette.accent].map((hex) => (
            <button
              key={hex}
              type="button"
              title={hex}
              onClick={() => {
                void navigator.clipboard.writeText(hex);
                toast("Copied " + hex);
              }}
              className="size-7 rounded-full shadow-[var(--shadow-border)]"
              style={{ background: hex }}
            />
          ))}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">Symmetry</dt>
          <dd>{plate.symmetry}-fold</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">Temp</dt>
          <dd className="capitalize">{plate.temperature}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">Center</dt>
          <dd>{plate.center.motif}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">Motifs</dt>
          <dd>{plate.motifs.join(" · ")}</dd>
        </div>
      </dl>
      {edits.length > 0 && (
        <div>
          <p className="mb-2 text-[0.65rem] tracking-[0.2em] text-muted uppercase">Sequential edits</p>
          <div className="flex gap-2">
            {edits.map((e) => (
              <div key={e.src} className="flex-1">
                <img src={e.src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                <p className="mt-1 text-[0.65rem] text-muted">
                  +{e.dAngle}° · {e.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(json);
            toast("Plate tokens copied");
          }}
        >
          <Copy className="size-3.5" />
          Copy JSON
        </Button>
        {user ? (
          <Button
            size="sm"
            variant="gold"
            disabled={forging}
            onClick={async () => {
              setForging(true);
              try {
                const res = await forgeKeyframe({ data: { plateId: plate.id, prompt: plate.editStill } });
                if (res.ok) {
                  setForged(res.url);
                  toast("Keyframe forged");
                } else toast.error(res.error);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Forge failed");
              } finally {
                setForging(false);
              }
            }}
          >
            <Sparkles className="size-3.5" />
            {forging ? "Forging…" : "Forge +8°"}
          </Button>
        ) : (
          <p className="self-center text-xs text-muted">Sign in to forge a live keyframe.</p>
        )}
      </div>
      {forged && <img src={forged} alt="Forged keyframe" className="w-full rounded-lg" />}
      <pre className="overflow-x-auto rounded-lg bg-ink p-3 text-[0.7rem] leading-relaxed text-cream/80">
        {json}
      </pre>
    </div>
  );
}

function MotionDesk() {
  const motionId = useStudio((s) => s.motionId);
  const setMotion = useStudio((s) => s.setMotion);
  const speed = useStudio((s) => s.speed);
  const zoom = useStudio((s) => s.zoom);
  const folds = useStudio((s) => s.folds);
  const hue = useStudio((s) => s.hue);
  const pulse = useStudio((s) => s.pulse);
  const offset = useStudio((s) => s.offset);
  const vignette = useStudio((s) => s.vignette);
  const rotManual = useStudio((s) => s.rotManual);
  const mode = useStudio((s) => s.mode);
  const s = useStudio.getState;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">Procedural patterns</p>
        <h3 className="font-display text-xl text-cream">Motion recipes</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {MOTIONS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMotion(m.id)}
            className={cn(
              "rounded-lg p-3 text-left shadow-[var(--shadow-border)] transition-shadow",
              motionId === m.id && "shadow-[var(--shadow-border-hover)]",
            )}
          >
            <p className={cn("text-sm font-medium", motionId === m.id ? "text-gold" : "text-cream")}>{m.label}</p>
            <p className="mt-1 text-xs text-muted">{m.blurb}</p>
          </button>
        ))}
      </div>
      <Slider label="Speed" value={speed} min={0.2} max={2.4} step={0.05} onChange={s().setSpeed} />
      <Slider label="Zoom" value={zoom} min={0.7} max={1.6} step={0.01} onChange={s().setZoom} />
      <Slider label="Rotate" value={rotManual} min={-3.14} max={3.14} step={0.01} onChange={s().setRotManual} />
      {mode === "refold" && (
        <Slider label="Folds" value={folds} min={3} max={16} step={1} onChange={s().setFolds} />
      )}
      <Slider label="Hue tide" value={hue} min={-0.2} max={0.2} step={0.005} onChange={s().setHue} />
      <Slider label="Pulse" value={pulse} min={0} max={1} step={0.02} onChange={s().setPulse} />
      <Slider label="Petal offset" value={offset} min={0} max={1} step={0.02} onChange={s().setOffset} />
      <Slider label="Vignette" value={vignette} min={0} max={1} step={0.02} onChange={s().setVignette} />
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[0.65rem] tracking-[0.18em] text-muted uppercase">
        {label}
        <span className="tabular-nums text-cream/70">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold"
      />
    </label>
  );
}

function JsonDesk() {
  const sequence = useStudio((s) => s.sequence);
  const motionId = useStudio((s) => s.motionId);
  const ctx = useMemo(() => compileJsonContext(sequence, motionId), [sequence, motionId]);
  const json = useMemo(() => JSON.stringify(ctx, null, 2), [ctx]);
  const prompts = useMemo(() => promptList(ctx), [ctx]);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">JSON context</p>
        <h3 className="font-display text-xl text-cream">Handoff compiler</h3>
        <p className="mt-1 text-sm text-muted">
          Rotation never resets. Each shot inherits the previous angle so video models can stitch.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(json);
            toast("JSON context copied");
          }}
        >
          <Copy className="size-3.5" />
          Copy JSON
        </Button>
        <Button
          size="sm"
          variant="cyan"
          onClick={() => {
            void navigator.clipboard.writeText(prompts);
            toast("Video prompts copied");
          }}
        >
          <Copy className="size-3.5" />
          Copy prompts
        </Button>
        <SignedIn>
          <Button
            size="sm"
            variant="gold"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await saveLoom({
                  data: {
                    title: `Journey · ${sequence.map((id) => PLATE_BY_ID[id].title).join(" → ")}`.slice(0, 80),
                    sequence,
                    motionId,
                  },
                });
                toast("Loom saved");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Save failed");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Save loom"}
          </Button>
        </SignedIn>
      </div>
      <ol className="space-y-3">
        {ctx.shots.map((shot) => (
          <li key={shot.index} className="rounded-lg bg-ink p-3">
            <p className="text-xs tracking-[0.18em] text-gold uppercase">
              Shot {shot.index} · {shot.plate.title}
            </p>
            <p className="mt-1 text-xs text-muted">
              {shot.start.angleDeg}° → {shot.end.angleDeg}° · zoom {shot.start.zoom} → {shot.end.zoom}
            </p>
            <p className="mt-2 text-sm text-cream/90">{shot.videoPrompt}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReelDesk() {
  const setActive = useStudio((s) => s.setActive);
  const setPlaying = useStudio((s) => s.setPlaying);
  const setMotion = useStudio((s) => s.setMotion);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">Motion reels</p>
        <h3 className="font-display text-xl text-cream">Baked 6s loops</h3>
        <p className="mt-1 text-sm text-muted">
          Sequential edits, then image-to-video. Camera locked on center. Use as stitchable shots.
        </p>
      </div>
      {REELS.map((r) => (
        <article key={r.id} className="overflow-hidden rounded-xl bg-ink shadow-[var(--shadow-border)]">
          <video
            src={r.src}
            controls
            loop
            playsInline
            poster={PLATE_BY_ID[r.plateId].src}
            className="aspect-square w-full object-cover"
          />
          <div className="space-y-2 p-3">
            <p className="font-display text-cream">{r.title}</p>
            <p className="text-xs text-muted">{r.prompt}</p>
            <Button
              size="sm"
              onClick={() => {
                setPlaying(false);
                setActive(r.plateId);
                setMotion(r.motionId as MotionId);
              }}
            >
              Open on loom
            </Button>
          </div>
        </article>
      ))}
      <p className="text-xs text-muted">
        Full catalog is {PLATES.length} plates. Morphs sit between every consecutive pair on the chromatic journey.
      </p>
    </div>
  );
}

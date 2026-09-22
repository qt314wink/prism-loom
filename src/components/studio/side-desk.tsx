import { KNOBS } from "@/lib/knobs";
import { fusionOf } from "@/lib/fusions";
import { BLENDS, MECHANISM_BY_ID } from "@/lib/mechanisms";
import { MOTIONS } from "@/lib/motions";
import { PLATE_BY_ID, REEL_BY_ID, firstReelForPlate } from "@/lib/plates";
import { REEL_SIGNATURE, voiceOf } from "@/lib/voices";
import { useStudio } from "@/store/studio";

export function SideDesk() {
  const journey = useStudio((s) => s.journey);
  if (journey === "watch") return <WatchInspect />;
  if (journey === "isolate") return <IsolateInspect />;
  if (journey === "fuse") return <FuseInspect />;
  return <ScoreInspect />;
}

function WatchInspect() {
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const plateId = useStudio((s) => s.plateId);
  const reel = cinemaReelId ? REEL_BY_ID[cinemaReelId] : firstReelForPlate(plateId);
  const sig = reel ? REEL_SIGNATURE[reel.id] : null;
  const voice = voiceOf(plateId);

  return (
    <aside className="studio-scroll flex min-h-0 flex-col gap-3 overflow-y-auto md:w-[19rem] md:shrink-0">
      <p className="text-xs leading-relaxed text-muted">
        Watch is the baked H.264 loop. No live fold yet. Unique attributes of this reel:
      </p>
      <Card title="Optical" body={voice.optical} />
      <Card title="Physical" body={voice.physical} />
      <Card title="Identity" body={sig?.unique ?? voice.unique} />
      <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
        <p className="text-sm text-fg">Packet seed</p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
          fold {voice.foldSet.join("/")} · beat {sig?.beat ?? "—"}
          <br />
          ω {sig?.omega ?? "—"} · τ {sig?.tau ?? "—"}s · T {reel?.duration ?? "—"}s
          <br />
          {sig?.codec}
        </p>
      </div>
      <p className="text-xs leading-relaxed text-muted">
        Next: isolate {sig?.signature ?? voice.signature} so you can see that law alone.
      </p>
    </aside>
  );
}

function IsolateInspect() {
  const isolate = useStudio((s) => s.isolate);
  const weather = useStudio((s) => s.weather);
  const setWeather = useStudio((s) => s.setWeather);
  const chroma = useStudio((s) => s.chroma);
  const setChroma = useStudio((s) => s.setChroma);
  const flare = useStudio((s) => s.flare);
  const setFlare = useStudio((s) => s.setFlare);
  const motionId = useStudio((s) => s.motionId);
  const setMotion = useStudio((s) => s.setMotion);
  const mech = MECHANISM_BY_ID[isolate];
  const knob = KNOBS.find((k) => k.uniform === mech.uniform || k.id === isolate);

  return (
    <aside className="studio-scroll flex min-h-0 flex-col gap-3 overflow-y-auto md:w-[19rem] md:shrink-0">
      <p className="text-xs leading-relaxed text-muted">
        The chips under the disc solo a law. These knobs are amplitude. Weather scales everything.
      </p>
      <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
        <p className="text-sm text-fg">{mech.title}</p>
        <p className="mt-1 font-mono text-xs text-muted">{mech.math}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{mech.law}</p>
        {knob && (
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-faint">
            GLSL {knob.glsl}
            <br />
            HLSL {knob.hlsl}
            <br />
            NLE {knob.nle}
          </p>
        )}
      </div>
      <Knob label="Weather" value={weather} min={0} max={1} step={0.01} onChange={setWeather} />
      <Knob label="Chroma" value={chroma} min={0} max={0.12} step={0.002} onChange={setChroma} />
      <Knob label="Flare" value={flare} min={0} max={0.28} step={0.005} onChange={setFlare} />
      <p className="text-xs text-muted">Live fold packet (clamped to this Voice).</p>
      <div className="flex flex-col gap-1">
        {MOTIONS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMotion(m.id)}
            className={
              motionId === m.id
                ? "rounded-xl px-3 py-2 text-left shadow-[0_0_0_1px_var(--color-accent)]"
                : "rounded-xl px-3 py-2 text-left shadow-[var(--shadow-border)]"
            }
          >
            <span className="block text-sm text-fg">{m.title}</span>
            <span className="block text-xs text-muted">{m.note}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function FuseInspect() {
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const fuseB = useStudio((s) => s.fuseB);
  const mix = useStudio((s) => s.mix);
  const blend = useStudio((s) => s.blend);
  const a = cinemaReelId ? REEL_BY_ID[cinemaReelId] : null;
  const b = fuseB ? REEL_BY_ID[fuseB] : null;
  const fuse = a && b ? fusionOf(a.id, b.id) : null;
  const blendMeta = BLENDS.find((x) => x.id === blend)!;
  const voiceA = a ? voiceOf(a.plateId) : null;
  const voiceB = b ? voiceOf(b.plateId) : null;

  return (
    <aside className="studio-scroll flex min-h-0 flex-col gap-3 overflow-y-auto md:w-[19rem] md:shrink-0">
      <p className="text-xs leading-relaxed text-muted">
        Mix lives under the disc. This column is why the pair is legal, and what must not break.
      </p>
      {fuse ? (
        <>
          <Card title={fuse.name} body={fuse.unique} />
          <Card title="Why legal" body={fuse.why} />
          <Card title="Optical" body={fuse.optical} />
          <Card title="Physical" body={fuse.physical} />
          <Card title="Keep" body={fuse.keep} />
          <Card title="Reject" body={fuse.reject} />
        </>
      ) : (
        <p className="text-sm text-muted">Pick a legal partner under the disc.</p>
      )}
      <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
        <p className="text-sm text-fg">
          {blendMeta.title} · {Math.round(mix * 100)}%
        </p>
        <p className="mt-1 font-mono text-xs text-muted">{blendMeta.law}</p>
        <p className="mt-1 text-xs text-muted">NLE: {blendMeta.nle}</p>
        {voiceA && voiceB && (
          <p className="mt-2 font-mono text-[10px] text-faint">
            A fold {voiceA.foldSet.join("/")} · B fold {voiceB.foldSet.join("/")}
            <br />
            {PLATE_BY_ID[a!.plateId]?.title} → {PLATE_BY_ID[b!.plateId]?.title}
          </p>
        )}
      </div>
    </aside>
  );
}

function ScoreInspect() {
  return (
    <aside className="studio-scroll flex min-h-0 flex-col gap-3 overflow-y-auto md:w-[19rem] md:shrink-0">
      <p className="text-xs leading-relaxed text-muted">
        Copy from the panel under the disc. The live instrument is WebGL2. Export targets share the same uniforms.
      </p>
      <Card
        title="WebGL2"
        body="The disc. GLSL 300 es dual-texture kaleido. This is what you are seeing."
      />
      <Card
        title="HLSL / Unity"
        body="URP Full Screen Pass. Same Kaleido() / Fuse(). Time in seconds, not frames."
      />
      <Card
        title="R3F / three.js"
        body="ShaderMaterial uniforms only. Do not rebuild the scene graph. Clock must be monotonic."
      />
      <Card
        title="WGSL / WebGPU"
        body="Same packet as a compute/fragment uniform struct. Not wired live — export only."
      />
      <Card
        title="Codec / NLE"
        body="H.264 720² yuv420p faststart. Resolve: polar unwrap for fold, waveform for flare, vectorscope for chroma, opacity for mix."
      />
      <p className="text-xs leading-relaxed text-muted">
        Knobs tab is the aligned map: one row per uniform across GLSL, HLSL, R3F, Unity, WGSL, and the NLE equivalent.
      </p>
    </aside>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <p className="text-sm text-fg">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Knob({
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
      <span className="mb-1 flex justify-between text-xs text-muted">
        {label}
        <span className="font-mono tabular-nums text-fg/80">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
        aria-label={label}
      />
    </label>
  );
}

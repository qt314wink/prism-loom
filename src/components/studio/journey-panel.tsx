import { ArrowRight, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { fusionOf } from "@/lib/fusions";
import { BLENDS, MECHANISMS, type BlendId, type IsolateId } from "@/lib/mechanisms";
import { compilePrompt, ENGINES, packetText, type EngineId } from "@/lib/prompt";
import { PLATE_BY_ID, REEL_BY_ID, firstReelForPlate } from "@/lib/plates";
import { MOTIONS } from "@/lib/motions";
import { REEL_SIGNATURE, VOICES, legalPartnerReels, voiceOf } from "@/lib/voices";
import { JOURNEY_NEXT, useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";

export function JourneyPanel() {
  const journey = useStudio((s) => s.journey);
  if (journey === "watch") return <WatchPanel />;
  if (journey === "isolate") return <IsolatePanel />;
  if (journey === "fuse") return <FusePanel />;
  return <ScorePanel />;
}

function WatchPanel() {
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const plateId = useStudio((s) => s.plateId);
  const setJourney = useStudio((s) => s.setJourney);
  const reel = cinemaReelId ? REEL_BY_ID[cinemaReelId] : firstReelForPlate(plateId);
  const sig = reel ? REEL_SIGNATURE[reel.id] : null;
  const voice = voiceOf(plateId);
  const next = JOURNEY_NEXT.watch;

  return (
    <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">This loop’s unique law — watch it before you change it.</p>
      <p className="mt-2 font-display text-base text-fg">{reel?.title ?? PLATE_BY_ID[plateId]?.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{sig?.unique ?? voice.unique}</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-xs text-muted">
        <Row k="Signature" v={sig?.signature ?? voice.signature} />
        <Row k="Fold" v={voice.foldSet.join(" / ")} />
        <Row k="ω" v={sig ? sig.omega.toFixed(2) : "—"} />
        <Row k="τ" v={sig ? `${sig.tau}s` : "—"} />
        <Row k="Optical" v={voice.optical} wide />
        <Row k="Physical" v={voice.physical} wide />
        <Row k="Codec" v={sig?.codec ?? "still plate"} wide />
      </dl>
      {next && (
        <Button variant="primary" className="mt-3 w-full" onClick={() => setJourney(next)}>
          Isolate {sig?.signature ?? voice.signature}
          <ArrowRight className="size-4" strokeWidth={1.7} />
        </Button>
      )}
    </div>
  );
}

function IsolatePanel() {
  const isolate = useStudio((s) => s.isolate);
  const setIsolate = useStudio((s) => s.setIsolate);
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const plateId = useStudio((s) => s.plateId);
  const setJourney = useStudio((s) => s.setJourney);
  const sig = cinemaReelId ? REEL_SIGNATURE[cinemaReelId] : null;
  const mech = MECHANISMS.find((m) => m.id === isolate)!;
  const voice = voiceOf(plateId);

  return (
    <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">
        Solo one law. Fold is held at 2 unless you pick Fold. You should be able to name what you see.
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {MECHANISMS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setIsolate(m.id as IsolateId)}
            className={cn(
              "h-11 rounded-md px-3 text-sm text-muted shadow-[var(--shadow-border)]",
              isolate === m.id && "bg-accent text-accent-fg shadow-none",
              sig?.signature === m.id && isolate !== m.id && "text-fg",
            )}
          >
            {m.title}
            {sig?.signature === m.id ? " · law" : ""}
          </button>
        ))}
      </div>
      <p className="mt-3 font-display text-base text-fg">{mech.title}</p>
      <p className="mt-1 font-mono text-xs text-muted">{mech.math}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{mech.see}</p>
      <p className="mt-1 text-xs text-faint">
        {mech.domain} · {mech.uniform} · this Voice {voice.foldSet.join("/")}
      </p>
      <Button variant="primary" className="mt-3 w-full" onClick={() => setJourney("fuse")}>
        Fuse with a legal neighbor
        <ArrowRight className="size-4" strokeWidth={1.7} />
      </Button>
    </div>
  );
}

function FusePanel() {
  const plateId = useStudio((s) => s.plateId);
  const fuseB = useStudio((s) => s.fuseB);
  const setFuseB = useStudio((s) => s.setFuseB);
  const mix = useStudio((s) => s.mix);
  const setMix = useStudio((s) => s.setMix);
  const blend = useStudio((s) => s.blend);
  const setBlend = useStudio((s) => s.setBlend);
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const setJourney = useStudio((s) => s.setJourney);
  const partners = legalPartnerReels(plateId);
  const a = cinemaReelId ? REEL_BY_ID[cinemaReelId] : firstReelForPlate(plateId);
  const b = fuseB ? REEL_BY_ID[fuseB] : null;
  const fuse = a && b ? fusionOf(a.id, b.id) : null;
  const blendMeta = BLENDS.find((x) => x.id === blend)!;

  return (
    <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">
        A is the playing reel. B is only a legal chromatic neighbor — never any plate. Drag mix. The disc is the mix.
      </p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <SourceMini label="A" title={a?.title ?? "—"} src={a?.poster} />
        <span className="font-mono text-xs text-faint">×</span>
        <SourceMini label="B" title={b?.title ?? "Pick"} src={b?.poster} />
      </div>
      <label className="mt-3 block">
        <span className="mb-1 flex justify-between text-xs text-muted">
          Mix A → B
          <span className="font-mono tabular-nums text-fg">{Math.round(mix * 100)}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={mix}
          onChange={(e) => setMix(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
          aria-label="Mix A to B"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-1">
        {BLENDS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setBlend(m.id as BlendId)}
            className={cn(
              "h-10 rounded-md px-2.5 text-xs text-muted shadow-[var(--shadow-border)]",
              blend === m.id && "bg-accent text-accent-fg shadow-none",
            )}
          >
            {m.title}
          </button>
        ))}
      </div>
      <p className="mt-2 font-mono text-xs text-muted">
        {blendMeta.law} · NLE {blendMeta.nle}
      </p>
      {fuse && (
        <div className="mt-3 rounded-lg bg-elevated p-2.5">
          <p className="font-display text-sm text-fg">{fuse.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{fuse.unique}</p>
          <p className="mt-1 text-xs text-faint">{fuse.why}</p>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">Legal partners</p>
      <div className="mt-1.5 flex gap-1.5 overflow-x-auto studio-scroll">
        {partners.length === 0 && <p className="text-xs text-muted">No approved edge for this Voice.</p>}
        {partners.map((id) => {
          const r = REEL_BY_ID[id];
          const name = a ? fusionOf(a.id, id)?.name : null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFuseB(id)}
              className={cn(
                "flex w-28 shrink-0 flex-col overflow-hidden rounded-lg text-left shadow-[var(--shadow-border)]",
                fuseB === id && "shadow-[0_0_0_1px_var(--color-accent)]",
              )}
            >
              <img src={r.poster} alt="" className="aspect-square w-full object-cover" />
              <span className="px-1.5 py-1 text-xs text-fg">{r.beat}</span>
              <span className="px-1.5 pb-1.5 text-[10px] leading-tight text-muted">{name ?? r.title}</span>
            </button>
          );
        })}
      </div>
      <Button
        variant="primary"
        className="mt-3 w-full"
        onClick={() => setJourney("score")}
        disabled={!b}
      >
        Write this fusion as a score
        <ArrowRight className="size-4" strokeWidth={1.7} />
      </Button>
    </div>
  );
}

function ScorePanel() {
  const plateId = useStudio((s) => s.plateId);
  const cinemaReelId = useStudio((s) => s.cinemaReelId);
  const fuseB = useStudio((s) => s.fuseB);
  const isolate = useStudio((s) => s.isolate);
  const blend = useStudio((s) => s.blend);
  const mix = useStudio((s) => s.mix);
  const weather = useStudio((s) => s.weather);
  const chroma = useStudio((s) => s.chroma);
  const flare = useStudio((s) => s.flare);
  const vignette = useStudio((s) => s.vignette);
  const seed = useStudio((s) => s.seed);
  const motionId = useStudio((s) => s.motionId);
  const motion = MOTIONS.find((m) => m.id === motionId) ?? MOTIONS[0];
  const sig = cinemaReelId ? REEL_SIGNATURE[cinemaReelId] : null;
  const [engine, setEngine] = useState<EngineId>("json");
  const [copied, setCopied] = useState(false);
  const a = cinemaReelId ? REEL_BY_ID[cinemaReelId] : null;
  const b = fuseB ? REEL_BY_ID[fuseB] : null;
  const fuse = a && b ? fusionOf(a.id, b.id) : null;

  const packet = useMemo(
    () =>
      compilePrompt({
        reelA: cinemaReelId,
        reelB: fuseB,
        plateId,
        isolate: isolate as IsolateId,
        blend,
        mix,
        folds: VOICES[plateId]?.foldSet[0] ?? 8,
        spin: motion.spin * weather,
        zoom: 1 + motion.zoomAmp * weather,
        breath: motion.breath * weather,
        chroma,
        vignette,
        flare,
        weather,
        omega: sig?.omega ?? motion.zoomHz,
        tau: sig?.tau ?? 3.2,
        duration: a?.duration ?? 6,
        seed,
      }),
    [blend, chroma, cinemaReelId, flare, fuseB, isolate, mix, motion, plateId, seed, sig, vignette, weather, a],
  );

  const text = packetText(packet, engine);

  return (
    <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted">
        This is the packet the disc is running. Same numbers for WebGL2, HLSL, Unity, R3F, and WGSL.
      </p>
      <p className="mt-2 font-display text-base text-fg">{fuse?.name ?? a?.title ?? "Packet"}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{fuse?.unique ?? sig?.unique}</p>
      {fuse && (
        <p className="mt-1 text-xs text-faint">
          Keep {fuse.keep} · Reject {fuse.reject}
        </p>
      )}
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-xs text-muted">
        <Row k="Fold" v={String(VOICES[plateId]?.foldSet[0] ?? 8)} />
        <Row k="Mix" v={`${Math.round(mix * 100)}% ${blend}`} />
        <Row k="ω" v={(sig?.omega ?? motion.zoomHz).toFixed(2)} />
        <Row k="τ" v={`${sig?.tau ?? 3.2}s`} />
      </dl>
      <div className="mt-3 flex flex-wrap gap-1">
        {ENGINES.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setEngine(e.id)}
            className={cn(
              "h-9 rounded-md px-2.5 font-mono text-xs uppercase text-muted shadow-[var(--shadow-border)]",
              engine === e.id && "bg-accent text-accent-fg shadow-none",
            )}
          >
            {e.title}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => {
            void navigator.clipboard.writeText(text).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            });
          }}
        >
          <Copy className="size-4" strokeWidth={1.7} />
          {copied ? "Copied" : `Copy ${engine}`}
        </Button>
      </div>
      <pre className="studio-scroll mt-2 max-h-40 overflow-auto rounded-lg bg-elevated p-2.5 font-mono text-[10px] leading-relaxed text-muted">
        {text}
      </pre>
    </div>
  );
}

function SourceMini({ label, title, src }: { label: string; title: string; src?: string }) {
  return (
    <div className="overflow-hidden rounded-lg shadow-[var(--shadow-border)]">
      {src ? (
        <img src={src} alt="" className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square bg-elevated" />
      )}
      <p className="px-1.5 pt-1 text-[10px] uppercase tracking-wide text-faint">{label}</p>
      <p className="truncate px-1.5 pb-1.5 text-xs text-fg">{title}</p>
    </div>
  );
}

function Row({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-[10px] uppercase tracking-wide text-faint">{k}</dt>
      <dd className="text-muted">{v}</dd>
    </div>
  );
}

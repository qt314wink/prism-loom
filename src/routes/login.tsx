import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-void px-6">
      <img
        src="/plates/solar-lotus.png"
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-30 blur-md"
      />
      <div className="absolute inset-0 bg-void/70" />
      <div className="relative w-full max-w-sm space-y-6 rounded-2xl bg-panel p-8 shadow-[var(--shadow-border)]">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-[0.28em] text-gold uppercase">Prism Loom</p>
          <h1 className="font-display text-3xl font-semibold text-cream">Sign in to forge</h1>
          <p className="text-sm text-muted">
            Save sequences and spend AI credits on keyframe morphs. The studio itself is open.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-md bg-gold px-4 py-3 text-sm font-medium text-void transition-transform duration-150 ease-out hover:bg-gold/90 active:scale-[0.96]"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <Link to="/" className="block text-center text-sm text-muted underline-offset-4 hover:text-cream hover:underline">
          Back to the loom
        </Link>
      </div>
    </main>
  );
}

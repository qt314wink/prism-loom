import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useStudio, type LoomMode } from "@/store/studio";
import { cn } from "@/lib/utils";

const MODES: { id: LoomMode; label: string }[] = [
  { id: "plate", label: "Plate" },
  { id: "morph", label: "Morph" },
  { id: "refold", label: "Re-fold" },
];

export function AppHeader() {
  const mode = useStudio((s) => s.mode);
  const setMode = useStudio((s) => s.setMode);

  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-6">
      <div className="min-w-0">
        <p className="text-[0.65rem] tracking-[0.32em] text-gold uppercase">Sequential mandala motion</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
          Prism Loom
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden rounded-full bg-ink p-1 shadow-[var(--shadow-border)] sm:flex">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs tracking-wide uppercase transition-colors",
                mode === m.id ? "bg-gold text-void" : "text-muted hover:text-cream",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <AuthSlot />
      </div>
    </header>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-cream/10" />;
  }
  if (user) {
    return (
      <SignedIn>
        <div className="max-w-40 truncate text-sm [&_button]:text-muted [&_span]:text-cream">
          <UserButton />
        </div>
      </SignedIn>
    );
  }
  return (
    <SignedOut>
      <Link
        to="/login"
        className="rounded-md bg-gold px-3 py-2 text-sm font-medium text-void transition-transform duration-150 hover:bg-gold/90 active:scale-[0.96]"
      >
        Sign in
      </Link>
    </SignedOut>
  );
}

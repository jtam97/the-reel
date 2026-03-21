"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="text-center max-w-md">
        <div className="font-[family-name:var(--font-display)] text-neon-red text-6xl font-bold glow-red-text mb-4 flicker">
          REEL SNAPPED
        </div>
        <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-neon-red/50 to-transparent mb-6" />
        <p className="font-[family-name:var(--font-typewriter)] text-cream/50 text-sm mb-8">
          The film broke. Something went wrong loading this reel.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-film-brown border-2 border-gold/50 rounded text-gold font-[family-name:var(--font-typewriter)] text-sm hover:border-gold hover:glow-gold transition-all"
        >
          ↻ RELOAD PROJECTOR
        </button>
      </div>
    </div>
  );
}

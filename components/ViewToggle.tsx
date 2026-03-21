"use client";

interface ViewToggleProps {
  view: "timeline" | "calendar";
  onToggle: (view: "timeline" | "calendar") => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-dark-mid border-2 border-film-brown rounded-full p-1">
      <button
        onClick={() => onToggle("timeline")}
        className={`px-4 py-2 rounded-full font-[family-name:var(--font-typewriter)] text-sm transition-all ${
          view === "timeline"
            ? "bg-gold text-dark font-bold"
            : "text-cream/60 hover:text-cream"
        }`}
      >
        ◎ TIMELINE
      </button>
      <button
        onClick={() => onToggle("calendar")}
        className={`px-4 py-2 rounded-full font-[family-name:var(--font-typewriter)] text-sm transition-all ${
          view === "calendar"
            ? "bg-gold text-dark font-bold"
            : "text-cream/60 hover:text-cream"
        }`}
      >
        ▦ CALENDAR
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAllUpcomingMovies } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";
import FilmStrip from "@/components/FilmStrip";
import CalendarView from "@/components/CalendarView";
import ViewToggle from "@/components/ViewToggle";
import MovieModal from "@/components/MovieModal";

type SortOption = "date" | "rating" | "buzz";

export default function TimelinePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"timeline" | "calendar">("timeline");
  const [sort, setSort] = useState<SortOption>("date");
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  useEffect(() => {
    getAllUpcomingMovies()
      .then(setMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sortedMovies = useMemo(() => {
    const copy = [...movies];
    switch (sort) {
      case "rating":
        return copy.sort((a, b) => b.vote_average - a.vote_average);
      case "buzz":
        return copy.sort((a, b) => b.popularity - a.popularity);
      case "date":
      default:
        return copy.sort(
          (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );
    }
  }, [movies, sort]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="relative z-[45] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-4 border-b border-film-brown/50 bg-dark">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-gold text-2xl font-bold glow-gold-text hover:opacity-80 transition-opacity"
          >
            THE REEL
          </Link>
          <h1 className="font-[family-name:var(--font-typewriter)] text-cream/60 text-sm tracking-widest">
            NOW SHOWING
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-typewriter)] text-cream/40 text-xs">SORT:</span>
            {(
              [
                { key: "date", label: "Date" },
                { key: "rating", label: "Rating" },
                { key: "buzz", label: "Buzz" },
              ] as { key: SortOption; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={`px-3 py-1 rounded font-[family-name:var(--font-typewriter)] text-xs transition-all ${
                  sort === opt.key
                    ? "bg-gold/20 text-gold border border-gold/50"
                    : "text-cream/50 hover:text-cream border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <ViewToggle view={view} onToggle={setView} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="font-[family-name:var(--font-display)] text-gold text-6xl font-bold flicker mb-4">
              3
            </div>
            <div className="font-[family-name:var(--font-typewriter)] text-cream/50 text-sm tracking-widest">
              LOADING REEL...
            </div>
          </div>
        </div>
      ) : view === "timeline" ? (
        <FilmStrip movies={sortedMovies} onMovieClick={setSelectedMovie} />
      ) : (
        <div className="py-8">
          <CalendarView movies={sortedMovies} onMovieClick={setSelectedMovie} />
        </div>
      )}

      <MovieModal movieId={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
}

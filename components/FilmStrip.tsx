"use client";

import { useRef, useEffect } from "react";
import type { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { popularityToHeight, getMonthName } from "@/lib/utils";

interface FilmStripProps {
  movies: Movie[];
  onMovieClick: (id: number) => void;
}

export default function FilmStrip({ movies, onMovieClick }: FilmStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Group movies by month
  const grouped = movies.reduce<Record<string, Movie[]>>((acc, movie) => {
    if (!movie.release_date) return acc;
    const d = new Date(movie.release_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(movie);
    return acc;
  }, {});

  const months = Object.keys(grouped).sort();

  return (
    <div className="relative h-[calc(100vh-180px)]">
      {/* Film sprocket holes - top */}
      <div className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none bg-dark-mid border-b border-film-brown/50">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, transparent 0px, transparent 30px, rgba(10,10,10,0.9) 30px, rgba(10,10,10,0.9) 50px, transparent 50px, transparent 80px)`,
          }}
        />
      </div>

      {/* Film sprocket holes - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none bg-dark-mid border-t border-film-brown/50">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, transparent 0px, transparent 30px, rgba(10,10,10,0.9) 30px, rgba(10,10,10,0.9) 50px, transparent 50px, transparent 80px)`,
          }}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="horizontal-scroll h-full flex items-center gap-6 px-16 py-12"
        style={{
          background: `linear-gradient(to bottom, var(--film-brown) 0%, var(--dark-mid) 8%, var(--dark-mid) 92%, var(--film-brown) 100%)`,
        }}
      >
        {months.map((monthKey) => {
          const [yearStr, monthStr] = monthKey.split("-");
          const monthNum = parseInt(monthStr);
          const year = parseInt(yearStr);
          const monthMovies = grouped[monthKey];

          return (
            <div key={monthKey} className="flex items-center gap-4 shrink-0">
              {/* Month label */}
              <div className="shrink-0 w-12 flex items-center justify-center mr-2">
                <div className="-rotate-90 whitespace-nowrap flex flex-col items-center">
                  <div className="font-[family-name:var(--font-display)] text-gold text-xl font-bold glow-gold-text">
                    {getMonthName(monthNum)}
                  </div>
                  <div className="font-[family-name:var(--font-typewriter)] text-gold/50 text-xs mt-0.5">
                    {year}
                  </div>
                </div>
              </div>

              {/* Movies in this month */}
              {monthMovies.map((movie) => (
                <div key={movie.id} className="relative shrink-0">
                  <MovieCard
                    movie={movie}
                    onClick={onMovieClick}
                    height={popularityToHeight(movie.popularity)}
                  />
                </div>
              ))}

              {/* Separator */}
              <div className="shrink-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent mx-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

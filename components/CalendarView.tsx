"use client";

import { useState } from "react";
import Image from "next/image";
import type { Movie } from "@/lib/tmdb";
import { getPosterUrl } from "@/lib/tmdb";
import { getMonthName, getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils";
import { getHighlightForDate } from "@/lib/highlights";

interface CalendarViewProps {
  movies: Movie[];
  onMovieClick: (id: number) => void;
}

export default function CalendarView({ movies, onMovieClick }: CalendarViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Group movies by day of month
  const moviesByDay = movies.reduce<Record<number, Movie[]>>((acc, movie) => {
    if (!movie.release_date) return acc;
    const d = new Date(movie.release_date);
    if (d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(movie);
    }
    return acc;
  }, {});

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Navigation */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <button
          onClick={prevMonth}
          className="text-gold hover:text-gold-light font-[family-name:var(--font-display)] text-2xl transition-colors px-3 py-1 hover:glow-gold rounded"
        >
          ◄
        </button>
        <h2 className="font-[family-name:var(--font-display)] text-gold text-3xl font-bold glow-gold-text min-w-[280px] text-center">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <button
          onClick={nextMonth}
          className="text-gold hover:text-gold-light font-[family-name:var(--font-display)] text-2xl transition-colors px-3 py-1 hover:glow-gold rounded"
        >
          ►
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-center py-2 font-[family-name:var(--font-typewriter)] text-gold/60 text-sm"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Blank cells */}
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="min-h-[100px] bg-film-brown/30 rounded" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const highlight = getHighlightForDate(currentMonth, day);
          const dayMovies = moviesByDay[day] || [];

          return (
            <div
              key={day}
              className={`calendar-cell min-h-[100px] rounded p-1.5 bg-film-brown/60 ${
                highlight ? "calendar-highlight" : ""
              }`}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-[family-name:var(--font-typewriter)] text-xs ${
                    highlight ? "text-gold font-bold" : "text-cream/50"
                  }`}
                >
                  {day}
                </span>
                {highlight && (
                  <span className="text-[9px] font-[family-name:var(--font-typewriter)] text-neon-red font-bold truncate ml-1">
                    {highlight.label}
                  </span>
                )}
              </div>

              {/* Movie posters */}
              <div className="flex flex-wrap gap-0.5">
                {dayMovies.slice(0, 4).map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => onMovieClick(movie.id)}
                    className={`relative w-8 h-12 rounded-sm overflow-hidden border hover:border-gold transition-colors cursor-pointer ${
                      movie.isAnticipated ? "border-cyan-400/60" : "border-film-brown/50"
                    }`}
                    title={`${movie.title}${movie.isAnticipated ? " (Coming Soon)" : ""}`}
                  >
                    {movie.poster_path ? (
                      <Image
                        src={getPosterUrl(movie.poster_path, "w92")}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="w-full h-full bg-film-brown/40 flex items-center justify-center">
                        <span className="text-[6px] text-gold/40">?</span>
                      </div>
                    )}
                    {movie.isAnticipated && (
                      <div className="absolute bottom-0 left-0 right-0 bg-cyan-500/80 py-px">
                        <span className="text-[5px] text-dark font-bold block text-center">SOON</span>
                      </div>
                    )}
                  </button>
                ))}
                {dayMovies.length > 4 && (
                  <span className="text-[9px] text-cream/40 font-[family-name:var(--font-typewriter)] self-end">
                    +{dayMovies.length - 4}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

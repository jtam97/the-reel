"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { popularityToHeight, getMonthName } from "@/lib/utils";

interface FilmStripProps {
  movies: Movie[];
  onMovieClick: (id: number) => void;
}

export default function FilmStrip({ movies, onMovieClick }: FilmStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentLabel, setCurrentLabel] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Group movies by month (moved up so updateProgress can reference it)
  const grouped = movies.reduce<Record<string, Movie[]>>((acc, movie) => {
    if (!movie.release_date) return acc;
    const d = new Date(movie.release_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(movie);
    return acc;
  }, {});

  const months = Object.keys(grouped).sort();

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    setScrollProgress(el.scrollLeft / maxScroll);

    // Find which month group is near center of viewport
    const centerX = el.scrollLeft + el.clientWidth / 2;
    const children = el.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (centerX >= child.offsetLeft && centerX <= child.offsetLeft + child.offsetWidth && months[i]) {
        const [y, m] = months[i].split("-");
        setCurrentLabel(`${getMonthName(parseInt(m))} ${y}`);
        break;
      }
    }
  }, [months]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 4.0;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", updateProgress);
    };
  }, [updateProgress]);

  // Click anywhere on track to jump
  const handleTrackClick = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    el.scrollLeft = fraction * (el.scrollWidth - el.clientWidth);
  };

  // Drag the thumb
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollRef.current?.scrollLeft ?? 0;
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const trackWidth = track.getBoundingClientRect().width;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const dx = e.clientX - dragStartX.current;
      el.scrollLeft = dragStartScroll.current + (dx / trackWidth) * maxScroll;
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const thumbWidthPercent = scrollRef.current
    ? Math.max(8, (scrollRef.current.clientWidth / scrollRef.current.scrollWidth) * 100)
    : 15;

  return (
    <div className="relative h-[calc(100vh-180px)] flex flex-col">
      {/* Film sprocket holes - top */}
      <div className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none bg-dark-mid border-b border-film-brown/50">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, transparent 0px, transparent 30px, rgba(10,10,10,0.9) 30px, rgba(10,10,10,0.9) 50px, transparent 50px, transparent 80px)`,
          }}
        />
      </div>

      {/* Film sprocket holes - bottom (above the progress bar) */}
      <div className="absolute bottom-10 left-0 right-0 h-8 z-10 pointer-events-none bg-dark-mid border-t border-film-brown/50">
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
        className="horizontal-scroll flex-1 flex items-center gap-6 px-16 py-12"
        style={{
          background: `linear-gradient(to bottom, var(--film-brown) 0%, var(--dark-mid) 8%, var(--dark-mid) 92%, var(--film-brown) 100%)`,
          scrollBehavior: isDragging ? "auto" : undefined,
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

      {/* Progress scrollbar */}
      <div className="h-10 shrink-0 bg-dark-mid border-t border-film-brown/50 flex items-center px-4 gap-4 z-20">
        {/* Current month label */}
        <div className="shrink-0 min-w-[120px]">
          <span className="font-[family-name:var(--font-typewriter)] text-gold/70 text-xs tracking-wider">
            {currentLabel}
          </span>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex-1 h-2 bg-film-brown/40 rounded-full relative cursor-pointer group"
          onClick={handleTrackClick}
        >
          {/* Filled portion */}
          <div
            className="absolute top-0 left-0 h-full bg-gold/20 rounded-full pointer-events-none"
            style={{ width: `${scrollProgress * 100}%` }}
          />

          {/* Draggable thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-4 rounded-full transition-colors ${
              isDragging
                ? "bg-gold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                : "bg-gold/60 hover:bg-gold group-hover:shadow-[0_0_8px_rgba(212,175,55,0.3)]"
            }`}
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${scrollProgress * (100 - thumbWidthPercent)}%`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>

        {/* Progress percentage */}
        <div className="shrink-0 min-w-[40px] text-right">
          <span className="font-[family-name:var(--font-typewriter)] text-gold/40 text-[10px]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

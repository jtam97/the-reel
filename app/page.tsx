"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNowPlayingMovies, getPosterUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);

  useEffect(() => {
    getNowPlayingMovies(1)
      .then((data) => {
        const filtered = data.results
          .filter((m) => m.poster_path && m.popularity > 20)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 15);
        // Double for seamless loop
        setNowPlaying([...filtered, ...filtered]);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-film-brown/20 via-dark to-dark pointer-events-none" />

      {/* Title */}
      <div className="relative z-10 text-center mb-16">
        <h1 className="font-[family-name:var(--font-display)] text-7xl md:text-9xl font-black text-gold glow-gold-text flicker-slow tracking-wide">
          THE REEL
        </h1>
        <div className="h-[2px] w-48 md:w-64 mx-auto mt-4 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="font-[family-name:var(--font-typewriter)] text-cream/50 text-sm md:text-base mt-6 tracking-widest">
          History of cinema, one date at a time.
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12">
        <Link href="/timeline" className="group">
          <div className="ticket-stub text-center min-w-[260px]">
            <div className="font-[family-name:var(--font-typewriter)] text-gold-light/60 text-xs tracking-widest mb-2">
              ★ ADMIT ONE ★
            </div>
            <div className="font-[family-name:var(--font-display)] text-gold text-3xl md:text-4xl font-bold glow-gold-text group-hover:flicker">
              NOW SHOWING
            </div>
            <div className="font-[family-name:var(--font-typewriter)] text-cream/60 text-xs mt-3 tracking-wider">
              Upcoming releases on the reel
            </div>
            <div className="h-[1px] w-full bg-gold/20 mt-3" />
            <div className="font-[family-name:var(--font-typewriter)] text-gold/40 text-[10px] mt-2 tracking-widest">
              SCREEN 01 — TIMELINE
            </div>
          </div>
        </Link>

        <Link href="/on-this-day" className="group">
          <div className="ticket-stub text-center min-w-[260px]">
            <div className="font-[family-name:var(--font-typewriter)] text-gold-light/60 text-xs tracking-widest mb-2">
              ★ ADMIT ONE ★
            </div>
            <div className="font-[family-name:var(--font-display)] text-gold text-3xl md:text-4xl font-bold glow-gold-text group-hover:flicker">
              THE VAULT
            </div>
            <div className="font-[family-name:var(--font-typewriter)] text-cream/60 text-xs mt-3 tracking-wider">
              Discover what happened on any date
            </div>
            <div className="h-[1px] w-full bg-gold/20 mt-3" />
            <div className="font-[family-name:var(--font-typewriter)] text-gold/40 text-[10px] mt-2 tracking-widest">
              SCREEN 02 — THE VAULT
            </div>
          </div>
        </Link>
      </div>

      {/* Releasing This Week ticker */}
      {nowPlaying.length > 0 && (
        <div className="relative z-10 w-full max-w-4xl mt-16">
          <div className="font-[family-name:var(--font-typewriter)] text-gold/50 text-xs tracking-widest text-center mb-3">
            ★ RELEASING THIS WEEK ★
          </div>
          <div className="overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 animate-[ticker_30s_linear_infinite]">
              {nowPlaying.map((movie, i) => (
                <Link
                  key={`${movie.id}-${i}`}
                  href="/timeline"
                  className="shrink-0 group"
                >
                  <div className="relative w-16 h-24 rounded border border-film-brown/50 overflow-hidden group-hover:border-gold transition-colors">
                    <Image
                      src={getPosterUrl(movie.poster_path, "w154")}
                      alt={movie.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-cream/40 font-[family-name:var(--font-typewriter)] text-[8px] text-center mt-1 max-w-16 truncate group-hover:text-gold/60 transition-colors">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorative film lines */}
      <div className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />
      <div className="absolute right-8 md:right-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />
    </main>
  );
}

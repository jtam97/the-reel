"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getMovieDetails, getPosterUrl, getBackdropUrl } from "@/lib/tmdb";
import type { MovieDetails } from "@/lib/tmdb";
import { formatCurrency, formatRuntime } from "@/lib/utils";

interface MovieModalProps {
  movieId: number | null;
  onClose: () => void;
}

export default function MovieModal({ movieId, onClose }: MovieModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!movieId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    getMovieDetails(movieId)
      .then(setDetails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [movieId, handleKeyDown]);

  if (!movieId) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="modal-content relative bg-dark-mid rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-dark/80 border border-gold text-gold hover:bg-gold hover:text-dark transition-all"
          aria-label="Close"
        >
          ✕
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gold font-[family-name:var(--font-typewriter)] text-xl flicker">
              LOADING REEL...
            </div>
          </div>
        ) : details ? (
          <>
            {/* Backdrop */}
            {details.backdrop_path && (
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src={getBackdropUrl(details.backdrop_path)}
                  alt={details.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-mid via-dark-mid/60 to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-8 -mt-20 relative">
              <div className="flex gap-6">
                {/* Poster */}
                {details.poster_path && (
                  <div className="hidden md:block shrink-0 w-40 h-60 relative rounded border-2 border-film-brown overflow-hidden shadow-lg">
                    <Image
                      src={getPosterUrl(details.poster_path, "w342")}
                      alt={details.title}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-gold glow-gold-text mb-2">
                    {details.title}
                  </h2>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-3 text-cream/70 font-[family-name:var(--font-typewriter)] text-sm mb-4">
                    {details.release_date && (
                      <span>{new Date(details.release_date).getFullYear()}</span>
                    )}
                    {details.runtime > 0 && (
                      <>
                        <span className="text-gold/50">|</span>
                        <span>{formatRuntime(details.runtime)}</span>
                      </>
                    )}
                    {details.vote_average > 0 && (
                      <>
                        <span className="text-gold/50">|</span>
                        <span className="text-gold">★ {details.vote_average.toFixed(1)}</span>
                      </>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {details.genres?.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 rounded-full bg-film-brown/60 border border-gold/30 text-cream/80 text-xs font-[family-name:var(--font-typewriter)]"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Tagline */}
                  {details.tagline && (
                    <p className="italic text-gold-light/70 mb-4 font-[family-name:var(--font-body)]">
                      &ldquo;{details.tagline}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Overview */}
              {details.overview && (
                <p className="text-cream/80 leading-relaxed mt-4 font-[family-name:var(--font-body)]">
                  {details.overview}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-film-brown/50">
                {details.revenue > 0 && (
                  <div>
                    <div className="text-gold/60 font-[family-name:var(--font-typewriter)] text-xs uppercase">Revenue</div>
                    <div className="text-gold font-[family-name:var(--font-display)] text-lg font-bold">
                      {formatCurrency(details.revenue)}
                    </div>
                  </div>
                )}
                {details.budget > 0 && (
                  <div>
                    <div className="text-gold/60 font-[family-name:var(--font-typewriter)] text-xs uppercase">Budget</div>
                    <div className="text-cream font-[family-name:var(--font-display)] text-lg font-bold">
                      {formatCurrency(details.budget)}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gold/60 font-[family-name:var(--font-typewriter)] text-xs uppercase">Popularity</div>
                  <div className="text-cream font-[family-name:var(--font-display)] text-lg font-bold">
                    {details.popularity.toFixed(0)}
                  </div>
                </div>
                <div>
                  <div className="text-gold/60 font-[family-name:var(--font-typewriter)] text-xs uppercase">Votes</div>
                  <div className="text-cream font-[family-name:var(--font-display)] text-lg font-bold">
                    {details.vote_count.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* TMDB Link */}
              <div className="mt-6 pt-4 border-t border-film-brown/50">
                <a
                  href={`https://www.themoviedb.org/movie/${details.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold/70 hover:text-gold font-[family-name:var(--font-typewriter)] text-sm transition-colors"
                >
                  View on TMDB →
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-neon-red font-[family-name:var(--font-typewriter)] text-xl">
              REEL SNAPPED — Movie not found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { getPosterUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  onClick: (id: number) => void;
  height?: number;
  showYear?: boolean;
}

export default function MovieCard({ movie, onClick, height, showYear = false }: MovieCardProps) {
  const cardHeight = height || 260;
  const cardWidth = Math.round(cardHeight * (2 / 3));

  return (
    <button
      onClick={() => onClick(movie.id)}
      className={`movie-card group relative rounded overflow-hidden bg-dark-mid shrink-0 cursor-pointer ${
        movie.isAnticipated ? "ring-1 ring-cyan-400/40" : ""
      }`}
      style={{ width: cardWidth, height: cardHeight }}
    >
      {movie.poster_path ? (
        <Image
          src={getPosterUrl(movie.poster_path, "w342")}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={`${cardWidth}px`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-film-brown/30">
          <span className="text-gold/40 font-[family-name:var(--font-typewriter)] text-xs text-center px-2">
            {movie.title}
          </span>
        </div>
      )}

      {/* Anticipated badge — top */}
      {movie.isAnticipated && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-cyan-500/90 py-0.5 text-center">
          <span className="font-[family-name:var(--font-typewriter)] text-dark text-[8px] font-bold tracking-widest">
            COMING SOON
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-gold font-[family-name:var(--font-display)] text-sm font-bold leading-tight mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-cream/70 font-[family-name:var(--font-typewriter)] text-xs">
          {movie.release_date && (
            <span>
              {showYear
                ? new Date(movie.release_date).getFullYear()
                : new Date(movie.release_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
            </span>
          )}
          {movie.vote_average > 0 && (
            <span className="text-gold">★ {movie.vote_average.toFixed(1)}</span>
          )}
        </div>
      </div>
    </button>
  );
}

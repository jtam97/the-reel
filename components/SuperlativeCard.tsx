"use client";

import Image from "next/image";
import { getPosterUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";

interface SuperlativeCardProps {
  icon: string;
  label: string;
  movie: Movie;
  stat: string;
  onClick: (id: number) => void;
}

export default function SuperlativeCard({ icon, label, movie, stat, onClick }: SuperlativeCardProps) {
  return (
    <button
      onClick={() => onClick(movie.id)}
      className="group relative overflow-hidden rounded-lg border-2 border-gold/30 hover:border-gold bg-dark-mid transition-all duration-300 hover:glow-gold cursor-pointer min-h-[240px]"
    >
      {/* Background poster */}
      {movie.poster_path && (
        <Image
          src={getPosterUrl(movie.poster_path, "w500")}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/40" />

      {/* Content */}
      <div className="relative p-5 h-full flex flex-col justify-between">
        {/* Category */}
        <div>
          <div className="text-2xl mb-1">{icon}</div>
          <div className="font-[family-name:var(--font-typewriter)] text-gold text-xs uppercase tracking-wider">
            {label}
          </div>
        </div>

        {/* Movie info */}
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-gold-light text-lg font-bold leading-tight mb-1">
            {movie.title}
          </h3>
          <div className="text-cream/60 font-[family-name:var(--font-typewriter)] text-xs mb-2">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : ""}
          </div>
          <div className="font-[family-name:var(--font-display)] text-gold text-xl font-bold glow-gold-text">
            {stat}
          </div>
        </div>
      </div>
    </button>
  );
}

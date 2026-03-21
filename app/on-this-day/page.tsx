"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { getMoviesByDate, getMovieDetails } from "@/lib/tmdb";
import type { Movie, MovieDetails } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import SuperlativeCard from "@/components/SuperlativeCard";
import MovieModal from "@/components/MovieModal";
import { formatCurrency, getMonthName } from "@/lib/utils";

type SortOption = "popularity" | "rating" | "revenue" | "year-new" | "year-old";

export default function OnThisDayPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieDetails, setMovieDetails] = useState<Map<number, MovieDetails>>(new Map());
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState<SortOption>("popularity");
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  const handleSearch = useCallback(async (searchMonth?: number, searchDay?: number) => {
    const m = searchMonth ?? month;
    const d = searchDay ?? day;
    setLoading(true);
    setSearched(true);
    try {
      const results = await getMoviesByDate(m, d);
      setMovies(results);

      // Fetch details for top movies (for revenue/budget data)
      const topMovies = results
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 50);

      const details = await Promise.all(
        topMovies.map((mv) => getMovieDetails(mv.id).catch(() => null))
      );

      const detailsMap = new Map<number, MovieDetails>();
      for (const det of details) {
        if (det) detailsMap.set(det.id, det);
      }
      setMovieDetails(detailsMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [month, day]);

  const handleSurprise = () => {
    const randMonth = Math.floor(Math.random() * 12) + 1;
    const maxDay = new Date(2024, randMonth, 0).getDate();
    const randDay = Math.floor(Math.random() * maxDay) + 1;
    setMonth(randMonth);
    setDay(randDay);
    handleSearch(randMonth, randDay);
  };

  // Auto-load today's date on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedMovies = useMemo(() => {
    const copy = [...movies];
    switch (sort) {
      case "rating":
        return copy.sort((a, b) => b.vote_average - a.vote_average);
      case "revenue":
        return copy.sort((a, b) => {
          const ra = movieDetails.get(a.id)?.revenue || 0;
          const rb = movieDetails.get(b.id)?.revenue || 0;
          return rb - ra;
        });
      case "year-new":
        return copy.sort(
          (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
      case "year-old":
        return copy.sort(
          (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );
      case "popularity":
      default:
        return copy.sort((a, b) => b.popularity - a.popularity);
    }
  }, [movies, sort, movieDetails]);

  // Compute superlatives
  const superlatives = useMemo(() => {
    if (movies.length === 0) return [];

    const withDetails = movies
      .map((m) => ({ movie: m, details: movieDetails.get(m.id) }))
      .filter((x) => x.details);

    const result: { icon: string; label: string; movie: Movie; stat: string }[] = [];

    // Most Popular
    const mostPopular = [...movies].sort((a, b) => b.popularity - a.popularity)[0];
    if (mostPopular) {
      result.push({
        icon: "🏆",
        label: "Most Popular",
        movie: mostPopular,
        stat: `${mostPopular.popularity.toFixed(0)} popularity`,
      });
    }

    // Box Office King
    const boxOffice = withDetails
      .filter((x) => x.details!.revenue > 0)
      .sort((a, b) => b.details!.revenue - a.details!.revenue)[0];
    if (boxOffice) {
      result.push({
        icon: "💰",
        label: "Box Office King",
        movie: boxOffice.movie,
        stat: formatCurrency(boxOffice.details!.revenue),
      });
    }

    // Most Controversial
    const controversial = withDetails
      .filter((x) => x.details!.revenue > 50_000_000)
      .sort((a, b) => a.movie.vote_average - b.movie.vote_average)[0];
    if (controversial) {
      result.push({
        icon: "🎭",
        label: "Most Controversial",
        movie: controversial.movie,
        stat: `★ ${controversial.movie.vote_average.toFixed(1)} with ${formatCurrency(controversial.details!.revenue)}`,
      });
    }

    // The Marathon
    const marathon = withDetails
      .filter((x) => x.details!.runtime > 0)
      .sort((a, b) => b.details!.runtime - a.details!.runtime)[0];
    if (marathon) {
      result.push({
        icon: "⏱️",
        label: "The Marathon",
        movie: marathon.movie,
        stat: `${marathon.details!.runtime} min`,
      });
    }

    // Best Investment
    const investment = withDetails
      .filter((x) => x.details!.budget > 0 && x.details!.revenue > 0)
      .sort((a, b) => {
        const ratioA = a.details!.revenue / a.details!.budget;
        const ratioB = b.details!.revenue / b.details!.budget;
        return ratioB - ratioA;
      })[0];
    if (investment) {
      const ratio = (investment.details!.revenue / investment.details!.budget).toFixed(1);
      result.push({
        icon: "📈",
        label: "Best Investment",
        movie: investment.movie,
        stat: `${ratio}x return`,
      });
    }

    // Critics' Darling
    const critics = [...movies]
      .filter((m) => m.vote_count > 200)
      .sort((a, b) => b.vote_average - a.vote_average)[0];
    if (critics) {
      result.push({
        icon: "⭐",
        label: "Critics' Darling",
        movie: critics,
        stat: `★ ${critics.vote_average.toFixed(1)} (${critics.vote_count.toLocaleString()} votes)`,
      });
    }

    return result;
  }, [movies, movieDetails]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(2024, month, 0).getDate(); // Use leap year
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="relative z-[45] flex items-center gap-6 px-6 md:px-12 py-4 border-b border-film-brown/50 bg-dark">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-gold text-2xl font-bold glow-gold-text hover:opacity-80 transition-opacity"
        >
          THE REEL
        </Link>
        <h1 className="font-[family-name:var(--font-typewriter)] text-cream/60 text-sm tracking-widest">
          THE VAULT
        </h1>
      </div>

      {/* Search section */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-gold text-4xl md:text-6xl font-bold glow-gold-text flicker-slow mb-8">
          WHAT HAPPENED ON...
        </h2>

        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Month selector */}
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-dark-mid border-2 border-gold/50 rounded-lg px-4 py-3 text-cream font-[family-name:var(--font-typewriter)] text-lg appearance-none cursor-pointer hover:border-gold transition-colors focus:outline-none focus:border-gold focus:glow-gold"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {getMonthName(m)}
              </option>
            ))}
          </select>

          {/* Day selector */}
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="bg-dark-mid border-2 border-gold/50 rounded-lg px-4 py-3 text-cream font-[family-name:var(--font-typewriter)] text-lg appearance-none cursor-pointer hover:border-gold transition-colors focus:outline-none focus:border-gold focus:glow-gold"
          >
            {daysArray.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Search buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="pulse-glow bg-crimson-bright hover:bg-neon-red text-cream font-[family-name:var(--font-typewriter)] text-lg tracking-wider px-10 py-4 rounded-lg border-2 border-gold/50 hover:border-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SEARCHING THE ARCHIVES..." : "▶ PLAY"}
          </button>
          <button
            onClick={handleSurprise}
            disabled={loading}
            className="bg-film-brown hover:bg-film-brown/80 text-gold font-[family-name:var(--font-typewriter)] text-lg tracking-wider px-8 py-4 rounded-lg border-2 border-gold/30 hover:border-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎲 SURPRISE ME
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full countdown-circle" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.3" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="283" strokeDashoffset="0" strokeLinecap="round" className="transition-all duration-700" />
                <line x1="50" y1="10" x2="50" y2="25" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
                <line x1="50" y1="75" x2="50" y2="90" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
                <line x1="10" y1="50" x2="25" y2="50" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
                <line x1="75" y1="50" x2="90" y2="50" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-[family-name:var(--font-display)] text-gold text-5xl font-bold glow-gold-text flicker">
                  ◎
                </span>
              </div>
            </div>
            <div className="font-[family-name:var(--font-typewriter)] text-cream/40 text-sm tracking-widest">
              SEARCHING THE VAULT...
            </div>
          </div>
        </div>
      )}

      {!loading && searched && movies.length === 0 && (
        <div className="text-center py-20">
          <div className="font-[family-name:var(--font-display)] text-cream/30 text-2xl mb-4">
            No films found for this date.
          </div>
          <div className="font-[family-name:var(--font-typewriter)] text-cream/20 text-sm">
            Try a different date — some dates are more legendary than others.
          </div>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="px-6 pb-20">
          {/* Superlatives */}
          {superlatives.length > 0 && (
            <div className="max-w-6xl mx-auto mb-12">
              <h3 className="font-[family-name:var(--font-typewriter)] text-gold/60 text-sm tracking-widest mb-6 text-center">
                ★ SUPERLATIVES FOR {getMonthName(month).toUpperCase()} {day} ★
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {superlatives.map((s) => (
                  <SuperlativeCard
                    key={s.label}
                    icon={s.icon}
                    label={s.label}
                    movie={s.movie}
                    stat={s.stat}
                    onClick={setSelectedMovie}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sort controls */}
          <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center gap-3">
            <span className="font-[family-name:var(--font-typewriter)] text-cream/40 text-xs">
              {movies.length} FILMS FOUND — SORT:
            </span>
            {(
              [
                { key: "popularity", label: "Popularity" },
                { key: "rating", label: "Rating" },
                { key: "revenue", label: "Revenue" },
                { key: "year-new", label: "Newest" },
                { key: "year-old", label: "Oldest" },
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

          {/* Movie grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={setSelectedMovie}
                height={260}
                showYear
              />
            ))}
          </div>
        </div>
      )}

      <MovieModal movieId={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
}

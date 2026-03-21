const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  /** True if this is a highly anticipated future release, not yet in theaters */
  isAnticipated?: boolean;
}

export interface MovieDetails extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  tagline: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  status: string;
  imdb_id: string | null;
}

interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  const res = await fetch(`${BASE_URL}${endpoint}?${searchParams}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getUpcomingMovies(page = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>("/movie/upcoming", {
    page: String(page),
    language: "en-US",
    region: "US",
  });
}

export async function getNowPlayingMovies(page = 1): Promise<TMDBResponse> {
  return fetchTMDB<TMDBResponse>("/movie/now_playing", {
    page: String(page),
    language: "en-US",
    region: "US",
  });
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${id}`, {
    language: "en-US",
  });
}

export async function getMoviesByDate(
  month: number,
  day: number
): Promise<Movie[]> {
  const currentYear = new Date().getFullYear();
  const allMovies: Movie[] = [];
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");

  // Fetch movies for this date across decades (batched to avoid too many requests)
  const yearRanges: [number, number][] = [];
  for (let startYear = 1970; startYear <= currentYear; startYear += 5) {
    const endYear = Math.min(startYear + 4, currentYear);
    yearRanges.push([startYear, endYear]);
  }

  const promises = yearRanges.map(async ([startYear, endYear]) => {
    const movies: Movie[] = [];
    for (let year = startYear; year <= endYear; year++) {
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      try {
        const data = await fetchTMDB<TMDBResponse>("/discover/movie", {
          "primary_release_date.gte": dateStr,
          "primary_release_date.lte": dateStr,
          "vote_count.gte": "100",
          sort_by: "popularity.desc",
          language: "en-US",
          page: "1",
        });
        movies.push(...data.results);
      } catch {
        // Skip years with errors
      }
    }
    return movies;
  });

  const results = await Promise.all(promises);
  for (const movies of results) {
    allMovies.push(...movies);
  }

  // Deduplicate by id
  const seen = new Set<number>();
  return allMovies.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

async function getAnticipatedFutureMovies(): Promise<Movie[]> {
  const today = new Date();
  // Start from ~6 weeks out (beyond TMDB's "upcoming" window) through 1 year ahead
  // This catches far-out tentpoles like Avengers: Doomsday, Dune 3, etc.
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + 42);
  const endDate = new Date(today);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  const allMovies: Movie[] = [];

  // Fetch pages sorted by popularity — top 150 results (8 pages × 20 = 160)
  for (let page = 1; page <= 1; page++) {
    try {
      const data = await fetchTMDB<TMDBResponse>("/discover/movie", {
        "primary_release_date.gte": startStr,
        "primary_release_date.lte": endStr,
        sort_by: "popularity.desc",
        language: "en-US",
        page: String(page),
      });
      allMovies.push(...data.results);
      if (page >= data.total_pages) break;
    } catch {
      break;
    }
  }

  // Keep the top 150 most popular, tag as anticipated
  return allMovies
    .filter((m) => m.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
    .map((m) => ({ ...m, isAnticipated: true }));
}

export async function getAllUpcomingMovies(): Promise<Movie[]> {
  const allMovies: Movie[] = [];

  // Fetch upcoming movies
  const firstPage = await getUpcomingMovies(1);
  allMovies.push(...firstPage.results);
  const totalPages = Math.min(firstPage.total_pages, 10);

  const upcomingPromises = [];
  for (let page = 2; page <= totalPages; page++) {
    upcomingPromises.push(getUpcomingMovies(page));
  }

  // Fetch now playing
  const nowPlayingFirst = await getNowPlayingMovies(1);
  allMovies.push(...nowPlayingFirst.results);
  const npPages = Math.min(nowPlayingFirst.total_pages, 5);

  const npPromises = [];
  for (let page = 2; page <= npPages; page++) {
    npPromises.push(getNowPlayingMovies(page));
  }

  const [upcomingResults, npResults, anticipatedMovies] = await Promise.all([
    Promise.all(upcomingPromises),
    Promise.all(npPromises),
    getAnticipatedFutureMovies(),
  ]);

  for (const r of upcomingResults) allMovies.push(...r.results);
  for (const r of npResults) allMovies.push(...r.results);

  // Deduplicate — current/upcoming movies take priority over anticipated tag
  const seen = new Set<number>();
  const result = allMovies
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return m.popularity > 10;
    });

  // Add anticipated movies that aren't already in the list
  for (const m of anticipatedMovies) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      result.push(m);
    }
  }

  return result.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
}

export function getPosterUrl(path: string | null, size = "w500"): string {
  if (!path) return "/no-poster.svg";
  return `${IMAGE_BASE}${size}${path}`;
}

export function getBackdropUrl(path: string | null, size = "w1280"): string {
  if (!path) return "";
  return `${IMAGE_BASE}${size}${path}`;
}

import { Movie, MoviesResponse } from '@/features/movies/types/movie';

const CACHE_KEY = 'movies_cache';
const CACHE_EXPIRY_KEY = 'movies_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CachedMovieData {
  movies: Movie[];
  total: number;
  timestamp: number;
}

export const movieCache = {
  // Save movies to cache
  saveToCache(movies: Movie[], total: number): void {
    try {
      const cacheData: CachedMovieData = {
        movies,
        total,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  },

  // Get movies from cache
  getFromCache(): CachedMovieData | null {
    try {
      const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      // Check if cache has expired
      if (!expiryTime || Date.now() > parseInt(expiryTime)) {
        this.clearCache();
        return null;
      }

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (!cachedData) {
        return null;
      }

      return JSON.parse(cachedData) as CachedMovieData;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  // Get paginated movies from cache
  getPaginatedFromCache(skip: number, limit: number): MoviesResponse | null {
    const cachedData = this.getFromCache();
    if (!cachedData) {
      return null;
    }

    // Check if we have enough movies in cache for this pagination request
    if (skip + limit > cachedData.movies.length && cachedData.movies.length < cachedData.total) {
      // We don't have enough cached data for this page
      return null;
    }

    const paginatedMovies = cachedData.movies.slice(skip, skip + limit);
    
    return {
      movies: paginatedMovies,
      total: cachedData.total,
      skip,
      limit,
    };
  },

  // Append new movies to cache (for pagination)
  appendToCache(newMovies: Movie[], total: number): void {
    try {
      const cachedData = this.getFromCache();
      
      if (!cachedData) {
        // No existing cache, save new data
        this.saveToCache(newMovies, total);
        return;
      }

      // Merge new movies with existing cache, avoiding duplicates
      const existingIds = new Set(cachedData.movies.map(m => m.id));
      const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
      
      const updatedMovies = [...cachedData.movies, ...uniqueNewMovies];
      this.saveToCache(updatedMovies, total);
    } catch (error) {
      console.error('Error appending to cache:', error);
    }
  },

  // Check if we have all movies cached
  hasAllMovies(): boolean {
    const cachedData = this.getFromCache();
    if (!cachedData) {
      return false;
    }
    return cachedData.movies.length >= cachedData.total;
  },

  // Clear cache
  clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  // Get cache info for debugging
  getCacheInfo(): { size: number; total: number; expiresIn: number } | null {
    const cachedData = this.getFromCache();
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    
    if (!cachedData || !expiryTime) {
      return null;
    }

    return {
      size: cachedData.movies.length,
      total: cachedData.total,
      expiresIn: Math.max(0, parseInt(expiryTime) - Date.now()),
    };
  },
};

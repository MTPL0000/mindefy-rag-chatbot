'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckSquare, Square } from 'lucide-react';
import Header from '@/features/movies/components/Header';
import SearchBar from '@/features/movies/components/SearchBar';
import MovieCard from '@/features/movies/components/MovieCard';
import LoadingSpinner from '@/features/movies/components/LoadingSpinner';
import { movieApi } from '@/features/movies/lib/api';
import { movieCache } from '@/features/movies/lib/movieCache';

export default function MoviesHome() {
  const router = useRouter();
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchPage, setSearchPage] = useState(0);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [moviesPerPage, setMoviesPerPage] = useState(24);

  useEffect(() => {
    setIsClient(true);
    
    const calculateMoviesPerPage = () => {
      const width = window.innerWidth;
      let columns = 6;
      
      if (width < 640) {
        columns = 2;
      } else if (width < 768) {
        columns = 3;
      } else if (width < 1024) {
        columns = 4;
      } else if (width < 1280) {
        columns = 5;
      }
      
      const rows = 4;
      setMoviesPerPage(columns * rows);
    };
    
    calculateMoviesPerPage();
    window.addEventListener('resize', calculateMoviesPerPage);
    
    return () => window.removeEventListener('resize', calculateMoviesPerPage);
  }, []);

  const loadMovies = useCallback(async (page, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const skip = page * moviesPerPage;
      const limit = moviesPerPage;

      const cachedResponse = movieCache.getPaginatedFromCache(skip, limit);
      
      if (cachedResponse) {
        console.log('Loading movies from cache:', { skip, limit, cached: cachedResponse.movies.length });
        
        if (isLoadMore) {
          setMovies(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMovies = cachedResponse.movies.filter(m => !existingIds.has(m.id));
            return [...prev, ...newMovies];
          });
        } else {
          setMovies(cachedResponse.movies);
        }

        setTotalMovies(cachedResponse.total);
        setHasMore(skip + limit < cachedResponse.total);
        setCurrentPage(page);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      console.log('Cache miss - fetching from API:', { skip, limit });
      const response = await movieApi.getAllMoviesPaginated(skip, limit);

      if (isLoadMore) {
        movieCache.appendToCache(response.movies, response.total);
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMovies = response.movies.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMovies];
        });
      } else {
        movieCache.saveToCache(response.movies, response.total);
        setMovies(response.movies);
      }

      setTotalMovies(response.total);
      setHasMore(response.skip + response.limit < response.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading movies:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [moviesPerPage]);

  useEffect(() => {
    loadMovies(0, false);
  }, [loadMovies]);

  const performSearch = useCallback(async (query, page = 0, isLoadMore = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchTotal(0);
      setSearchPage(0);
      setHasMoreSearch(false);
      setIsSearching(false);
      return;
    }

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsSearching(true);
      }

      console.log('Performing search for:', query, 'page:', page);
      const response = await movieApi.searchMovies(query, page * moviesPerPage, moviesPerPage);
      console.log('Search response received:', response);
      
      if (isLoadMore) {
        setSearchResults(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newResults = response.results.filter(m => !existingIds.has(m.id));
          return [...prev, ...newResults];
        });
      } else {
        setSearchResults(response.results);
      }

      setSearchTotal(response.total);
      setSearchPage(page);
      setHasMoreSearch((page + 1) * moviesPerPage < response.total);
    } catch (error) {
      console.error('Error searching movies:', error);
      if (!isLoadMore) {
        setSearchResults([]);
        setSearchTotal(0);
      }
      setHasMoreSearch(false);
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  }, [moviesPerPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery, 0, false);
      } else {
        setSearchResults([]);
        setSearchTotal(0);
        setSearchPage(0);
        setHasMoreSearch(false);
        setIsSearching(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const displayedMovies = useMemo(() => {
    return searchQuery.trim() ? searchResults : movies;
  }, [searchQuery, searchResults, movies]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    
    if (searchQuery.trim()) {
      if (hasMoreSearch) {
        performSearch(searchQuery, searchPage + 1, true);
      }
    } else {
      if (hasMore) {
        loadMovies(currentPage + 1, true);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchTotal(0);
    setSearchPage(0);
    setHasMoreSearch(false);
    setIsSearching(false);
  };

  const handleSelectMovie = (movie, e) => {
    setSelectedMovies((prev) => {
      const isSelected = prev.some((m) => m.id === movie.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleMovieClick = (movie) => {
    if (isSelectMode) {
      setSelectedMovies((prev) => {
        const isSelected = prev.some((m) => m.id === movie.id);
        if (isSelected) {
          return prev.filter((m) => m.id !== movie.id);
        } else {
          return [...prev, movie];
        }
      });
    } else {
      const encodedTitle = encodeURIComponent(movie.title);
      router.push(`/movies/${encodedTitle}`);
    }
  };

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode(prev => {
      const newMode = !prev;
      if (!newMode) {
        setSelectedMovies([]);
      }
      return newMode;
    });
  }, []);

  const handleGetRecommendations = () => {
    const movieTitles = selectedMovies.map((m) => encodeURIComponent(m.title)).join(',');
    router.push(`/movies/recommendations?movies=${movieTitles}`);
  };

  const isSelected = (movieId) => {
    return selectedMovies.some((m) => m.id === movieId);
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-4xl text-center mb-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-3">
            Discover Your Next Favorite Movie
          </h2>
          <p className="text-muted text-base sm:text-lg">
            Select at least 5 movies you like, and we'll recommend movies tailored to your taste.
          </p>
        </div>

        <div className="mx-auto max-w-2xl mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search movies, genres, cast, or keywords..."
          />
          {searchQuery.trim() && (
            <div className="mt-2 text-center text-sm text-muted">
              {isSearching ? (
                <span>Searching...</span>
              ) : (
                <span>
                  Found {searchTotal} result{searchTotal !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          {!isSelectMode && (
            <button
              onClick={toggleSelectMode}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer border border-border bg-card hover:bg-card-hover"
            >
              <Square className="h-4 w-4" />
              <span>Select Movies</span>
            </button>
          )}
          
          {isSelectMode && (
            <>
              <button
                onClick={toggleSelectMode}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-accent text-background"
              >
                <CheckSquare className="h-4 w-4" />
                <span>Select Mode</span>
              </button>
              
              {selectedMovies.length > 0 && (
                <span className="text-sm text-muted">
                  {selectedMovies.length} selected
                </span>
              )}
            </>
          )}
        </div>

        {!isSelectMode && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleMovieClick}
                showGenres={true}
                showRating={true}
              />
            ))}
          </div>
        )}
        
        {isSelectMode && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                selected={isSelected(movie.id)}
                onSelect={handleSelectMovie}
                onClick={handleMovieClick}
                showGenres={true}
                showRating={true}
              />
            ))}
          </div>
        )}

        {displayedMovies.length === 0 && !isLoading && !isSearching && (
          <div className="text-center py-12">
            <p className="text-muted">
              {searchQuery.trim() ? 'No movies found matching your search.' : 'No movies available.'}
            </p>
          </div>
        )}

        {((searchQuery.trim() && hasMoreSearch) || (!searchQuery.trim() && hasMore)) && (
          <div className="flex justify-center py-8 mb-24">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 rounded-full bg-card hover:bg-card-hover border border-border px-6 py-3 text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-card-hover"
            >
              {isLoadingMore ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-accent"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>Load More Movies</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {selectedMovies.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">
                <span className="font-medium">{selectedMovies.length}</span>
                <span className="text-muted ml-1">
                  selected {selectedMovies.length === 1 ? 'movie' : 'movies'}
                </span>
                <span className="text-muted ml-2">
                  (Select at least 5)
                </span>
              </div>
              <button
                onClick={handleGetRecommendations}
                disabled={selectedMovies.length < 5}
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Get Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

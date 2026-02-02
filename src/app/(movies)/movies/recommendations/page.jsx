'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, SlidersHorizontal, Star } from 'lucide-react';
import Header from '@/features/movies/components/Header';
import LoadingSpinner from '@/features/movies/components/LoadingSpinner';
import MoviePoster from '@/features/movies/components/MoviePoster';
import Dropdown from '@/features/movies/components/Dropdown';
import { movieApi } from '@/features/movies/lib/api';

function RecommendationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [likedMovies, setLikedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const recommendationsCount = 12;
  const fetchedRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const encodedTitles = searchParams.get('movies')?.split(',') || [];
      
      if (encodedTitles.length === 0) {
        router.push('/movies');
        return;
      }

      const movieTitles = encodedTitles.map(title => decodeURIComponent(title));
      const movieKey = movieTitles.sort().join(',');
      
      if (fetchedRef.current === movieKey) {
        return;
      }
      
      fetchedRef.current = movieKey;
      setLikedMovies(movieTitles);
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching recommendations for:', movieTitles.length, 'movies');
        const response = await movieApi.getPersonalizedRecommendations({
          liked_movies: movieTitles,
          top_n: recommendationsCount,
        });
        
        setRecommendations(response.recommendations);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Failed to load recommendations');
        fetchedRef.current = null;
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [searchParams, router]);

  const genreOptions = useMemo(() => {
    const genres = new Set();
    recommendations.forEach((movie) => {
      movie.genres.forEach((genre) => genres.add(genre));
    });
    const allGenres = ['all', ...Array.from(genres).sort()];
    return allGenres.map(genre => ({
      value: genre,
      label: genre === 'all' ? 'All Genres' : genre
    }));
  }, [recommendations]);

  const sortOptions = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'year', label: 'Newest First' },
  ];

  const filteredAndSortedRecommendations = useMemo(() => {
    let filtered = recommendations;

    if (genreFilter !== 'all') {
      filtered = filtered.filter((movie) =>
        movie.genres.includes(genreFilter)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'relevance') {
        return b.relevance_score - a.relevance_score;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else {
        return b.release_year - a.release_year;
      }
    });

    return sorted;
  }, [recommendations, genreFilter, sortBy]);

  const handleMovieClick = (movie) => {
    const encodedTitle = encodeURIComponent(movie.title);
    router.push(`/movies/${encodedTitle}`);
  };

  return (
    <div className="min-h-screen pb-8">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/movies')}
          className="mb-8 flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Start Over</span>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Recommended for You
          </h2>
          
          {likedMovies.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted mb-3">Based on your selections:</p>
              <div className="flex flex-wrap gap-2">
                {likedMovies.map((title, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error Loading Recommendations</h3>
            <p className="text-muted mb-6">{error}</p>
            <button
              onClick={() => router.push('/movies')}
              className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-hover transition-all"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-accent" />
                <span className="text-base font-semibold">
                  {filteredAndSortedRecommendations.length} Recommendations
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Dropdown
                  value={genreFilter}
                  onChange={setGenreFilter}
                  options={genreOptions}
                  className="w-[180px]"
                />

                <Dropdown
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                  options={sortOptions}
                  className="w-[180px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredAndSortedRecommendations.map((movie) => (
                <div
                  key={movie.movie_id}
                  onClick={() => handleMovieClick(movie)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-[2/3] overflow-hidden flex-shrink-0">
                    <MoviePoster
                      src={movie.poster_url}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted mb-2">
                      <span>{movie.release_year}</span>
                      {movie.rating != null && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2 min-h-[1.25rem]">
                        {movie.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full leading-tight"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted mt-auto">
                      <span className="font-medium">{(movie.relevance_score * 100).toFixed(0)}% match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedRecommendations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No recommendations found with the selected filters.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RecommendationsContent />
    </Suspense>
  );
}

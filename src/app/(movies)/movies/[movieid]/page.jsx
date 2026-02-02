'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Star, Calendar } from 'lucide-react';
import Header from '@/features/movies/components/Header';
import LoadingSpinner from '@/features/movies/components/LoadingSpinner';
import MoviePoster from '@/features/movies/components/MoviePoster';
import { movieApi } from '@/features/movies/lib/api';

export default function MovieDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetails = async () => { 
      const movieTitle = params.movieid;
      
      if (fetchedRef.current === movieTitle) {
        return;
      }
      
      fetchedRef.current = movieTitle;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const decodedTitle = decodeURIComponent(movieTitle);
        
        console.log('Fetching movie details for:', decodedTitle);
        const data = await movieApi.getMovieDetailsWithSimilar(decodedTitle, 6);
        setMovie(data.movie);
        setSimilarMovies(data.similar_movies);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.message || 'Failed to load movie details');
        fetchedRef.current = null;
      } finally {
        setIsLoading(false);
      }
    };

    if (params.movieid) {
      fetchMovieDetails();
    }
  }, [params.movieid]);

  const handleSimilarMovieClick = (selectedMovie) => {
    const encodedTitle = encodeURIComponent(selectedMovie.title);
    router.push(`/movies/${encodedTitle}`);
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
          <p className="text-muted mb-6">{error}</p>
          <button
            onClick={() => router.push('/movies')}
            className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-hover transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-muted">Movie not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <MoviePoster
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/20" />
        </div>

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 sm:left-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

      </div>

      <main className="px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
              {movie.title}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-foreground font-medium">{movie.release_year}</span>
              <span className="text-muted">•</span>
              {movie.runtime && (
                <>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted" />
                    <span className="text-muted">{movie.runtime}m</span>
                  </div>
                  <span className="text-muted">•</span>
                </>
              )}
              {movie.rating != null && (
                <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold text-accent">{movie.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="mb-10 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-card px-4 py-2 text-sm font-medium border border-border hover:border-accent/40 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">Storyline</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {movie.overview}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-foreground">Cast & Crew</h2>
              
              <div className="space-y-6">
                {movie.directors && movie.directors.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                      Director{movie.directors.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-base font-medium text-foreground">{movie.directors.join(', ')}</p>
                  </div>
                )}

                {movie.cast_and_crew && movie.cast_and_crew.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                      Cast
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {movie.cast_and_crew.slice(0, 10).map((actor, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-card border border-border px-4 py-2 text-sm font-medium hover:border-accent/40 transition-colors"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {similarMovies.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Similar Movies</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {similarMovies.map((similarMovie) => (
                  <div
                    key={similarMovie.movie_id}
                    onClick={() => handleSimilarMovieClick(similarMovie)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 flex flex-col"
                  >
                    <div className="aspect-[2/3] overflow-hidden flex-shrink-0">
                      <MoviePoster
                        src={similarMovie.poster_url}
                        alt={similarMovie.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{similarMovie.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted mt-auto">
                        <span>{similarMovie.release_year}</span>
                        {similarMovie.rating != null && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              <span>{similarMovie.rating.toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

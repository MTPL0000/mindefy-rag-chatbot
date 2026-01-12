'use client';

import { Check } from 'lucide-react';
import { Movie } from '@/features/movies/types/movie';
import { CheckSquare, Square } from 'lucide-react';
import MoviePoster from './MoviePoster';

interface MovieCardProps {
  movie: Movie;
  selected?: boolean;
  onSelect?: (movie: Movie, e: React.MouseEvent) => void;
  onClick?: (movie: Movie) => void;
  showGenres?: boolean;
  showRating?: boolean;
}

export default function MovieCard({
  movie,
  selected = false,
  onSelect,
  onClick,
  showGenres = false,
  showRating = false,
}: MovieCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(movie, e);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${
        selected ? 'border-2 border-accent' : 'border-2 border-transparent'
      }`}
    >
      <div className="aspect-[2/3] overflow-hidden bg-muted/20">
        <MoviePoster
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {onSelect && (
        <div 
          onClick={handleCheckboxClick}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 z-10"
        >
          {selected && (
            <Check className="h-4 w-4 text-white" />
          )}
        </div>
      )}

      <div className="p-3">
        <h3 className="line-clamp-1 font-medium text-sm">{movie.title}</h3>
        <p className="text-xs text-muted mt-1">{movie.year}</p>
        
        {showGenres && movie.genres && movie.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-muted/10 px-2 py-0.5 text-xs text-muted"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {showRating && movie.rating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs">★</span>
            <span className="text-xs text-muted">{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

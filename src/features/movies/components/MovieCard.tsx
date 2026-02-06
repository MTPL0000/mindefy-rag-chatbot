'use client';

import { Check, Star } from 'lucide-react';
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
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 flex flex-col ${
        selected ? 'border-2 border-accent' : 'border-2 border-transparent'
      }`}
    >
      <div className="aspect-[2/3] overflow-hidden flex-shrink-0">
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

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <span>{movie.year}</span>
          {showRating && movie.rating != null && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
        {showGenres && movie.genres && movie.genres.length > 0 && (
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
      </div>
    </div>
  );
}

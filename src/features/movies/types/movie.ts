export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  rating: number;
  runtime?: number;
  plot?: string;
  director?: string;
  cast?: string[];
}

export interface MovieDetails {
  title: string;
  movie_id: number;
  poster_url: string;
  overview: string;
  release_year: number;
  runtime: number;
  language: string;
  genres: string[];
  rating: number;
  cast_and_crew: string[];
  directors: string[];
}

export interface SimilarMovie {
  title: string;
  movie_id: number;
  poster_url: string;
  rating: number;
  release_year: number;
}

export interface MovieDetailsWithSimilarResponse {
  movie: MovieDetails;
  similar_movies: SimilarMovie[];
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchResponse {
  results: Movie[];
  total: number;
}

export interface RecommendedMovie {
  title: string;
  movie_id: number;
  relevance_score: number;
  poster_url: string;
  release_year: number;
  rating: number;
  genres: string[];
}

export interface PersonalizedRecommendationsResponse {
  liked_movies: string[];
  recommendations: RecommendedMovie[];
  total_returned: number;
}

export interface RecommendationRequest {
  liked_movies: string[];
  top_n: number;
}

export interface SelectedMoviesState {
  movies: Movie[];
  count: number;
}

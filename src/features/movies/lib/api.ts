import { Movie, MoviesResponse, MovieDetailsWithSimilarResponse, SearchResponse, PersonalizedRecommendationsResponse, RecommendationRequest } from '@/features/movies/types/movie';

const API_BASE_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL || 'http://localhost:8000/api';

export const movieApi = {
  async getAllMoviesPaginated(skip: number = 0, limit: number = 24): Promise<MoviesResponse> {
    try {
      const url = `${API_BASE_URL}/all?skip=${skip}&limit=${limit}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API data:', data);
      
      // Transform API response to match our Movie interface
      const movies: Movie[] = data.movies.map((movie: any) => ({
        id: movie.movie_id.toString(),
        title: movie.title,
        year: movie.release_year || 2020,
        poster: movie.poster_url || '/placeholder-movie.jpg',
        genres: ['Drama', 'Action'], // Default genres since API doesn't provide them
        rating: 7.5, // Default rating since API doesn't provide it
      }));

      return {
        movies,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    } catch (error: any) {
      console.error('Error fetching movies:', error);
      console.error('API_BASE_URL:', API_BASE_URL);
      
      throw error;
    }
  },

  async searchMovies(query: string, skip: number = 0, limit: number = 24): Promise<SearchResponse> {
    try {
      const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`;
      console.log('Search URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search API Error:', response.status, errorText);
        throw new Error(`Failed to search movies: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search API Response:', data);
      
      // Check if results exist and is an array
      if (!data.results || !Array.isArray(data.results)) {
        console.error('Invalid search response format:', data);
        return {
          results: [],
          total: 0,
        };
      }
      
      // Transform API response to match our Movie interface
      const movies: Movie[] = data.results.map((movie: any) => ({
        id: movie.movie_id?.toString() || String(Math.random()),
        title: movie.title || 'Unknown',
        year: movie.release_year || 2020,
        poster: movie.poster_url || '/placeholder-movie.jpg',
        genres: movie.genres || ['Drama'],
        rating: movie.rating || 7.5,
      }));

      return {
        results: movies,
        total: data.total || movies.length,
      };
    } catch (error: any) {
      console.error('Error searching movies:', error);
      console.error('API_BASE_URL:', API_BASE_URL);
      // Return empty results instead of throwing to prevent UI from breaking
      return {
        results: [],
        total: 0,
      };
    }
  },

  async getMovieDetailsWithSimilar(title: string, limit: number = 5): Promise<MovieDetailsWithSimilarResponse> {
    try {
      const encodedTitle = encodeURIComponent(title);
      const url = `${API_BASE_URL}/details-with-similar/${encodedTitle}?limit=${limit}`;
      console.log('Fetching movie details from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  async getPersonalizedRecommendations(request: RecommendationRequest): Promise<PersonalizedRecommendationsResponse> {
    try {
      const url = `${API_BASE_URL}/recommendations/personalized`;
      console.log('Fetching personalized recommendations:', request);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Recommendations API Error:', response.status, errorText);
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }

      const data = await response.json();
      console.log('Recommendations API Response:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
};

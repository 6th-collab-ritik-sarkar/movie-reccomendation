import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, Film } from 'lucide-react';
import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchMovies(query);
      setResults(data.data?.results || []);
      if (data.data?.results?.length === 0) {
        setError(`No movies found for "${query}"`);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-12 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white">
              {query ? `Results for "${query}"` : 'Discover Movies'}
            </h1>
            <p className="text-zinc-400 mt-1">
              Found {results.length} movies matching your criteria
            </p>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors border border-zinc-700">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <Loader size="lg" text="Searching the library..." />
          </div>
        ) : error ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-10 h-10 text-zinc-500" />
            </div>
            <h2 className="text-xl text-white font-bold">{error}</h2>
            <p className="text-zinc-500 mt-2">Try searching with different keywords or check for typos.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {results.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {!query && !loading && (
           <div className="h-[50vh] flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
               <Film className="w-10 h-10 text-zinc-500" />
             </div>
             <h2 className="text-xl text-white font-bold">Start searching</h2>
             <p className="text-zinc-500 mt-2">Enter a movie name in the search bar above.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Search;

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { debounce } from '../utils/debounce';
import { searchMovies } from '../services/movieService';

const SearchBar = ({ autoFocus = false, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = debounce(async (q) => {
    if (!q.trim() || q.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const data = await searchMovies(q);
      setSuggestions(data.data?.results?.slice(0, 6) || []);
      setShowDropdown(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 400);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onClose) onClose();
    }
  };

  const handleSelectMovie = (movie) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/movie/${movie.imdbID}`);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 bg-zinc-800/90 border border-zinc-700 rounded-full px-4 py-2.5 focus-within:border-netflix-red transition-all duration-200">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search movies..."
            id="global-search-input"
            className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border border-zinc-600 border-t-netflix-red rounded-full animate-spin flex-shrink-0" />
          )}
          {query && !loading && (
            <button type="button" onClick={clearSearch} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-up">
          {suggestions.map((movie) => {
            const id = movie.imdbID;
            const title = movie.Title;
            const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;
            const year = movie.Year;
            const rating = movie.imdbRating;

            return (
              <button
                key={id}
                onClick={() => handleSelectMovie(movie)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
              >
                {poster ? (
                  <img
                    src={poster}
                    alt={title}
                    className="w-8 h-12 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-12 bg-zinc-700 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-zinc-500 text-xs">?</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{title}</p>
                  <p className="text-zinc-400 text-xs">
                    {year} · ⭐ {rating}
                  </p>
                </div>
              </button>
            );
          })}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 w-full px-4 py-3 border-t border-zinc-700 text-netflix-red text-sm hover:bg-zinc-800 transition-colors"
          >
            <Search className="w-4 h-4" />
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

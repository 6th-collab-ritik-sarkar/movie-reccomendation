import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Play, Info, Search } from 'lucide-react';
import { getTrending, getMoodRecommendations } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [trending, setTrending] = useState([]);
  const [mood, setMood] = useState('');
  const [moodResults, setMoodResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moodLoading, setMoodLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async (attempt = 0) => {
    try {
      const data = await getTrending();
      if (data.success) {
        setTrending(data.data.results || []);
        setLoading(false);
      } else {
        setError(data.message || 'Failed to load movies');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching trending:', err);
      // Handle startup race where frontend loads before backend is ready.
      if (!err.response && attempt < 2) {
        setTimeout(() => fetchTrending(attempt + 1), 1500);
        return;
      }
      setError(err.response?.data?.message || 'Could not connect to the server. Please check if the backend is running.');
      setLoading(false);
    }
  };

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!mood.trim()) return;
    
    setMoodLoading(true);
    setError('');
    try {
      const data = await getMoodRecommendations(mood);
      setMoodResults(data.data);
    } catch (err) {
      setError('AI could not understand your mood. Try something like "sad", "action packed" or "mind bending".');
    } finally {
      setMoodLoading(false);
    }
  };

  const [imgError, setImgError] = useState(false);
  const heroMovie = trending[0];

  const backdrop = heroMovie?.Poster && heroMovie.Poster !== 'N/A' && !imgError
    ? heroMovie.Poster
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
      <Loader size="xl" text="Setting the stage..." />
    </div>
  );

  if (error && trending.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-netflix-dark px-4 text-center">
      <div className="bg-netflix-red/10 p-6 rounded-2xl mb-6">
        <Info className="w-12 h-12 text-netflix-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-zinc-400 max-w-md">{error}</p>
      </div>
      <button 
        onClick={() => {
          setLoading(true);
          setError('');
          fetchTrending();
        }}
        className="btn-primary px-8 py-3 flex items-center gap-2"
      >
        <TrendingUp className="w-5 h-5" /> Try Again
      </button>
    </div>
  );

  return (
    <div className="pb-20 animate-fade-in">
      {/* Hero Section */}
      {heroMovie ? (
        <section className="relative h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={backdrop}
              alt={heroMovie.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-netflix-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-center px-4 sm:px-12 max-w-4xl gap-4">
            <h1 className="text-4xl sm:text-6xl font-black text-white drop-shadow-lg leading-tight">
              {heroMovie.Title}
            </h1>
            <p className="text-zinc-300 text-lg sm:text-xl line-clamp-3 max-w-2xl">
              {heroMovie.Plot}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link 
                to={`/movie/${heroMovie.imdbID}`}
                className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 fill-current" /> Play
              </Link>
              <Link 
                to={`/movie/${heroMovie.imdbID}`}
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-3"
              >
                <Info className="w-5 h-5" /> More Info
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[40vh] flex items-center justify-center">
          <p className="text-zinc-500">No movies found at the moment. Try refreshing.</p>
        </div>
      )}

      <div className="px-4 sm:px-12 -mt-20 relative z-10 space-y-12">
        {/* Mood Section */}
        <section className="card-glass p-8 max-w-5xl mx-auto border-netflix-red/20 shadow-2xl shadow-netflix-red/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-netflix-red/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-netflix-red" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mood Matcher AI</h2>
              <p className="text-zinc-400 text-sm">Tell us how you feel, we'll find what to watch.</p>
            </div>
          </div>

          <form onSubmit={handleMoodSubmit} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. 'feeling sad and want a thriller' or 'something mind-bending'"
              className="input-field text-lg"
              disabled={moodLoading}
            />
            <button 
              type="submit"
              disabled={moodLoading || !mood.trim()}
              className="btn-primary flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-50"
            >
              {moodLoading ? <Loader size="sm" /> : 'Get Recs'}
            </button>
          </form>

          {error && <p className="text-netflix-red text-sm mt-3">{error}</p>}

          {moodResults && (
            <div className="mt-10 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Recommendations for you
                </h3>
              </div>
              <div className="movie-grid">
                {moodResults.map(movie => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Trending Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-netflix-red" />
            <h2 className="section-title">Trending This Week</h2>
          </div>
          <div className="movie-grid">
            {trending.slice(1).map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

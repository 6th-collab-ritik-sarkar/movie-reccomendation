import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Clock, User as UserIcon, Calendar, 
  ChevronRight, Trash2, Settings, ExternalLink, Star, MessageSquare 
} from 'lucide-react';
import { getProfile, getFavorites, getWatchHistory, removeFavorite } from '../services/userService';
import { getUserReviews, deleteReview } from '../services/reviewService';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profData, favData, histData, revData] = await Promise.all([
        getProfile(),
        getFavorites(),
        getWatchHistory(),
        getUserReviews()
      ]);
      setProfile(profData.data);
      setFavorites(favData.data);
      setHistory(histData.data);
      setReviews(revData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFav = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites(prev => prev.filter(f => f.movieId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
      <Loader size="xl" text="Preparing your dashboard..." />
    </div>
  );

  return (
    <div className="pt-24 px-4 sm:px-12 pb-20 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center gap-6 mb-12 p-8 card-glass border-netflix-red/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
           <UserIcon className="w-64 h-64 -mr-20 -mt-20" />
        </div>
        
        <div className="w-24 h-24 bg-gradient-to-br from-netflix-red to-red-800 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-2xl relative z-10">
          {profile?.name?.charAt(0)}
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-3xl font-black text-white mb-1">{profile?.name}</h1>
          <p className="text-zinc-400 mb-4">{profile?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Favorites</p>
              <p className="text-xl font-bold text-white">{favorites.length}</p>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Watched</p>
              <p className="text-xl font-bold text-white">{history.length}</p>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Reviews</p>
              <p className="text-xl font-bold text-white">{reviews.length}</p>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Member Since</p>
              <p className="text-xl font-bold text-white">
                {new Date(profile?.createdAt).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        <button className="btn-secondary flex items-center gap-2 relative z-10">
          <Settings className="w-4 h-4" /> Edit Profile
        </button>
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        <div className="flex border-b border-zinc-800 gap-8">
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'favorites' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            My Favorites
            {activeTab === 'favorites' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-netflix-red rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'history' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Watch History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-netflix-red rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'reviews' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            My Reviews
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-netflix-red rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'favorites' && (
          favorites.length > 0 ? (
            <div className="movie-grid">
              {favorites.map(m => (
                <MovieCard 
                  key={m.movieId} 
                  movie={{ 
                    imdbID: m.movieId, 
                    Title: m.title, 
                    Poster: m.poster_path, 
                    imdbRating: m.vote_average, 
                    Year: m.release_date 
                  }} 
                  isFav={true}
                  onFavChange={handleRemoveFav}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center card-glass">
               <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-white text-xl font-bold">Your list is empty</h3>
               <p className="text-zinc-500 mt-2">Start adding movies to your favorites to see them here.</p>
            </div>
          )
        )}

        {activeTab === 'history' && (
          history.length > 0 ? (
            <div className="space-y-4">
              {history.map(m => (
                <div key={m.movieId} className="flex items-center gap-4 p-4 card-glass hover:bg-zinc-800/50 transition-colors group">
                  <div className="w-16 h-24 flex-shrink-0">
                    <img 
                      src={m.poster_path} 
                      alt={m.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{m.title}</h4>
                    <p className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> 
                      Watched on {new Date(m.watchedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/movie/${m.movieId}`)}
                    className="p-3 rounded-full bg-zinc-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center card-glass">
               <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-white text-xl font-bold">No history yet</h3>
               <p className="text-zinc-500 mt-2">Movies you watch will appear here automatically.</p>
            </div>
          )
        )}

        {activeTab === 'reviews' && (
          reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r._id} className="p-6 card-glass hover:bg-zinc-800/30 transition-all group border border-zinc-800">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-20 h-28 flex-shrink-0 mx-auto md:mx-0">
                      <img 
                        src={r.moviePoster} 
                        alt={r.movieTitle}
                        className="w-full h-full object-cover rounded-lg border border-zinc-700"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold text-xl">{r.movieTitle}</h4>
                        <div className="flex items-center gap-1 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-bold text-sm">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-zinc-400 italic mb-4">"{r.comment}"</p>
                      <div className="flex items-center justify-between">
                        <p className="text-zinc-500 text-xs">Reviewed on {new Date(r.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/movie/${r.movieId}`)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                            title="View Movie"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(r._id)}
                            className="p-2 rounded-lg bg-netflix-red/10 hover:bg-netflix-red/20 text-netflix-red transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center card-glass">
               <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-white text-xl font-bold">No reviews yet</h3>
               <p className="text-zinc-500 mt-2">Share your thoughts on movies to see them here.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;

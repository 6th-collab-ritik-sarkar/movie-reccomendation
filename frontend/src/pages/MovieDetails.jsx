import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, Calendar, Heart, Share2, ArrowLeft, 
  PlayCircle, ThumbsUp, Globe, Plus, Check, X 
} from 'lucide-react';
import { getMovieDetails, getTrending, getMovieTrailer } from '../services/movieService';
import { addFavorite, removeFavorite, getFavorites, addToHistory } from '../services/userService';
import { getMovieReviews, addReview, deleteReview } from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 10, comment: '' });
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerId, setTrailerId] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  const handleWatchTrailer = async () => {
    if (trailerId) {
      setShowTrailerModal(true);
      return;
    }
    
    setTrailerLoading(true);
    try {
      const data = await getMovieTrailer(movie.Title);
      if (data && data.success && data.data && data.data.videoId) {
        setTrailerId(data.data.videoId);
        setShowTrailerModal(true);
        
        // Track watch history when trailer starts playing
        if (isAuthenticated) {
          await addToHistory({
            movieId: movie.imdbID,
            title: movie.Title,
            poster_path: movie.Poster,
            vote_average: movie.imdbRating,
            release_date: movie.Year
          });
        }
      } else {
        alert('Trailer not found');
      }
    } catch (err) {
      console.error(err);
      alert('Could not fetch trailer');
    } finally {
      setTrailerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await getMovieReviews(id);
      setReviews(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMovieDetails(id);
      const movieData = data.data;
      setMovie(movieData);
      
      if (isAuthenticated) {
        // Check if fav
        const favData = await getFavorites();
        setIsFav(favData.data.some(f => f.movieId === id));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) return navigate('/login');
    setFavLoading(true);
    try {
      const movieId = movie.imdbID;
      if (isFav) {
        await removeFavorite(movieId);
        setIsFav(false);
      } else {
        await addFavorite({
          movieId: movieId,
          title: movie.Title,
          poster_path: movie.Poster,
          vote_average: movie.imdbRating,
          release_date: movie.Year
        });
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!newReview.comment.trim()) return;
    
    setReviewLoading(true);
    try {
      await addReview({
        movieId: id,
        movieTitle: movie.Title,
        moviePoster: movie.Poster,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 10, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
      <Loader size="xl" text="Getting movie details..." />
    </div>
  );

  if (!movie || movie.Response === 'False') return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
      <div className="text-center">
        <h2 className="text-2xl text-white mb-4">Movie not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    </div>
  );

  const title = movie.Title;
  const year = movie.Year;
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750/181818/666?text=No+Image';
  const rating = movie.imdbRating;
  const runtime = movie.Runtime;
  const plot = movie.Plot;

  return (
    <div className="pb-20 animate-fade-in">
      {/* Backdrop Section */}
      <div className="relative h-[60vh] sm:h-[80vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-netflix-dark/60 via-transparent to-transparent" />
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 sm:left-12 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-netflix-red transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-12 -mt-32 sm:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 sm:w-64 flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={poster}
              alt={title}
              className="w-full rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left pt-4 md:pt-16">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <span className="badge bg-netflix-red/20 text-netflix-red border border-netflix-red/30 px-3 py-1 font-bold">
                {movie.Rated || 'N/A'}
              </span>
              <span className="text-zinc-400 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold">{rating}</span>
                ({movie.imdbVotes})
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-300">{year}</span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-300">{runtime}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 drop-shadow-md">
              {title}
            </h1>
            
            <p className="text-zinc-400 text-lg italic mb-6">{movie.Awards}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
              <button 
                onClick={handleWatchTrailer}
                disabled={trailerLoading}
                className="btn-primary flex items-center gap-2 px-8 py-3.5 text-lg disabled:opacity-50"
              >
                <PlayCircle className="w-6 h-6" /> {trailerLoading ? 'Searching...' : 'Watch Trailer'}
              </button>
              <button 
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`btn-secondary flex items-center gap-2 px-8 py-3.5 text-lg border ${isFav ? 'border-netflix-red text-netflix-red' : 'border-zinc-700'}`}
              >
                {isFav ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                {isFav ? 'Added to List' : 'My List'}
              </button>
              <button className="p-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-700">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-2">Overview</h3>
                <p className="text-zinc-200 text-lg leading-relaxed">{plot}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1">Genres</h3>
                  <p className="text-white">{movie.Genre}</p>
                </div>
                <div>
                  <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1">Director</h3>
                  <p className="text-white">{movie.Director}</p>
                </div>
                <div>
                  <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1">Actors</h3>
                  <p className="text-white">{movie.Actors}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1">Writer</h3>
                <p className="text-white">{movie.Writer}</p>
              </div>
              <div>
                <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-1">Language</h3>
                <p className="text-white">{movie.Language}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-20 pt-12 border-t border-zinc-800">
          <h2 className="text-3xl font-bold text-white mb-8">User Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="card-glass p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
                {isAuthenticated ? (
                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div>
                      <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Rating</label>
                      <select 
                        value={newReview.rating}
                        onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-netflix-red"
                      >
                        {[10,9,8,7,6,5,4,3,2,1].map(num => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Comment</label>
                      <textarea 
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="What did you think of the movie?"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white h-32 focus:outline-none focus:border-netflix-red resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={reviewLoading}
                      className="btn-primary w-full py-3 font-bold"
                    >
                      {reviewLoading ? 'Posting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-zinc-400 mb-4">Log in to share your thoughts!</p>
                    <button onClick={() => navigate('/login')} className="btn-primary w-full">Log In</button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review._id} className="p-6 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:border-zinc-500 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-netflix-red rounded-full flex items-center justify-center text-white font-bold">
                          {review.userName?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{review.userName}</h4>
                          <p className="text-zinc-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 card-glass">
                  <p className="text-zinc-500 italic">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && trailerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="text-white font-bold text-lg">{movie.Title} - Official Trailer</h3>
              <button 
                onClick={() => setShowTrailerModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                title={`${movie.Title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;

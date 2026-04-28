import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus } from 'lucide-react';
import { addFavorite, removeFavorite } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const PLACEHOLDER = 'https://via.placeholder.com/200x300/181818/666?text=No+Image';

const MovieCard = ({ movie, isFav = false, onFavChange }) => {
  const [fav, setFav] = useState(isFav);
  const [favLoading, setFavLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { isAuthenticated } = useAuth();

  // OMDb uses Title, Year, Poster, imdbID, imdbRating, Plot
  const title = movie.Title || movie.title;
  const year = movie.Year || movie.release_date?.split('-')[0] || '';
  const id = movie.imdbID || movie.id;
  const poster = (movie.Poster && movie.Poster !== 'N/A' && !imgError) 
    ? movie.Poster 
    : PLACEHOLDER;
  const rating = movie.imdbRating || (movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A');
  const overview = movie.Plot || movie.overview;

  const toggleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || favLoading) return;
    setFavLoading(true);
    try {
      if (fav) {
        await removeFavorite(id);
        setFav(false);
      } else {
        await addFavorite({
          movieId: id,
          title: title,
          poster_path: poster,
          vote_average: rating,
          release_date: year,
        });
        setFav(true);
      }
      if (onFavChange) onFavChange(id, !fav);
    } catch (err) {
      console.error('Fav error:', err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link
      to={`/movie/${id}`}
      className="group relative block rounded-xl overflow-hidden bg-netflix-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 hover:z-10"
      id={`movie-card-${id}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-semibold">{rating}</span>
        </div>

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            onClick={toggleFav}
            disabled={favLoading}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${fav ? 'fill-netflix-red text-netflix-red' : 'text-white'}`}
            />
          </button>
        )}

        {/* Hover info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-medium line-clamp-2 leading-relaxed">
            {overview || 'No description available.'}
          </p>
        </div>
      </div>

      {/* Title & Year */}
      <div className="p-2.5">
        <h3 className="text-white text-sm font-semibold line-clamp-1 group-hover:text-netflix-red transition-colors">
          {title}
        </h3>
        {year && <p className="text-zinc-500 text-xs mt-0.5">{year}</p>}
      </div>
    </Link>
  );
};

export default MovieCard;

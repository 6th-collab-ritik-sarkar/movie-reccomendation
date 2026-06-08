import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, User, LogOut, Heart, Clock, Home, X, Menu, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SearchBar from './SearchBar';
import { getAvatarUrl } from '../utils/avatar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenu(false);
    setShowSearch(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    ...(isAuthenticated
      ? [
          { to: '/dashboard', label: 'Dashboard', icon: User },
        ]
      : []),
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-netflix-dark/95 backdrop-blur-md shadow-xl shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group" id="navbar-logo">
              <div className="w-8 h-8 bg-netflix-red rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
                Smart<span className="text-netflix-red">Flick</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'text-white bg-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  id="navbar-search-btn"
                >
                  <Search className="w-5 h-5" />
                </button>
              ) : null}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    id="navbar-dashboard-link"
                  >
                    {user?.avatar ? (
                      <img 
                        src={getAvatarUrl(user.avatar)} 
                        alt={user.name} 
                        className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                      />
                    ) : (
                      <span className="w-7 h-7 bg-netflix-red rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                    <span className="hidden lg:block">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-netflix-red hover:bg-white/5 transition-colors"
                    id="navbar-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:block">Logout</span>
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="text-sm text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors" id="navbar-login-link">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm py-2 px-4" id="navbar-signup-link">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar Overlay in Navbar */}
          {showSearch && (
            <div className="pb-4 flex items-center gap-3 animate-fade-in">
              <div className="flex-1">
                <SearchBar autoFocus onClose={() => setShowSearch(false)} />
              </div>
              <button
                onClick={() => setShowSearch(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="sm:hidden bg-netflix-dark border-t border-zinc-800 px-4 py-4 animate-slide-up">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 py-3 text-zinc-300 hover:text-white border-b border-zinc-800/50 last:border-0"
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 text-zinc-300 hover:text-netflix-red w-full mt-1"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                <Link to="/login" className="btn-secondary text-center py-2.5">Login</Link>
                <Link to="/signup" className="btn-primary text-center py-2.5">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

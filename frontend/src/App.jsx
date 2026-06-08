import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLoader } from './components/Loader';
import { getMe } from './services/authService';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

// GuestRoute blocks authenticated users from accessing /login or /signup
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  const { token, setAuth, logout } = useAuth();
  const [authChecked, setAuthChecked] = useState(!token);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const data = await getMe();
        setAuth({ user: data.user, token });
      } catch {
        logout();
      } finally {
        setAuthChecked(true);
      }
    };

    bootstrapAuth();
  }, [token, setAuth, logout]);

  if (!authChecked) {
    return <PageLoader text="Restoring your session..." />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-netflix-dark text-white selection:bg-netflix-red selection:text-white">
        <Navbar />
        <main>
          <Routes>
            {/* Protected Core Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/movie/:id" 
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <GuestRoute>
                  <Signup />
                </GuestRoute>
              } 
            />

            {/* Public About Page Route */}
            <Route path="/about" element={<About />} />
            
            {/* Protected Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <footer className="py-10 text-center border-t border-zinc-800 text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} SmartFlick AI. RITIK SINGH</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

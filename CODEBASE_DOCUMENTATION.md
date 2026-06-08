# Smart AI Movie Recommendation Web App - Codebase Documentation

## Project Overview

A full-stack Netflix-style movie recommendation application using React (Vite), Node.js/Express, MongoDB, and AI-powered mood-based recommendations.

**Author**: Ritik Singh  
**Tech Stack**: React, Node.js, MongoDB, Groq AI, OMDb API, Tailwind CSS

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Dependencies & Installation](#dependencies--installation)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)
8. [Code Flow Diagram](#code-flow-diagram)
9. [Available Commands](#available-commands)

---

## Project Structure

```
smart-movie-app/
├── backend/                    # Node.js Express API
│   ├── config/               # Database configuration
│   ├── middleware/             # Auth middleware
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   └── Review.js
│   ├── modules/                # Feature modules
│   │   ├── ai/
│   │   ├── auth/               # Auth routes, controller, service
│   │   ├── movie/              # Movie routes, controller
│   │   ├── review/             # Review routes, controller
│   │   └── user/               # User routes, controller
│   ├── services/               # External API services
│   │   ├── groq.service.js     # Groq AI integration
│   │   ├── omdb.service.js     # OMDb API integration
│   │   └── tmdb.service.js     # TMDB API integration (optional)
│   ├── utils/                  # Utility functions
│   │   └── promptTemplate.js   # AI prompt generator
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   └── package.json
│
├── frontend/                   # React Vite Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Loader.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useAuth.js
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/           # API service functions
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── movieService.js
│   │   │   ├── reviewService.js
│   │   │   └── userService.js
│   │   ├── store/              # State management
│   │   │   └── authStore.js    # Custom auth store
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global styles
│   │   └── style.css           # Component styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── README.md
└── CODEBASE_DOCUMENTATION.md
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   React 19  │  │ React Router│  │     Axios (API)         │ │
│  │  Components │  │   (Routing) │  │   (HTTP Client)         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                            │                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Custom Auth Store                        ││
│  │         (localStorage + Custom Event Emitter)               ││
│  └─────────────────────────────────────────────────────────────┘│
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Express Server (Port 5000)                 ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │  Middleware: helmet, cors, express.json, rateLimit      │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                            │                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐│
│  │  /api/auth  │  │ /api/movies │  │    /api/user /reviews       ││
│  │  (Auth)     │  │  (Movies)   │  │    (User features)          ││
│  └─────────────┘  └─────────────┘  └─────────────────────────────┘│
│         │                │                                       │
│  ┌──────────────┐ ┌──────────────────────────────────────────┐  │
│  │ JWT Service  │ │           External APIs                   │  │
│  │   (Auth)     │ │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │  │
│  └──────────────┘ │  │  Groq   │  │  OMDb   │  │  TMDB   │  │  │
│                   │  │   AI    │  │  API    │  │  API    │  │  │
│  ┌──────────────┐ │  └─────────┘  └─────────┘  └─────────┘  │  │
│  │   MongoDB    │ │     ↓              ↓           ↓         │  │
│  │  (Database)  │ │  AI Recommend  Movie Data   Trending      │  │
│  └──────────────┘ └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Documentation

### Entry Points

**File**: `backend/server.js`
- Loads environment variables via `dotenv`
- Connects to MongoDB via `connectDB()`
- Starts Express server on port 5000
- Entry point: `node server.js`

**File**: `backend/app.js`
- Configures Express application
- Sets up security middleware (helmet, cors, rate limiting)
- Mounts route handlers
- Configures global error handling

### Module Structure

Each module follows a consistent pattern:
```
module/
├── [module].routes.js      # Route definitions
├── [module].controller.js  # Request handlers
└── [module].service.js     # Business logic (if needed)
```

### Authentication Flow

1. **Signup** (`POST /api/auth/signup`)
   - Validates input (name, email, password)
   - Creates new User in MongoDB
   - Returns JWT token

2. **Login** (`POST /api/auth/login`)
   - Validates credentials
   - Compares password with bcrypt
   - Returns JWT token + user data

3. **Protected Routes**
   - JWT token extracted from `Authorization: Bearer <token>` header
   - Token verified against `JWT_SECRET`
   - User attached to `req.user`

### Database Models

**User Model** (`backend/models/User.js`)
```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed with bcrypt),
  favorites: [{ movieId, title, poster_path, vote_average, release_date, addedAt }],
  watchHistory: [{ movieId, title, poster_path, vote_average, release_date, watchedAt }]
}
```

**Review Model** (`backend/models/Review.js`)
```javascript
{
  user: ObjectId (ref: User),
  userName: String,
  movieId: String,
  movieTitle: String,
  moviePoster: String,
  rating: Number (1-10),
  comment: String
}
```

### Services

**OMDb Service** (`backend/services/omdb.service.js`)
- `getMovieByTitle(title)` - Fetch movie by title
- `getMovieById(id)` - Fetch movie by IMDB ID
- `searchMovies(query, page)` - Search movies

**Groq AI Service** (`backend/services/groq.service.js`)
- `getMovieRecommendations(prompt)` - AI-powered movie suggestions
- Model: `llama-3.3-70b-versatile`
- Returns JSON array of movie titles

**TMDB Service** (`backend/services/tmdb.service.js`)
- Optional alternative to OMDb
- Supports v3 (API key) and v4 (JWT) authentication
- Includes caching for trending movies (10 min TTL)

### Movie Recommendation Flow

```
1. User submits mood text
   ↓
2. POST /api/movies/recommend
   ↓
3. Controller calls groq.getMovieRecommendations(prompt)
   ↓
4. Groq AI returns JSON array of movie titles
   ↓
5. For each title, call omdb.getMovieByTitle()
   ↓
6. Filter out null results (movies not found)
   ↓
7. Return enriched movie data to frontend
```

---

## Frontend Documentation

### Entry Points

**File**: `frontend/index.html`
- Root HTML file
- Mounts React app at `<div id="root">`

**File**: `frontend/src/main.jsx`
- React entry point
- Creates root and renders `<App />`
- Enables React StrictMode

**File**: `frontend/src/App.jsx`
- Main application component
- Configures React Router
- Handles auth bootstrap (token validation)
- Routes:
  - `/` - Home
  - `/search` - Search
  - `/movie/:id` - Movie Details
  - `/login` - Login
  - `/signup` - Signup
  - `/dashboard` - Dashboard (Protected)

### State Management

**Auth Store** (`frontend/src/store/authStore.js`)
- Custom lightweight store (no Redux)
- Uses localStorage for persistence
- Custom event emitter pattern for reactivity
- Methods:
  - `setAuth({ user, token })` - Login/signup
  - `clearAuth()` - Logout
  - `getToken()` - Get current token
  - `isAuthenticated()` - Check auth status

**useAuth Hook** (`frontend/src/hooks/useAuth.js`)
- React hook for consuming auth state
- Auto-subscribes to store changes
- Returns: `{ user, token, isAuthenticated, setAuth, logout }`

### API Integration

**API Client** (`frontend/src/services/api.js`)
- Axios instance with base URL
- Request interceptor: Attaches JWT token
- Response interceptor: Handles 401 errors, redirects to login

**Service Functions**
| Service | Functions |
|---------|-----------|
| `authService.js` | `signup()`, `login()`, `getMe()` |
| `movieService.js` | `getTrending()`, `searchMovies()`, `getMovieDetails()`, `getMoodRecommendations()` |
| `userService.js` | `getFavorites()`, `addFavorite()`, `removeFavorite()`, `getHistory()`, `addToHistory()` |
| `reviewService.js` | `getReviews()`, `addReview()` |

### Components

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top navigation with auth state |
| `MovieCard.jsx` | Movie poster card with hover effects |
| `SearchBar.jsx` | Autocomplete search input |
| `Loader.jsx` | Loading spinner with variants |
| `ProtectedRoute.jsx` | Route guard for authenticated pages |

### Pages

| Page | Features |
|------|----------|
| `Home.jsx` | Hero section, Mood AI input, Trending movies |
| `Search.jsx` | Movie search with results grid |
| `MovieDetails.jsx` | Movie info, reviews, add to favorites |
| `Dashboard.jsx` | User favorites, watch history, reviews |
| `Login.jsx` / `Signup.jsx` | Auth forms |

---

## Dependencies & Installation

### Backend Dependencies

**Production Dependencies** (`backend/package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^9.5.0 | MongoDB ODM |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| axios | ^1.15.2 | HTTP client |
| cors | ^2.8.6 | Cross-origin requests |
| dotenv | ^17.4.2 | Environment variables |
| helmet | ^8.1.0 | Security headers |
| express-rate-limit | ^8.4.1 | Rate limiting |
| morgan | ^1.10.1 | Request logging |
| groq-sdk | ^1.1.2 | Groq AI API |

**Dev Dependencies**
| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.1.14 | Auto-restart dev server |

### Frontend Dependencies

**Production Dependencies** (`frontend/package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.5 | UI library |
| react-dom | ^19.2.5 | React DOM |
| react-router-dom | ^7.14.2 | Routing |
| axios | ^1.15.2 | HTTP client |
| lucide-react | ^1.11.0 | Icons |

**Dev Dependencies**
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^8.0.10 | Build tool |
| @vitejs/plugin-react | ^6.0.1 | React plugin |
| typescript | ~6.0.2 | Type checking |
| tailwindcss | ^4.2.4 | CSS framework |
| @tailwindcss/vite | ^4.2.4 | Tailwind Vite plugin |
| @tailwindcss/postcss | ^4.2.4 | Tailwind PostCSS |
| autoprefixer | ^10.5.0 | CSS autoprefixer |
| postcss | ^8.5.12 | CSS processor |

### Installation Steps

```bash
# Backend setup
cd backend
npm install

# Create .env file with required variables
# (see Environment Variables section)

# Frontend setup
cd frontend
npm install
```

---

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smartmovie

# Authentication
JWT_SECRET=your_jwt_secret_here

# External APIs
OMDB_API_KEY=your_omdb_api_key
GROQ_API_KEY=your_groq_api_key

# Optional (TMDB - not currently used)
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3

# Frontend URL (for CORS in production)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Movies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/movies/recommend` | AI mood recommendations | No |
| GET | `/api/movies/trending` | Get trending movies | No |
| GET | `/api/movies/search` | Search movies | No |
| GET | `/api/movies/:id` | Get movie details | No |

### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/favorites` | Get user's favorites | Yes |
| POST | `/api/user/favorites` | Add to favorites | Yes |
| DELETE | `/api/user/favorites/:movieId` | Remove from favorites | Yes |
| GET | `/api/user/history` | Get watch history | Yes |
| POST | `/api/user/history` | Add to history | Yes |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/:movieId` | Get movie reviews | No |
| POST | `/api/reviews` | Add review | Yes |

---

## Code Flow Diagram

### User Authentication Flow

```
┌──────────┐    ┌──────────────┐    ┌───────────────┐    ┌─────────────┐
│  User    │───▶│  Login Page  │───▶│  authService  │───▶│  POST /api  │
│          │    │   (Login.jsx)│    │  .login()     │    │  /auth/login│
└──────────┘    └──────────────┘    └───────────────┘    └──────┬──────┘
                                                                  │
┌──────────┐    ┌──────────────┐    ┌───────────────┐             │
│Dashboard │◀───│   Protected  │◀───│  authStore    │◀────────────┘
│  Route   │    │    Route     │    │  .setAuth()   │   JWT Token
│          │    │(ProtectedRoute│   │               │
└──────────┘    └──────────────┘    └───────────────┘
```

### Movie Recommendation Flow

```
┌──────────┐    ┌──────────────┐    ┌───────────────┐    ┌─────────────┐
│  User    │───▶│  Mood Input  │───▶│ movieService  │───▶│  POST /api  │
│          │    │  (Home.jsx)  │    │.getMoodRecomm  │    │/movies/rec  │
└──────────┘    └──────────────┘    └───────────────┘    └──────┬──────┘
                                                                  │
                         ┌────────────────────────────────────────┘
                         │
┌──────────┐    ┌────────▼───────┐    ┌───────────────┐    ┌─────────────┐
│ Results  │◀───│  MovieCard     │◀───│    OMDb       │◀───│  Groq AI    │
│  Grid    │    │  Component     │    │    Service    │    │   Service   │
│          │    │                │    │(Fetch details)│    │(Get titles) │
└──────────┘    └────────────────┘    └───────────────┘    └─────────────┘
```

### Data Fetching Flow (Trending)

```
Home.jsx (useEffect)
    │
    ▼
getTrending() in movieService.js
    │
    ▼
api.get('/movies/trending')
    │
    ▼
Backend: movie.controller.js getTrending()
    │
    ▼
omdb.getMovieByTitle() for each popular title
    │
    ▼
OMDb API Response
    │
    ▼
Filtered results returned
    │
    ▼
React State: setTrending(data)
    │
    ▼
MovieCard components rendered
```

---

## Available Commands

### Backend Commands

```bash
# Development (with auto-restart)
cd backend
npm run dev

# Production
npm start

# Testing
npm test  # Currently returns "no tests"
```

### Frontend Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Full Development Workflow

```bash
# Terminal 1 - Start Backend
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Start Frontend
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Key Implementation Details

### Security Features
- **Helmet**: Sets security headers
- **CORS**: Restricts cross-origin requests in production
- **Rate Limiting**: 200 req/15min (1000 in dev)
- **JWT**: Stateless authentication
- **Bcrypt**: Password hashing with salt rounds 12

### AI Integration
- Uses Groq's `llama-3.3-70b-versatile` model
- Prompt template generates structured JSON output
- Falls back gracefully if movies not found in OMDb

### Caching Strategy
- TMDB service caches trending movies for 10 minutes
- Reduces API calls and improves performance

### Error Handling
- Global error handler in Express
- 401 interceptor in Axios redirects to login
- Retry logic for startup race conditions

### Responsive Design
- Tailwind CSS for styling
- Mobile-first approach
- Netflix-inspired dark theme
- Custom color palette (netflix-red, netflix-dark, etc.)

---

## File References

### Critical Backend Files
- `backend/server.js` - Entry point
- `backend/app.js` - Express configuration
- `backend/config/db.js` - MongoDB connection
- `backend/middleware/auth.middleware.js` - JWT verification
- `backend/models/User.js` - User schema

### Critical Frontend Files
- `frontend/src/main.jsx` - React entry
- `frontend/src/App.jsx` - Route configuration
- `frontend/src/services/api.js` - HTTP client
- `frontend/src/store/authStore.js` - Auth state
- `frontend/src/hooks/useAuth.js` - Auth hook

---

*Documentation generated for Smart AI Movie Recommendation Web App*

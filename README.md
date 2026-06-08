# Smart AI Movie Recommendation Web App

A full-stack Netflix-style movie recommendation application built with React, Node.js, Express, MongoDB, and AI-powered mood-based movie suggestions.

## Project Overview

This project provides:
- User authentication with JWT-based signup/login
- AI-driven mood recommendations using Gemini/Groq-style prompts
- Movie search, favorites, watch history, and reviews
- A modern React frontend with Tailwind CSS
- A REST API backend with Express and MongoDB

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- Lucide Icons

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- bcryptjs password hashing
- dotenv configuration
- cors, helmet, express-rate-limit
- multer file upload handling
- groq-sdk and external movie APIs

## Project Structure

```
smart-movie-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── Review.js
│   │   └── User.js
│   ├── modules/
│   │   ├── ai/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.service.js
│   │   ├── movie/
│   │   │   ├── movie.controller.js
│   │   │   └── movie.routes.js
│   │   ├── review/
│   │   │   ├── review.controller.js
│   │   │   └── review.routes.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       └── user.routes.js
│   ├── services/
│   │   ├── groq.service.js
│   │   ├── omdb.service.js
│   │   └── tmdb.service.js
│   ├── utils/
│   │   └── promptTemplate.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Loader.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── movieService.js
│   │   │   ├── reviewService.js
│   │   │   └── userService.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── utils/
│   │   │   ├── avatar.js
│   │   │   └── debounce.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.js
```

## Dependencies

### Backend Dependencies
- axios ^1.15.2
- bcryptjs ^3.0.3
- cors ^2.8.6
- dotenv ^17.4.2
- express ^5.2.1
- express-rate-limit ^8.4.1
- groq-sdk ^1.1.2
- helmet ^8.1.0
- jsonwebtoken ^9.0.3
- mongoose ^9.5.0
- morgan ^1.10.1
- multer ^2.1.1
- yt-search ^2.13.1

### Backend Dev Dependencies
- nodemon ^3.1.14

### Frontend Dependencies
- axios ^1.15.2
- lucide-react ^1.11.0
- react ^19.2.5
- react-dom ^19.2.5
- react-router-dom ^7.14.2

### Frontend Dev Dependencies
- @tailwindcss/postcss ^4.2.4
- @tailwindcss/vite ^4.2.4
- @vitejs/plugin-react ^6.0.1
- autoprefixer ^10.5.0
- postcss ^8.5.12
- tailwindcss ^4.2.4
- typescript ~6.0.2
- vite ^8.0.10

## Setup Instructions

### Backend
1. Open a terminal in `backend`
2. Run `npm install`
3. Create a `.env` file with:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OMDB_API_KEY`
   - `GEMINI_API_KEY`
4. Start the backend with `npm run dev`

### Frontend
1. Open a terminal in `frontend`
2. Run `npm install`
3. Start the app with `npm run dev`

## Environment Variables

Expected backend environment variables:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `OMDB_API_KEY` — OMDb API key
- `GEMINI_API_KEY` — Gemini or AI API key for mood recommendations

## API Overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Movies
- `GET /api/movie` (search / browse)
- `GET /api/movie/:id` (movie details)
- AI mood recommendation endpoints likely exist in the `ai` module

### Reviews / User
- `POST /api/review`
- `GET /api/review`
- `GET /api/user` / user profile routes

## Notes

- The backend uses MongoDB models for `User` and `Review`.
- The frontend provides authenticated pages including dashboard, movie details, search, and signup/login.
- AI and external movie integrations are handled via `groq.service.js`, `omdb.service.js`, and `tmdb.service.js`.

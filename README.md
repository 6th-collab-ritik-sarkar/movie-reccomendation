# Smart AI Movie Recommendation Web App

A full-stack Netflix-style movie recommendation app using React, Node.js, and MongoDB, integrated with OMDb for movie data and Gemini AI for mood-based recommendations.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide Icons
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt
- **AI**: Google Gemini API
- **Data**: OMDb API

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 2. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file (template provided) and add your keys:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Any random secret string
   - `OMDB_API_KEY`: Get from [omdbapi.com](https://www.omdbapi.com/apikey.aspx)
   - `GEMINI_API_KEY`: Get from [aistudio.google.com](https://aistudio.google.com/app/apikey)
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Features
- **Auth**: Secure signup/login with JWT.
- **Mood AI**: Enter how you feel (e.g., "I want something mind-bending but not too scary") and get AI-powered recommendations.
- **Search**: Fuzzy search for movies with autocomplete.
- **Favorites**: Save movies to your personalized list.
- **History**: Track movies you've viewed.
- **Netflix UI**: Premium dark theme with smooth transitions.

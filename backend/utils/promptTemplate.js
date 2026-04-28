const generatePrompt = (mood) => {
  return `Suggest 5 movies based on this mood: ${mood}. 
  Return a JSON object with a key "movies" containing an array of movie titles. 
  No explanation or extra text. 
  Example output: { "movies": ["Inception", "The Dark Knight", "Interstellar"] }`;
};

module.exports = {
  generatePrompt,
};

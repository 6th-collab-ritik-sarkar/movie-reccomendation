const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getMovieRecommendations = async (prompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    let text = chatCompletion.choices[0].message.content.trim();
    
    try {
      const parsed = JSON.parse(text);
      // The prompt might return { "movies": [...] } or just [...]
      // Let's adjust promptTemplate or handle both.
      if (Array.isArray(parsed)) return parsed;
      if (parsed.movies && Array.isArray(parsed.movies)) return parsed.movies;
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) return parsed.recommendations;
      
      return [];
    } catch (parseError) {
      console.error('Failed to parse Groq response as JSON:', text);
      return [];
    }
  } catch (error) {
    console.error('Error calling Groq API:', error.message);
    throw new Error('AI failed, try again');
  }
};

module.exports = {
  getMovieRecommendations,
};

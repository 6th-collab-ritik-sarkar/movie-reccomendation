require('dotenv').config();
const groqService = require('./services/groq.service');
const { generatePrompt } = require('./utils/promptTemplate');

async function testGroq() {
  try {
    console.log('Testing Groq Recommendations...');
    const mood = 'happy and uplifting';
    const prompt = generatePrompt(mood);
    console.log('Prompt:', prompt);
    
    const recommendations = await groqService.getMovieRecommendations(prompt);
    console.log('Recommendations:', recommendations);
    
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      console.log('SUCCESS: Received recommendations from Groq');
    } else {
      console.log('FAILURE: Received empty or invalid recommendations');
    }
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

testGroq();

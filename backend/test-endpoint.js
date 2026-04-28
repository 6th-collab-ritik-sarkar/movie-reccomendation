
const axios = require('axios');

async function testRecommendation() {
  try {
    const response = await axios.post('http://localhost:5000/api/movies/recommend', {
      mood: 'scary and atmospheric'
    });
    console.log('Recommendation Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing recommendation:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testRecommendation();

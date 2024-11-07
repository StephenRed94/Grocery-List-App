const axios = require('axios'); // Promise-based HTTP client for making requests to external APIs (USDA API)
require('dotenv').config(); // Loads enivronment variables from .env file (USDA API key)

const app = express();



// Route to handle search queries from frontend
module.exports = async (req, res) => {e
  const query = req.query.query;  // Get the search query from the frontend

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Make the request to USDA API
    const response = await axios.get(USDA_API_URL, {
      params: {
        api_key: process.env.USDA_API_KEY,  // Use the secure API key from .env
        query: query
      }
    });

    // Send the results from USDA API back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from USDA API:', error);
    res.status(500).json({ error: 'Failed to fetch data from USDA API' });
  }
};
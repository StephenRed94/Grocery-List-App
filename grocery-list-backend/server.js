const axios = require('axios');  // Axios is used to make HTTP requests to external APIs (USDA API)
require('dotenv').config();  // This loads environment variables from the .env file (USDA API key)

const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';  // Define the API URL

module.exports = async (req, res) => {
  const query = req.query.query;  // Get the search query from the frontend

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Make the request to USDA API
    const response = await axios.get(USDA_API_URL, {
      params: {
        api_key: process.env.USDA_API_KEY,  // Use the secure API key from the .env file
        query: query
      }
    });

    // Send the results from the USDA API back to the frontend
    res.status(200).json(response.data);  // Return the data as JSON
  } catch (error) {
    console.error('Error fetching data from USDA API:', error);
    res.status(500).json({ error: 'Failed to fetch data from USDA API' });
  }
};
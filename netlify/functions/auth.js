const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    
    console.log('Attempting authentication for:', username);
    
    const response = await axios.post('https://api.pdga.com/services/json/user/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('PDGA API response:', response.data);
    
    // Check if we have the expected response structure
    if (response.data && (response.data.token || response.data.sessid)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.data)
      };
    } else {
      console.error('Unexpected response structure:', response.data);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Authentication failed - unexpected response format'
        })
      };
    }
  } catch (error) {
    console.error('Authentication error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        message: error.response?.data?.message || error.response?.data || 'Authentication failed'
      })
    };
  }
}; 
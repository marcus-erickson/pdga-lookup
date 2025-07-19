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
    const { pdga_number, sessid, session_name } = JSON.parse(event.body);
    
    if (!sessid || !session_name) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Missing authentication/session info' })
      };
    }

    console.log(`Searching for player: ${pdga_number}`);
    
    const response = await axios.get('https://api.pdga.com/services/json/players', {
      params: { pdga_number },
      headers: {
        'Cookie': `${session_name}=${sessid}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Player search response:', response.data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Player search error:', error.response?.data || error.message);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        message: error.response?.data?.message || 'Player search failed'
      })
    };
  }
}; 
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for React app
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Serve static files from React build (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Proxy endpoint for PDGA authentication
app.post('/api/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    
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
      res.json(response.data);
    } else {
      console.error('Unexpected response structure:', response.data);
      res.status(400).json({
        message: 'Authentication failed - unexpected response format'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.response?.data || 'Authentication failed'
    });
  }
});

// Proxy endpoint for player search
app.post('/api/player-search', async (req, res) => {
  try {
    const { pdga_number, sessid, session_name } = req.body;
    if (!sessid || !session_name) {
      return res.status(401).json({ message: 'Missing authentication/session info' });
    }
    const response = await axios.get('https://api.pdga.com/services/json/players', {
      params: { pdga_number },
      headers: {
        'Cookie': `${session_name}=${sessid}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Player search error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Player search failed'
    });
  }
});

// Proxy endpoint for player statistics
app.get('/api/player-statistics', async (req, res) => {
  try {
    const { pdga_number, year, sessid, session_name } = req.query;
    if (!sessid || !session_name) {
      return res.status(401).json({ message: 'Missing authentication/session info' });
    }
    
    console.log(`Fetching statistics for PDGA ${pdga_number} for year ${year}`);
    console.log(`Session info - name: ${session_name}, sessid: ${sessid}`);
    console.log(`Request URL: https://api.pdga.com/services/json/player-statistics?pdga_number=${pdga_number}&year=${year}`);
    
    const response = await axios.get('https://api.pdga.com/services/json/player-statistics', {
      params: { 
        pdga_number,
        year 
      },
      headers: {
        'Cookie': `${session_name}=${sessid}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Statistics response for ${year}:`, response.data);
    console.log(`Response status:`, response.status);
    console.log(`Response headers:`, response.headers);
    
    // Check if the response contains the specific player we're looking for
    if (response.data && response.data.players && Array.isArray(response.data.players)) {
      const targetPlayer = response.data.players.find(player => 
        player.pdga_number === pdga_number.toString()
      );
      if (targetPlayer) {
        console.log(`Found target player ${pdga_number} in response:`, targetPlayer);
      } else {
        console.log(`Player ${pdga_number} not found in rankings response`);
      }
    }
    
    res.json(response.data);
  } catch (error) {
    console.error(`Statistics error for year ${req.query.year}:`, error.response?.data || error.message);
    console.error(`Error status:`, error.response?.status);
    console.error(`Error headers:`, error.response?.headers);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Statistics fetch failed'
    });
  }
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
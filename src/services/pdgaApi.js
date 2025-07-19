import axios from 'axios';

// Use Netlify Functions in production, local backend in development
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE = isDevelopment 
  ? 'http://localhost:3001/api' 
  : '/.netlify/functions';

// Create axios instance with base configuration
const pdgaApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication function
export const authenticate = async (username, password) => {
  try {
    const endpoint = isDevelopment ? '/auth' : '/auth';
    const response = await pdgaApi.post(endpoint, {
      username,
      password,
    });
    
    if (response.data) {
      // Handle different possible response structures
      const token = response.data.token || response.data.sessid;
      if (token) {
        // Set the token in axios headers for future requests
        pdgaApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return response.data;
      } else {
        console.error('No token found in response:', response.data);
        throw new Error('Authentication failed - no token received');
      }
    } else {
      throw new Error('Authentication failed - no response data');
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(`Authentication failed: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      throw new Error(error.message || 'Authentication failed');
    }
  }
};

// Player search function
export const searchPlayer = async (pdgaNumber) => {
  try {
    // Retrieve session info from localStorage
    const sessid = localStorage.getItem('pdga_sessid');
    const session_name = localStorage.getItem('pdga_session_name');
    const endpoint = isDevelopment ? '/player-search' : '/player-search';
    
    const response = await pdgaApi.post(endpoint, {
      pdga_number: pdgaNumber,
      sessid,
      session_name,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        throw new Error('Authentication expired - please login again');
      }
      throw new Error(`Player search failed: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      throw new Error(error.message || 'Player search failed');
    }
  }
};

// Player statistics function
export const getPlayerStatistics = async (pdgaNumber) => {
  try {
    // Retrieve session info from localStorage
    const sessid = localStorage.getItem('pdga_sessid');
    const session_name = localStorage.getItem('pdga_session_name');
    
    console.log('Frontend - Session info:', { sessid, session_name });
    console.log('Frontend - PDGA Number:', pdgaNumber);
    
    // Get current year and previous two years
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    
    console.log('Frontend - Fetching stats for years:', years);
    
    // Fetch statistics for all three years
    const statsPromises = years.map(year => {
      console.log(`Frontend - Making request for year ${year}`);
      const endpoint = isDevelopment ? '/player-statistics' : '/player-statistics';
      return pdgaApi.get(endpoint, {
        params: {
          pdga_number: pdgaNumber,
          year: year,
          sessid,
          session_name,
        }
      });
    });
    
    const responses = await Promise.all(statsPromises);
    
    console.log('Frontend - All responses received:', responses);
    
    // Combine all statistics with year information
    const allStats = responses.map((response, index) => ({
      year: years[index],
      data: response.data
    }));
    
    console.log('Frontend - Combined stats:', allStats);
    return allStats;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        throw new Error('Authentication expired - please login again');
      }
      throw new Error(`Statistics fetch failed: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      throw new Error(error.message || 'Statistics fetch failed');
    }
  }
};

// Set token for authenticated requests
export const setAuthToken = (token) => {
  if (token) {
    pdgaApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete pdgaApi.defaults.headers.common['Authorization'];
  }
};

export default pdgaApi; 
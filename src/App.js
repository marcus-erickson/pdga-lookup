import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import PlayerSearch from './components/PlayerSearch';
import { authenticate, searchPlayer, setAuthToken } from './services/pdgaApi';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthTokenState] = useState(null); // eslint-disable-line no-unused-vars

  // Check for stored token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('pdga_token');
    if (storedToken) {
      setAuthToken(storedToken);
      setAuthTokenState(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const authData = await authenticate(username, password);
      // Store token, sessid, and session_name in localStorage for persistence
      localStorage.setItem('pdga_token', authData.token);
      localStorage.setItem('pdga_sessid', authData.sessid);
      localStorage.setItem('pdga_session_name', authData.session_name);
      setAuthTokenState(authData.token);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear stored token and session info
    localStorage.removeItem('pdga_token');
    localStorage.removeItem('pdga_sessid');
    localStorage.removeItem('pdga_session_name');
    setAuthToken(null);
    setAuthTokenState(null);
    setIsAuthenticated(false);
  };

  const handlePlayerSearch = async (pdgaNumber) => {
    setIsLoading(true);
    try {
      const result = await searchPlayer(pdgaNumber);
      return result;
    } catch (error) {
      // If authentication expired, logout user
      if (error.message.includes('Authentication expired')) {
        handleLogout();
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        ) : (
          <PlayerSearch 
            onSearch={handlePlayerSearch} 
            onLogout={handleLogout} 
            isLoading={isLoading} 
          />
        )}
      </div>
    </div>
  );
}

export default App; 
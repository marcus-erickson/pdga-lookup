import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import PlayerSearch from './components/PlayerSearch';
import { authenticate, searchPlayer, setAuthToken } from './services/pdgaApi';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for stored session on app load
  useEffect(() => {
    const checkStoredSession = async () => {
      const storedToken = localStorage.getItem('pdga_token');
      const storedSessid = localStorage.getItem('pdga_sessid');
      const storedSessionName = localStorage.getItem('pdga_session_name');
      const rememberMe = localStorage.getItem('pdga_remember_me') === 'true';

      if (storedToken && storedSessid && storedSessionName && rememberMe) {
        try {
          // Set the stored token for API calls
          setAuthToken(storedToken);
          
          // Test the session by making a simple API call
          // We'll use a test search to validate the session
          await searchPlayer('1'); // Test with PDGA #1 (should always exist)
          
          // If we get here, the session is still valid
          setIsAuthenticated(true);
        } catch (error) {
          console.log('Stored session is invalid, clearing...');
          // Session is invalid, clear stored data
          handleLogout();
        }
      }
      setIsCheckingSession(false);
    };

    checkStoredSession();
  }, []);

  const handleLogin = async (username, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      const authData = await authenticate(username, password);
      
      // Store session data
      localStorage.setItem('pdga_token', authData.token);
      localStorage.setItem('pdga_sessid', authData.sessid);
      localStorage.setItem('pdga_session_name', authData.session_name);
      localStorage.setItem('pdga_remember_me', rememberMe.toString());
      
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all stored session data
    localStorage.removeItem('pdga_token');
    localStorage.removeItem('pdga_sessid');
    localStorage.removeItem('pdga_session_name');
    localStorage.removeItem('pdga_remember_me');
    
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const handlePlayerSearch = async (pdgaNumber) => {
    setIsLoading(true);
    try {
      const result = await searchPlayer(pdgaNumber);
      return result;
    } catch (error) {
      // If authentication expired, logout user
      if (error.message.includes('Authentication expired') || 
          error.message.includes('Missing authentication') ||
          error.response?.status === 401) {
        handleLogout();
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking session
  if (isCheckingSession) {
    return (
      <div className="App">
        <div className="container">
          <div className="card">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #e8f0e8', 
                borderTop: '4px solid #4a7c59', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p style={{ color: '#666', margin: 0 }}>Checking session...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
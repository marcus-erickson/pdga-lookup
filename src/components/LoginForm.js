import React, { useState, useEffect } from 'react';

const LoginForm = ({ onLogin, isLoading }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Load saved username on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('pdga_last_username');
    const savedRememberMe = localStorage.getItem('pdga_remember_me') === 'true';
    
    if (savedUsername) {
      setCredentials(prev => ({
        ...prev,
        username: savedUsername
      }));
    }
    
    if (savedRememberMe) {
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      // Save username to localStorage before attempting login
      if (credentials.username.trim()) {
        localStorage.setItem('pdga_last_username', credentials.username.trim());
      }
      
      await onLogin(credentials.username, credentials.password, rememberMe);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearSavedUsername = () => {
    localStorage.removeItem('pdga_last_username');
    setCredentials(prev => ({
      ...prev,
      username: ''
    }));
  };

  const hasSavedUsername = localStorage.getItem('pdga_last_username');

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', textAlign: 'center', color: '#333' }}>
        PDGA Player Lookup
      </h2>
      <p style={{ marginBottom: '24px', textAlign: 'center', color: '#666' }}>
        Tournament Director Login
      </p>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">PDGA Username</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your PDGA username"
              disabled={isLoading}
              autoComplete="username"
            />
            {hasSavedUsername && (
              <button
                type="button"
                onClick={handleClearSavedUsername}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#666'}
                onMouseLeave={(e) => e.target.style.color = '#999'}
                title="Clear saved username"
              >
                ×
              </button>
            )}
          </div>
          {hasSavedUsername && (
            <small style={{ color: '#4a7c59', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              ✓ Using saved username
            </small>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe">
            Remember me (stay logged in)
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
        <p>Use your PDGA account credentials to access player information.</p>
        {hasSavedUsername && (
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
            Your username will be remembered for next time
          </p>
        )}
        {rememberMe && (
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#4a7c59' }}>
            ✓ You'll stay logged in until you logout
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm; 
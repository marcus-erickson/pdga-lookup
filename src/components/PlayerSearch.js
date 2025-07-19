import React, { useState } from 'react';

const PlayerSearch = ({ onSearch, onStatistics, onLogout, isLoading }) => {
  const [pdgaNumber, setPdgaNumber] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [statisticsData, setStatisticsData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!pdgaNumber.trim()) {
      setError('Please enter a PDGA number');
      return;
    }

    // Clear previous results and errors
    setPlayerData(null);
    setError('');
    setSuccess('');

    try {
      const result = await onSearch(pdgaNumber.trim());
      console.log('PDGA API Response:', result); // Debug log
      setPlayerData(result);
      setSuccess('Player found successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewSearch = () => {
    setPdgaNumber('');
    setPlayerData(null);
    setStatisticsData(null);
    setError('');
    setSuccess('');
  };

  const handleStatistics = async (e) => {
    e.preventDefault();
    
    if (!pdgaNumber.trim()) {
      setError('Please enter a PDGA number');
      return;
    }

    // Clear previous results and errors
    setStatisticsData(null);
    setError('');
    setSuccess('');

    try {
      const result = await onStatistics(pdgaNumber.trim());
      console.log('PDGA Statistics Response:', result); // Debug log
      setStatisticsData(result);
      setSuccess('Player statistics found successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatPlayerData = (data) => {
    // Handle different possible response structures
    let player = null;
    
    if (data && data.players && Array.isArray(data.players) && data.players.length > 0) {
      player = data.players[0]; // Get the first player from the players array
    } else if (data && data.player) {
      player = data.player;
    } else if (data && Array.isArray(data) && data.length > 0) {
      player = data[0]; // If it's an array, take the first player
    } else if (data && typeof data === 'object') {
      player = data; // If the data itself is the player object
    }
    
    if (!player) {
      console.log('No player data found in response:', data);
      return null;
    }

    // Helper function to format classification
    const formatClassification = (classification) => {
      if (!classification) return 'N/A';
      return classification === 'A' ? 'Amateur' : 'Pro';
    };

    // Helper function to format gender
    const formatGender = (gender) => {
      if (!gender) return 'N/A';
      return gender === 'M' ? 'Male' : 'Female';
    };

    // Create an array of all available player fields
    const fields = [
      { label: 'Name', value: player.first_name && player.last_name ? `${player.first_name} ${player.last_name}` : 'N/A' },
      { label: 'PDGA Number', value: player.pdga_number || 'N/A' },
      { label: 'Membership Status', value: player.membership_status || 'N/A' },
      { label: 'Membership Expires', value: player.membership_expires || 'N/A' },
      { label: 'City', value: player.city || 'N/A' },
      { label: 'State/Province', value: player.state_prov || 'N/A' },
      { label: 'Country', value: player.country || 'N/A' },
      { label: 'Classification', value: formatClassification(player.classification) },
      { label: 'Gender', value: formatGender(player.gender) },
      { label: 'Birth Year', value: player.birth_year || 'N/A' },
      { label: 'Email', value: player.email || 'N/A' },
      { label: 'Phone', value: player.phone || 'N/A' },
      { label: 'Address', value: player.address || 'N/A' },
      { label: 'Zip Code', value: player.zip || 'N/A' },
      { label: 'Rating', value: player.rating || 'N/A' },
      { label: 'Division', value: player.division || 'N/A' },
      { label: 'Status', value: player.status || 'N/A' },
      { label: 'Member Since', value: player.member_since || 'N/A' },
    ];

    // Filter out fields that are 'N/A' to keep the display clean
    return fields.filter(field => field.value !== 'N/A');
  };

  const formatStatisticsData = (data) => {
    if (!data || !Array.isArray(data)) {
      console.log('No statistics data found in response:', data);
      return null;
    }

    return data.map((yearData, index) => {
      const { year, data: statsData } = yearData;
      
      // Handle rankings data (which is what the API actually returns)
      if (statsData && statsData.players && Array.isArray(statsData.players)) {
        const targetPlayer = statsData.players.find(player => 
          player.pdga_number === pdgaNumber
        );
        
        if (targetPlayer) {
          const stats = [
            { label: 'Rating', value: targetPlayer.rating },
            { label: 'Tournaments', value: targetPlayer.tournaments },
            { label: 'Rating Rounds Used', value: targetPlayer.rating_rounds_used },
            { label: 'Points', value: targetPlayer.points },
            { label: 'Prize Money', value: `$${parseInt(targetPlayer.prize).toLocaleString()}` },
            { label: 'Division', value: targetPlayer.division_name },
            { label: 'Class', value: targetPlayer.class === 'P' ? 'Pro' : 'Amateur' },
            { label: 'Gender', value: targetPlayer.gender },
            { label: 'Country', value: targetPlayer.country },
            { label: 'State/Province', value: targetPlayer.state_prov },
            { label: 'Last Modified', value: targetPlayer.last_modified }
          ].filter(stat => stat.value && stat.value !== 'N/A');

          return {
            year,
            stats,
            message: null
          };
        } else {
          return {
            year,
            stats: [],
            message: `Player not found in ${year} rankings`
          };
        }
      }
      
      // Handle traditional statistics data (if it exists)
      if (statsData && statsData.statistics && Array.isArray(statsData.statistics)) {
        const stats = statsData.statistics.map(stat => ({
          label: stat.stat_name || 'Unknown Stat',
          value: stat.stat_value || 'N/A'
        })).filter(stat => stat.value !== 'N/A');

        return {
          year,
          stats,
          message: stats.length === 0 ? 'No statistics available for this year' : null
        };
      }

      return {
        year,
        stats: [],
        message: 'No data available for this year'
      };
    });
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#333', margin: 0 }}>Player Lookup</h2>
          <button onClick={onLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }}>
            Logout
          </button>
        </div>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="pdgaNumber">PDGA Number</label>
            <input
              type="text"
              id="pdgaNumber"
              value={pdgaNumber}
              onChange={(e) => {
                setPdgaNumber(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter PDGA number (e.g., 12345)"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              type="submit" 
              className="btn" 
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? 'Searching...' : 'Search Player'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleStatistics}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? 'Loading...' : 'Get Statistics'}
            </button>
          </div>
        </form>
      </div>

      {playerData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#4a7c59', margin: 0 }}>Player Information</h3>
            <button onClick={handleNewSearch} className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }}>
              New Search
            </button>
          </div>
          
          <div className="player-info">
            {formatPlayerData(playerData)?.map((item, index) => (
              <p key={index}>
                <span className="label">{item.label}:</span>
                <span className="value">{item.value}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {statisticsData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#4a7c59', margin: 0 }}>Player Statistics</h3>
            <button onClick={handleNewSearch} className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }}>
              New Search
            </button>
          </div>
          
          <div className="player-info">
            {formatStatisticsData(statisticsData)?.map((yearData, yearIndex) => (
              <div key={yearIndex} style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#6b8e6b', marginBottom: '12px', borderBottom: '1px solid #e8f0e8', paddingBottom: '8px' }}>
                  {yearData.year}
                </h4>
                {yearData.message ? (
                  <p style={{ color: '#8ba892', fontStyle: 'italic' }}>{yearData.message}</p>
                ) : (
                  yearData.stats.map((stat, statIndex) => (
                    <p key={statIndex}>
                      <span className="label">{stat.label}:</span>
                      <span className="value">{stat.value}</span>
                    </p>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSearch; 
import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeModal = ({ isOpen, onClose }) => {
  const netlifyUrl = 'https://pdga-lookup.netlify.app/';

  if (!isOpen) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PDGA Lookup',
          text: 'Check out this PDGA player lookup app!',
          url: netlifyUrl
        });
      } catch (error) {
        // Ignore AbortError (user cancelled share)
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
          // Fallback to clipboard copy
          try {
            await navigator.clipboard.writeText(netlifyUrl);
            alert('URL copied to clipboard!');
          } catch (clipboardError) {
            console.error('Clipboard copy failed:', clipboardError);
            alert('Share failed. Please copy the URL manually.');
          }
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(netlifyUrl);
        alert('URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard copy failed:', clipboardError);
        alert('Share failed. Please copy the URL manually.');
      }
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(netlifyUrl);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      alert('Failed to copy URL. Please copy it manually.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ color: '#4a7c59', margin: 0 }}>Share PDGA Lookup</h3>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ 
              width: 'auto', 
              padding: '8px 12px',
              fontSize: '18px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
            Scan this QR code to access PDGA Lookup on your mobile device
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <QRCode 
              value={netlifyUrl}
              size={200}
              level="H"
              fgColor="#4a7c59"
              bgColor="white"
            />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '10px',
              wordBreak: 'break-all'
            }}>
              {netlifyUrl}
            </p>
            
            <button 
              onClick={handleCopyUrl}
              className="btn"
              style={{ marginRight: '10px' }}
            >
              Copy URL
            </button>
            
            <button 
              onClick={handleShare}
              className="btn btn-secondary"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal; 
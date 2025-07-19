# PDGA Lookup App

A React-based web application for tournament directors to quickly lookup PDGA player information using the PDGA REST API.

## Features

- 🔐 **PDGA Authentication**: Secure login with PDGA credentials
- 🔍 **Player Lookup**: Search players by PDGA number
- 📱 **Mobile-Friendly**: Responsive design optimized for mobile devices
- 🎨 **Natural Green Theme**: Beautiful UI with PDGA-inspired colors
- 📋 **Formatted Display**: Clean presentation of player information
- 📱 **QR Code Sharing**: Easy sharing via QR code for mobile access
- ☁️ **Netlify Deployment**: Serverless functions for production

## Tech Stack

- **Frontend**: React 18, CSS3
- **Backend**: Netlify Functions (production), Express.js (development)
- **API**: PDGA REST API
- **Deployment**: Netlify
- **QR Code**: react-qr-code

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pdga-lookup
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the React frontend (port 3000) and Express backend (port 3001).

### Development vs Production

- **Development**: Uses local Express server at `http://localhost:3001/api`
- **Production**: Uses Netlify Functions at `/.netlify/functions`

## Deployment to Netlify

### Automatic Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Functions directory**: `netlify/functions`

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy using Netlify CLI:
```bash
npx netlify deploy --prod --dir=build
```

### Environment Variables

No environment variables are required for basic functionality.

## Usage

1. **Login**: Enter your PDGA username and password
2. **Search**: Enter a PDGA number to lookup player information
3. **Share**: Use the share button to generate a QR code for mobile access
4. **View Results**: Player information is displayed in a clean, formatted layout

## API Endpoints

### Netlify Functions (Production)

- `/.netlify/functions/auth` - PDGA authentication
- `/.netlify/functions/player-search` - Player lookup

### Local Development

- `http://localhost:3001/api/auth` - PDGA authentication
- `http://localhost:3001/api/player-search` - Player lookup

## File Structure

```
pdga-lookup/
├── src/
│   ├── components/
│   │   ├── LoginForm.js
│   │   ├── PlayerSearch.js
│   │   └── QRCodeModal.js
│   ├── services/
│   │   └── pdgaApi.js
│   ├── App.js
│   └── App.css
├── netlify/
│   └── functions/
│       ├── auth.js
│       ├── player-search.js
│       └── package.json
├── server.js (development only)
├── netlify.toml
└── package.json
```

## Troubleshooting

### Network Errors on Mobile

If you're getting network errors on mobile after deployment:

1. Ensure Netlify Functions are properly deployed
2. Check that the `netlify.toml` file is in the root directory
3. Verify the functions directory structure is correct

### Authentication Issues

- Ensure PDGA credentials are correct
- Check that the PDGA API is accessible
- Verify session tokens are being stored properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and on Netlify
5. Submit a pull request

## License

This project is for tournament director use with PDGA API access. 
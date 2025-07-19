# PDGA Player Lookup

A mobile-friendly React application for tournament directors to quickly lookup PDGA player information using the official PDGA API.

## Features

- **Secure Authentication**: Login with PDGA credentials using the official API
- **Player Search**: Search players by PDGA number
- **Mobile-Optimized**: Responsive design perfect for tournament use
- **Persistent Login**: Token-based authentication with local storage
- **Real-time Data**: Direct integration with PDGA's REST API

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- PDGA account credentials

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd pdga-lookup
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Login with your PDGA credentials

4. Enter a PDGA number to search for player information

## API Integration

This app integrates with the PDGA REST API:

- **Authentication**: `POST /auth` - Login with PDGA credentials
- **Player Search**: `GET /services/player-search` - Search by PDGA number

For more information about the PDGA API, visit: https://www.pdga.com/dev/api/rest/v1

## Mobile Usage

The app is optimized for mobile devices and can be used by tournament directors to quickly verify player information when someone walks up to a tournament. The responsive design ensures it works well on phones and tablets.

## Security

- Credentials are only used for authentication and are not stored
- Authentication tokens are stored securely in localStorage
- All API communication uses HTTPS
- Tokens are automatically cleared on logout

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory and can be deployed to any static hosting service.

## Troubleshooting

- **Authentication Issues**: Ensure your PDGA credentials are correct
- **Network Errors**: Check your internet connection
- **API Errors**: The PDGA API may be temporarily unavailable

## License

This project is for educational and tournament management purposes. Please respect PDGA's API terms of service. 
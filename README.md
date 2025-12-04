# EVM Voting System

A modern Electronic Voting Machine (EVM) demo system built with React.js. This system allows you to create voting interfaces for different constituencies with URL-based routing and real-time vote counting.

## Features

- **URL Parameter Routing**: Access different EVMs via `/evm/{locationId}`
- **Dynamic Candidate Management**: Preset candidate data with flexible positioning
- **Real-time Vote Counting**: Local storage-based vote tracking
- **Admin Panel**: Comprehensive vote analysis and management
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Multi-language Support**: Malayalam and English candidate names
- **Session Management**: Prevents duplicate voting per session

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd votingmachine

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## URL Structure

- `/` - Home page with location selector
- `/evm/{locationId}` - EVM interface for specific location
- `/admin` - Admin panel for all locations
- `/admin/{locationId}` - Admin panel for specific location

### Example URLs

```
http://localhost:3000/evm/ALAPPUZHA_G04073_W01213_1
http://localhost:3000/evm/KOLLAM_G05021_W02156_3
http://localhost:3000/admin/ALAPPUZHA_G04073_W01213_1
```

## Adding New Locations

Edit `src/data/evmData.js` to add new constituencies:

```javascript
export const evmLocations = {
  "YOUR_LOCATION_ID": {
    locationName: "Your Constituency Name",
    district: "Your District",
    state: "Your State",
    candidates: [
      {
        id: 1,
        name: "Candidate Name (Local)",
        nameEn: "Candidate Name (English)",
        party: "Full Party Name",
        partyShort: "PARTY",
        symbol: "🔥",
        symbolName: "Fire",
        position: 1,
        color: "#FF6B35"
      }
      // Add more candidates...
    ]
  }
};
```

## Vote Counting System

### How Voting Works

1. **Session-based**: Each browser session can vote once per location
2. **Local Storage**: Votes are stored in browser's localStorage
3. **Real-time Updates**: Vote counts update immediately
4. **Persistent**: Data persists across browser sessions

### Vote Storage Structure

```javascript
// localStorage key: 'evm_votes'
{
  "LOCATION_ID": {
    "candidateId1": voteCount,
    "candidateId2": voteCount
  }
}

// localStorage key: 'evm_sessions'
{
  "LOCATION_ID": [
    {
      "sessionId": "session_123",
      "candidateId": 1,
      "timestamp": "2024-12-04T16:45:00.000Z"
    }
  ]
}
```

### Admin Functions

- **View Results**: Real-time vote counting with percentages
- **Export Data**: Download vote data as JSON
- **Clear Votes**: Reset votes for specific location or all locations
- **Session Tracking**: Monitor voting sessions

## Deployment on Render

### Automatic Deployment

1. **Connect Repository**: Link your GitHub repo to Render
2. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Node Version: 18+

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the 'dist' folder to Render
```

### Environment Variables

No environment variables required for basic functionality.

## Customization

### Styling

- Edit `src/index.css` for global styles
- Modify `tailwind.config.js` for theme customization
- Update component styles in individual files

### Adding Features

1. **Database Integration**: Replace localStorage with API calls
2. **Authentication**: Add voter authentication system
3. **Real-time Updates**: Implement WebSocket for live results
4. **Audit Trail**: Add detailed voting logs
5. **Multi-language**: Extend language support

### Security Considerations

- **Client-side Only**: Current implementation is demo-only
- **No Authentication**: Sessions are browser-based
- **Data Persistence**: Uses localStorage (can be cleared)

For production use, consider:
- Server-side vote storage
- Voter authentication
- Encrypted vote transmission
- Audit logging
- Rate limiting

## File Structure

```
src/
├── components/
│   ├── CandidateCard.jsx     # Individual candidate display
│   └── EVMInterface.jsx      # Main voting interface
├── data/
│   └── evmData.js           # Preset location and candidate data
├── pages/
│   ├── Home.jsx             # Location selector page
│   └── AdminPanel.jsx       # Vote counting and management
├── utils/
│   └── voteStorage.js       # Vote storage utilities
├── App.jsx                  # Main app with routing
├── main.jsx                 # React entry point
└── index.css               # Global styles
```

## Technology Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **Build**: Vite

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser and system information

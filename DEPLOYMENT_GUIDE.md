# ITL Deepfake Detective - Deployment Guide

## Project Overview
ITL Deepfake Detective is a Next.js web application for detecting deepfakes in images, videos, and audio files using Reality Defender API integration.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **RAM**: At least 4GB recommended
- **Internet Connection**: Required for Reality Defender API

### API Requirements
- **Reality Defender API Key**: Required for deepfake detection functionality
- **Reality Defender API URL**: Default endpoint provided

## Quick Start Guide

### Step 1: Install Node.js
1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Install the LTS version (recommended)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Extract and Navigate to Project
1. Extract the project folder to your desired location
2. Open terminal/command prompt
3. Navigate to the project directory:
   ```bash
   cd path/to/deepfakeweb
   ```

### Step 3: Install Dependencies
```bash
npm install
```
*This will install all required packages (~300MB)*

### Step 4: Configure Environment Variables
1. Create a `.env.local` file in the project root
2. Add the following configuration:
   ```env
   # Reality Defender API Configuration
   NEXT_PUBLIC_RD_API_KEY=your_reality_defender_api_key_here
   NEXT_PUBLIC_RD_API_URL=https://api.prd.realitydefender.xyz
   
   # Application Configuration
   NEXT_PUBLIC_APP_ENV=production
   ```

### Step 5: Run the Application
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

## Production Deployment

### Option 1: Production Build (Recommended)
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Option 2: Docker Deployment (Advanced)
```bash
# Build Docker image
docker build -t itl-deepfake-detective .

# Run container
docker run -p 3000:3000 --env-file .env.local itl-deepfake-detective
```

## Features Available

### Core Functionality
- ✅ **File Upload**: Drag & drop or click to upload
- ✅ **Deepfake Detection**: AI-powered analysis via Reality Defender
- ✅ **Real-time Progress**: Live analysis status updates
- ✅ **Comprehensive Results**: Immediate detailed analysis display

### Analysis Features
- ✅ **Confidence Scoring**: Risk percentage (0-100%)
- ✅ **Category Breakdown**: Authentic/Manipulated/Inconclusive percentages
- ✅ **Timeline Analysis**: Frame-by-frame confidence charts
- ✅ **Advanced Charts**: Risk heatmaps, anomaly detection, radar analysis
- ✅ **Technical Details**: Processing stats, model information

### Export & Sharing
- ✅ **PDF Export**: Professional analysis reports
- ✅ **Analysis History**: Recent results in sidebar
- ✅ **Usage Tracking**: Free tier monitoring

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP, BMP
- **Videos**: MP4, WebM, MOV, AVI, MKV
- **Audio**: MP3, WAV, FLAC, AAC, OGG, M4A
- **Max File Size**: 100MB

## Troubleshooting

### Common Issues

#### 1. "Command not found: npm"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

#### 2. "Port 3000 already in use"
**Solution**: 
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

#### 3. "API Key not configured"
**Solution**: Ensure `.env.local` file exists with correct API key

#### 4. "Network Error" during analysis
**Solution**: 
- Check internet connection
- Verify Reality Defender API key is valid
- Check firewall settings

#### 5. Charts not rendering in PDF
**Solution**: Wait a few seconds after analysis before exporting PDF

### Performance Optimization
- **Large Files**: Files over 50MB may take longer to process
- **Concurrent Uploads**: Process one file at a time for best performance
- **Browser Compatibility**: Use Chrome, Firefox, Safari, or Edge (latest versions)

## Project Structure
```
deepfakeweb/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                # Utility functions and API clients
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── .env.local             # Environment variables (create this)
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## API Integration Details

### Reality Defender Integration
- **Authentication**: Bearer token via API key
- **File Upload**: Secure signed URL upload to S3
- **Analysis**: Multiple AI model ensemble
- **Results**: Confidence scores, category breakdown, technical metadata

### API Endpoints
- `POST /api/rd/signed-url` - Get upload URL
- `GET /api/rd/result/[id]` - Poll analysis results

## Security Features
- ✅ **Secure Upload**: Files uploaded directly to Reality Defender S3
- ✅ **No File Storage**: Files not stored on local server
- ✅ **API Key Protection**: Environment variables for sensitive data
- ✅ **HTTPS**: All API communications encrypted

## Support & Maintenance

### Logs and Debugging
- Browser Developer Tools (F12) for frontend issues
- Server logs in terminal for backend issues
- Network tab for API communication issues

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
```

### Backup
- Backup `.env.local` file (contains API keys)
- Export analysis history via the sidebar export function

## Contact Information
For technical support or questions about this deployment:
- Check browser console for error messages
- Review server terminal output for API issues
- Ensure all prerequisites are met

---

**ITL Deepfake Detective v1.0**  
*Powered by Reality Defender API*  
*Built with Next.js, React, and TypeScript*
# 🛡️ Deepfake Detective

A powerful, AI-driven deepfake detection web application built with Next.js and Reality Defender API. Upload images, videos, or audio files to detect potential deepfake manipulation with enterprise-grade accuracy.

![Deepfake Detective](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Reality Defender](https://img.shields.io/badge/Reality%20Defender%20API-integrated-green?style=flat-square)

## ✨ Features

### 🚀 Core Functionality
- **Multi-format Support** - Images (JPG, PNG, GIF, WebP), Videos (MP4, WebM, MOV, AVI), Audio (MP3, WAV, FLAC, AAC)
- **Real-time Analysis** - Upload and get results in seconds
- **Confidence Scoring** - Visual confidence gauges with risk levels
- **Detailed Reports** - Frame-by-frame and segment analysis
- **History Tracking** - Recent analyses with thumbnails and quick access

### 🎨 User Experience
- **Drag & Drop Upload** - Intuitive file selection with progress tracking
- **Responsive Design** - Mobile-first, works on all devices
- **Dark/Light Theme** - System-aware theme switching
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Charts** - Recharts visualizations with multiple view modes

### 📊 Visualizations
- **Confidence Gauge** - Animated circular progress indicator
- **Category Breakdown** - Pie/bar charts for detection categories
- **Timeline Analysis** - Frame-by-frame confidence over time
- **Audio Waveforms** - Visual representation of audio analysis
- **Export Options** - Download detailed JSON reports

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN/UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **File Upload**: React Dropzone
- **API**: Reality Defender API
- **Storage**: Local Storage (browser-based)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Reality Defender API key (get free tier at [realitydefender.com](https://www.realitydefender.com/platform/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deepfakeweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Reality Defender API key:
   ```env
   NEXT_PUBLIC_RD_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_DEMO_MODE=false
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Integration

### Reality Defender API Setup

1. **Get API Key**
   - Visit [Reality Defender API](https://www.realitydefender.com/platform/api)
   - Sign up for free tier (50 scans/month)
   - Copy your API key

2. **API Features Used**
   - **Upload Endpoint**: Secure file upload
   - **Analysis Endpoint**: Deepfake detection processing
   - **Results Polling**: Async result retrieval
   - **Multi-format Support**: Images, videos, audio

3. **Demo Mode**
   - App runs in demo mode by default with mock data
   - Set `NEXT_PUBLIC_RD_API_KEY` to use real API
   - Automatic fallback to demo mode if API fails

### API Pricing Tiers

| Tier | Price | Features |
|------|--------|----------|
| **Free** | $0/month | 50 scans, Audio & Image only |
| **Growth** | $399/month | 50+ scans, Audio, Image & Video |
| **Enterprise** | Custom | Unlimited scans, All formats, Live streaming |

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Landing page
│   ├── upload/         # Upload & analysis page
│   ├── results/        # Detailed results page
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
│   ├── ui/            # ShadCN/UI components
│   ├── layout/        # Navigation & sidebar
│   ├── charts/        # Data visualization
│   └── upload-box.tsx # File upload component
├── lib/               # Utilities and API
│   ├── reality-defender.ts # API integration
│   ├── storage.ts          # Local storage utilities
│   ├── types/              # TypeScript types
│   └── utils.ts            # Helper functions
└── styles/            # Global styles
```

## 🎯 Usage

### Basic Workflow

1. **Upload File**
   - Drag & drop or click to select media file
   - Supports images, videos, and audio files
   - Real-time upload progress

2. **Analysis**
   - Automatic processing with Reality Defender API
   - Visual progress indicators
   - Processing typically takes 2-5 seconds

3. **Results**
   - Confidence score with risk level
   - Category breakdown (Authentic/Manipulated/Inconclusive)
   - Timeline analysis for videos/audio
   - Download detailed JSON reports

4. **History**
   - Recent analyses saved locally
   - Thumbnail previews
   - Quick access to previous results

### Advanced Features

- **Theme Switching**: Light/Dark/System modes
- **Responsive Design**: Works on desktop, tablet, mobile
- **Export Options**: Download analysis reports
- **Error Handling**: Graceful fallbacks and error messages
- **Performance**: Optimized loading and animations

## 🔒 Privacy & Security

- **Local Processing**: Files analyzed via secure API calls
- **No Permanent Storage**: Files not stored on servers
- **HTTPS Only**: Encrypted data transmission
- **Local History**: Analysis history stored in browser only

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **API Failures**: Automatic fallback to demo mode
- **Network Issues**: Retry mechanisms and user feedback
- **File Validation**: Format and size checking
- **Graceful Degradation**: Continues working even with limited connectivity

## 📊 Performance

- **Fast Loading**: Optimized Next.js build
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Next.js automatic optimization
- **Caching**: Efficient caching strategies

## 🔄 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build production version
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Reality Defender](https://www.realitydefender.com/) for providing the deepfake detection API
- [ShadCN/UI](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for data visualization

---

**Built with ❤️ using Next.js and Reality Defender API**

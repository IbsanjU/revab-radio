# Revab Radio 📻

A comprehensive, modern radio station application built with Next.js 14, featuring a beautiful UI, multiple radio stations, and advanced playback controls.

![Revab Radio](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎵 Core Playback
- **Play/Pause Control** - Smooth playback transitions
- **Volume Control** - Precise volume adjustment with mute/unmute
- **Next/Previous Navigation** - Seamlessly switch between stations
- **Shuffle Mode** - Randomize station playback order
- **Repeat Modes** - Off, Repeat All, Repeat One

### 📻 Radio Station Management
- **30+ Pre-configured Stations** - Popular stations from around the world
- **Multiple Genres** - Pop, Rock, Jazz, Classical, Electronic, News, and more
- **International Coverage** - Stations from UK, USA, France, Germany, Switzerland, and more
- **Search & Filter** - Find stations by name, genre, or country
- **Station Categories** - Organized by genre for easy discovery

### ❤️ Favorites & History
- **Favorites System** - Save your favorite stations
- **Recently Played** - Track your listening history
- **Persistent Storage** - Preferences saved in localStorage

### 🎨 Visual Features
- **Audio Visualizer** - Real-time frequency visualization
- **Station Cards** - Beautiful card-based UI
- **Now Playing Display** - Current station info and metadata
- **Animated Controls** - Smooth, polished animations

### 🌓 UI/UX
- **Dark/Light Mode** - Toggle between themes or use system preference
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Keyboard Shortcuts** - Control playback without touching the mouse
- **Modern Design** - Clean interface with Tailwind CSS

### ⚙️ Advanced Features
- **Equalizer Controls** - Adjust bass, mid, and treble (built-in, not UI-exposed)
- **State Management** - Powered by Zustand for efficient state handling
- **Error Handling** - Graceful handling of network issues
- **TypeScript** - Fully typed for better development experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or npm/pnpm installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IbsanjU/revab-radio.git
   cd revab-radio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

The easiest way to deploy Revab Radio is using [Vercel](https://vercel.com):

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IbsanjU/revab-radio)

### Manual Deployment

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Click "Deploy"

Your app will be live in minutes!

## 🎹 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `↑` | Volume Up |
| `↓` | Volume Down |
| `M` | Mute/Unmute |
| `Shift + →` | Next Station |
| `Shift + ←` | Previous Station |

## 🎛️ Adding Custom Radio Stations

To add your own radio stations, edit `/public/stations.json`:

```json
{
  "id": "unique-id",
  "name": "Station Name",
  "url": "https://stream-url.com/stream",
  "genre": "Genre",
  "country": "Country",
  "description": "Optional description",
  "website": "https://station-website.com"
}
```

Supported stream formats: MP3, AAC, OGG

## 📁 Project Structure

```
revab-radio/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── player/
│   │   ├── AudioEngine.tsx    # Core audio playback engine
│   │   ├── AudioPlayer.tsx    # Main player UI
│   │   ├── Controls.tsx       # Playback controls
│   │   └── VolumeControl.tsx  # Volume slider
│   ├── stations/
│   │   ├── StationCard.tsx    # Individual station card
│   │   ├── StationList.tsx    # Station grid/list
│   │   └── StationSearch.tsx  # Search and filters
│   ├── visualizer/
│   │   └── AudioVisualizer.tsx # Audio visualization
│   └── ui/
│       └── ThemeToggle.tsx     # Dark/light theme toggle
├── hooks/
│   ├── useLocalStorage.ts      # localStorage hook
│   ├── useTheme.ts             # Theme management
│   └── useKeyboardShortcuts.ts # Keyboard controls
├── lib/
│   ├── audio-store.ts          # Zustand store for audio state
│   ├── stations.ts             # Station utilities
│   └── utils.ts                # General utilities
├── types/
│   └── index.ts                # TypeScript types
├── public/
│   └── stations.json           # Pre-configured stations
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API with Web Audio API

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Modifying the Visualizer

Edit `/components/visualizer/AudioVisualizer.tsx` to customize the visualization style.

## 🐛 Troubleshooting

### Audio Not Playing

1. **Check Stream URL** - Ensure the station URL is valid and accessible
2. **CORS Issues** - Some streams may have CORS restrictions
3. **Browser Autoplay** - Some browsers block autoplay; user interaction may be required
4. **Format Support** - Verify your browser supports the stream format

### Build Errors

1. **Clear Cache**
   ```bash
   rm -rf .next node_modules
   npm install
   ```

2. **Check Node Version**
   ```bash
   node --version  # Should be 18+
   ```

### Dark Mode Not Working

Ensure your browser supports `prefers-color-scheme` media query. The theme toggle should work regardless.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Radio streams provided by various international broadcasters
- Icons by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/)

---

**Enjoy your music! 🎵**

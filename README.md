# Revab Radio 📻

A comprehensive, modern radio station application built with Next.js 14, featuring a beautiful UI, multiple radio stations, and advanced playback controls.

![Revab Radio](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📚 Documentation

- **[FAQ](./FAQ.md)** - Frequently asked questions
- **[Broadcasting Guide](./BROADCASTING.md)** - How to create and share broadcasts
- **[Implementation Details](./IMPLEMENTATION_SUMMARY.md)** - Technical architecture

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

## 🌐 Access from Other Devices

### Local Network Access

To access Revab Radio from other devices on your network (phones, tablets, other computers):

1. **Start the server with network binding:**
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

2. **Find your local IP address:**
   - **Windows**: Run `ipconfig` (look for IPv4 Address)
   - **Mac**: Run `ipconfig getifaddr en0`
   - **Linux**: Run `hostname -I`

3. **Access from other devices:**
   Open `http://YOUR_LOCAL_IP:3000` on any device on the same network
   
   Example: `http://192.168.1.100:3000`

### Internet Access

For internet-wide access, see the [Broadcasting Guide](./BROADCASTING.md#-accessing-broadcasts-over-the-internet) which covers:
- Using ngrok for quick temporary access
- Deploying to Vercel, Railway, or other platforms
- Self-hosting on a VPS
- Security and performance considerations

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

### 📺 Adding YouTube Streams

You can add YouTube URLs as radio stations, but you need to configure cookies to bypass YouTube's automated access detection.

#### Setup Instructions

1. **Extract YouTube Cookies**
   
   Use a browser extension to export your YouTube cookies:
   - **Chrome/Edge**: [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
   - **Firefox**: [cookies.txt](https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/)
   
   After installing:
   - Visit [YouTube](https://youtube.com) and ensure you're logged in
   - Click the extension icon
   - Export cookies in Netscape format
   - Save the content to a file (e.g., `youtube_cookies.txt`)

2. **Configure Environment Variable**
   
   Create a `.env.local` file in the project root:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Add your YouTube cookies:
   
   ```env
   YOUTUBE_COOKIES=path/to/youtube_cookies.txt
   # Or paste the entire cookie content as a single line
   ```

3. **Add YouTube Station**
   
   Add to `/public/stations.json`:
   
   ```json
   {
     "id": "yt-1",
     "name": "YouTube Live Stream",
     "url": "https://www.youtube.com/watch?v=VIDEO_ID",
     "genre": "Custom",
     "country": "Online",
     "description": "Live stream from YouTube"
   }
   ```

4. **Restart the Server**
   
   ```bash
   npm run dev
   ```

#### Important Notes

- **Cookie Expiration**: YouTube cookies expire after a period. If streams stop working, you may need to re-export fresh cookies.
- **Account Safety**: Keep your cookies private. Don't commit them to version control (already in `.gitignore`).
- **Rate Limiting**: YouTube may still rate-limit or block access if too many requests are made.
- **Terms of Service**: Ensure your use complies with YouTube's Terms of Service.

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

### YouTube Streams Not Playing

If you're trying to play YouTube streams and encountering errors:

1. **"YouTube detected automated access"**
   - Configure `YOUTUBE_COOKIES` environment variable (see [Adding YouTube Streams](#-adding-youtube-streams) section)
   - Ensure cookies are fresh (not expired)
   - Make sure you're logged into YouTube when exporting cookies

2. **Stream stops after a few minutes**
   - YouTube cookies may have expired - re-export fresh cookies
   - YouTube may be rate-limiting your IP - wait and try again later

3. **"Video unavailable" errors**
   - The video may be geo-restricted
   - The video may require age verification
   - The video may be private or deleted

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

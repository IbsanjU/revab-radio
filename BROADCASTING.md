# Custom Station Broadcasting Guide

## Overview
Revab Radio now supports creating and broadcasting your own custom radio station! Share your voice, music, or any audio content with listeners in real-time.

## Features

### For Broadcasters
- **Live Streaming**: Broadcast audio from your microphone in real-time
- **Custom Metadata**: Set your station name, genre, and description
- **Listener Tracking**: See how many people are tuned in
- **Simple Controls**: Easy start/stop broadcasting interface
- **Persistent Station**: Your station appears in the station list while broadcasting

### For Listeners
- **Discover Custom Stations**: Custom broadcasts appear alongside regular stations
- **Real-time Playback**: Listen to live broadcasts with minimal latency
- **Standard Controls**: Use the same player controls as regular stations

## How to Broadcast

### Step 1: Click "Broadcast" Button
Look for the floating "Broadcast" button in the bottom-right corner of the app.

### Step 2: Fill in Station Details
- **Station Name** (required): Give your station a catchy name
- **Genre**: Choose from predefined genres or select "Custom"
- **Description**: Tell listeners what you're broadcasting

### Step 3: Grant Microphone Permission
When you click "Start Broadcasting", your browser will ask for microphone permission. You must allow access to start broadcasting.

### Step 4: Go Live!
Once permission is granted:
- Your station starts broadcasting immediately
- A live indicator shows your broadcast status
- Your station appears in the station list for others to discover
- You can see the current listener count

### Step 5: Stop Broadcasting
When you're done:
- Click the "Stop Broadcasting" button
- Your microphone will be released
- Your station will be removed from the station list

## Technical Details

### API Endpoints

#### Start Broadcasting
```bash
POST /api/broadcast?id=<station-id>&name=<station-name>&genre=<genre>&description=<description>
Content-Type: audio/webm
Body: Audio stream data
```

#### Listen to Broadcast
```bash
GET /api/broadcast?id=<station-id>
```

#### Stop Broadcasting
```bash
DELETE /api/broadcast?id=<station-id>
```

### Architecture
- **Client-side**: Uses MediaRecorder API to capture microphone audio
- **Server-side**: Node.js streams distribute audio to multiple listeners
- **Storage**: In-memory broadcast management (broadcasts don't persist server restarts)
- **Format**: Audio is transmitted as WebM/Opus for broad compatibility

### Limitations
- **Browser Support**: Requires modern browsers with MediaRecorder API support
- **Server Memory**: Broadcasts are stored in memory and don't persist across server restarts
- **Scalability**: For production use with many listeners, consider using a dedicated streaming server like Icecast or WebRTC
- **Audio Quality**: Limited by microphone quality and network bandwidth

## Privacy & Security

### What We Collect
- Station metadata (name, genre, description)
- Temporary audio stream data (not stored permanently)
- Active listener count

### What We Don't Collect
- Audio is not recorded or stored on the server
- No user identification or tracking
- Broadcasts end when you stop or close the page

### Security Features
- CORS headers for cross-origin requests
- No authentication required (anonymous broadcasting)
- Automatic cleanup when broadcasts end

## Troubleshooting

### "Microphone access denied"
- Check your browser permissions
- Look for a microphone icon in the address bar
- Grant permission and try again

### "Failed to start broadcast"
- Ensure your microphone is working
- Try refreshing the page
- Check browser console for errors

### "No one can hear my broadcast"
- Verify you see "Live Broadcasting" indicator
- Ask a listener to check the station list
- Ensure your station ID is unique

### "Poor audio quality"
- Check your microphone connection
- Reduce background noise
- Consider using an external microphone
- Check your internet connection speed

## 🌐 Accessing Broadcasts Over the Internet

By default, your Revab Radio broadcasts are only accessible on your local machine (`localhost:3000`). Here's how to make them accessible to others:

### Option 1: Local Network Access (Same WiFi)

Perfect for broadcasting to devices on your home or office network.

#### Step 1: Find Your Local IP Address

**On Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (usually 192.168.x.x)
```

**On Mac/Linux:**
```bash
ifconfig
# Look for "inet" address (usually 192.168.x.x or 10.0.x.x)
```

Or use:
```bash
hostname -I  # Linux
ipconfig getifaddr en0  # Mac
```

#### Step 2: Allow Network Connections

Start the dev server to listen on all network interfaces:

```bash
npm run dev -- -H 0.0.0.0
# or
next dev -H 0.0.0.0
```

#### Step 3: Share Your URL

Share your local IP with others on the same network:
```
http://YOUR_LOCAL_IP:3000
```

Example: `http://192.168.1.100:3000`

**Security Note:** Only share with trusted users on your local network.

#### Troubleshooting Local Network Access

- **Can't connect?** Check your firewall settings
  - **Windows**: Allow Node.js through Windows Firewall
  - **Mac**: System Preferences → Security & Privacy → Firewall → Firewall Options
  - **Linux**: Check `ufw` or `iptables` rules

- **Still not working?** Ensure devices are on the same WiFi network and not using guest networks

### Option 2: Internet Access via Ngrok (Quick & Easy)

Great for testing or temporary sharing with anyone on the internet.

#### Step 1: Install Ngrok

```bash
# Download from https://ngrok.com/download
# Or use package managers:

# Mac (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# Linux (snap)
snap install ngrok
```

#### Step 2: Run Your App

```bash
npm run dev
```

#### Step 3: Expose with Ngrok

In a new terminal:
```bash
ngrok http 3000
```

You'll get a public URL like: `https://abc123.ngrok.io`

#### Step 4: Share the URL

Anyone can access your broadcast at the ngrok URL!

**Limitations:**
- Free tier has limitations (session timeouts, bandwidth limits)
- URL changes each time you restart ngrok
- May experience latency

### Option 3: Deploy to Production (Recommended for Permanent Access)

For a permanent, professional setup, deploy to a hosting platform.

#### Deploy to Vercel (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Access Your App:**
   Your app will be live at `https://your-app.vercel.app`

**Benefits:**
- Free tier available
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Custom domain support

#### Deploy to Other Platforms

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Render:**
- Connect your GitHub repo at [render.com](https://render.com)
- Choose "Web Service"
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

### Option 4: Self-Hosting on VPS

For full control, deploy to your own server.

#### Basic Setup (Ubuntu/Debian):

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone YOUR_REPO
cd revab-radio
npm install
npm run build

# Run with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "revab-radio" -- start
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx
# Configure nginx to proxy port 3000
```

**Nginx Configuration** (`/etc/nginx/sites-available/revab-radio`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/revab-radio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Broadcasting vs Listening Requirements

**For Broadcasters:**
- Must have access to the server (local network or internet)
- Needs microphone permission in browser
- Stable internet connection recommended

**For Listeners:**
- Only need the URL to access the app
- Can be on any device with a modern browser
- Works on mobile, tablet, desktop

### Security Considerations

When exposing your broadcast to the internet:

1. **Use HTTPS** - Especially for production deployments
2. **Consider Authentication** - Add user login if needed
3. **Rate Limiting** - Prevent abuse of your broadcast API
4. **Content Moderation** - Monitor broadcasts for inappropriate content
5. **Bandwidth** - Be aware of hosting costs with many listeners
6. **Privacy** - Don't broadcast sensitive information

### Performance Tips

- **Production builds** are faster: `npm run build && npm start`
- **Use CDN** for static assets (Vercel does this automatically)
- **Monitor bandwidth** - each listener uses ~128kbps
- **Limit concurrent broadcasts** to prevent server overload

## Future Enhancements

Potential improvements for custom broadcasting:
- **Authentication**: Require login to broadcast
- **Scheduled Broadcasts**: Plan broadcasts in advance
- **Recording**: Save broadcasts for later playback
- **Chat**: Real-time chat between broadcaster and listeners
- **Analytics**: Detailed listener statistics
- **Multiple Sources**: Upload files or stream from URL
- **Persistent Storage**: Use database instead of in-memory storage
- **Load Balancing**: Support for high-traffic broadcasts

## Examples

### Music DJ
```
Station Name: "Midnight Jazz Sessions"
Genre: "Jazz"
Description: "Live DJ mixing the smoothest jazz every Friday night"
```

### Podcast
```
Station Name: "Tech Talk Daily"
Genre: "Podcast"
Description: "Live discussions about the latest in technology"
```

### Language Learning
```
Station Name: "Spanish Practice Hour"
Genre: "Talk"
Description: "Practice Spanish conversation in real-time"
```

## Support

For issues or feature requests related to custom broadcasting:
1. Check this documentation
2. Review the troubleshooting section
3. Open an issue on GitHub with detailed information

---

**Happy Broadcasting! 🎙️**

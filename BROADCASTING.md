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

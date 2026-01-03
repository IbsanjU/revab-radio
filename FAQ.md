# Frequently Asked Questions (FAQ)

## General Questions

### What is Revab Radio?
Revab Radio is a modern web-based radio station application built with Next.js that allows you to listen to pre-configured radio stations and create your own live broadcasts.

### Is Revab Radio free to use?
Yes! Revab Radio is open-source and free to use under the MIT License.

### What browsers are supported?
Modern browsers with HTML5 Audio API support:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

## YouTube Streaming

### Why do I need YouTube cookies?
YouTube uses bot detection to prevent automated access. When accessing YouTube streams programmatically, you need to provide authentication cookies to prove you're a legitimate user.

### How do I get YouTube cookies?
1. Install a cookie export extension (see [README.md](./README.md#-adding-youtube-streams))
2. Log into YouTube in your browser
3. Export cookies using the extension
4. Save to a file and configure the `YOUTUBE_COOKIES` environment variable

### Are my YouTube cookies safe?
Your cookies should be kept private as they grant access to your YouTube account. Always:
- Never commit cookies to Git (already in `.gitignore`)
- Don't share your `.env.local` file
- Regenerate cookies if you suspect they've been compromised

### How often do YouTube cookies expire?
YouTube cookies typically expire after a few weeks to months. If your YouTube streams stop working, try exporting fresh cookies.

### Can I use YouTube live streams?
Yes! Just add the YouTube live stream URL to your `stations.json` file after configuring cookies.

## Broadcasting

### How do I broadcast my own station?
1. Click the "Broadcast" button in the app
2. Fill in your station details
3. Grant microphone permission
4. Start broadcasting!

See [BROADCASTING.md](./BROADCASTING.md) for detailed instructions.

### Can others hear my broadcast?
By default, broadcasts are only accessible on your local machine. To share with others:
- **Local network**: See [Local Network Access](./BROADCASTING.md#option-1-local-network-access-same-wifi)
- **Internet**: See [Internet Access Options](./BROADCASTING.md#-accessing-broadcasts-over-the-internet)

### How many people can listen to my broadcast?
The in-memory implementation supports multiple concurrent listeners, but performance depends on:
- Your server resources (CPU, RAM, bandwidth)
- Your internet upload speed (~128kbps per listener)
- Hosting platform limits

For large-scale broadcasting, consider using dedicated streaming services like Icecast or WebRTC solutions.

### Do broadcasts persist after I close the browser?
No. When you stop broadcasting or close the browser, the broadcast ends and is not saved. This is by design for privacy and simplicity.

### Can I record my broadcasts?
The current implementation doesn't include recording. You would need to:
1. Use external recording software (like OBS)
2. Implement server-side recording (advanced)
3. Use browser extensions to record audio

## Network Access

### How do I access Revab Radio from my phone?
If your phone is on the same WiFi network:
1. Start the dev server with: `npm run dev -- -H 0.0.0.0`
2. Find your computer's local IP (e.g., `192.168.1.100`)
3. Open `http://YOUR_IP:3000` on your phone

### How do I share my broadcast with people on the internet?
Several options:
- **Quick/Temporary**: Use ngrok (free)
- **Production**: Deploy to Vercel, Railway, or similar
- **Advanced**: Self-host on a VPS with proper domain

See [BROADCASTING.md](./BROADCASTING.md#-accessing-broadcasts-over-the-internet) for complete guide.

### Why can't others connect to my local network broadcast?
Common issues:
- **Firewall**: Allow Node.js through your firewall
- **Different network**: Ensure everyone is on the same WiFi
- **Wrong IP**: Double-check your local IP address
- **Port blocking**: Some routers block port 3000

### Can I change the port from 3000?
Yes! Use the `-p` flag:
```bash
npm run dev -- -H 0.0.0.0 -p 8080
```

## Technical Questions

### What audio formats are supported?
- MP3
- AAC
- OGG
- WebM (for custom broadcasts)

### Why do some HTTP streams not work?
If you're running the app over HTTPS, HTTP streams will fail due to mixed content restrictions. The app includes a proxy to handle this automatically.

### Can I add password protection?
The current implementation doesn't include authentication. To add it, you would need to:
1. Implement user authentication (NextAuth.js, Auth0, etc.)
2. Protect API routes with middleware
3. Add login UI components

### Does it work offline?
No, Revab Radio requires an internet connection to:
- Stream radio stations
- Access the app (unless self-hosted)
- Broadcast and listen to custom stations

### Can I customize the UI?
Yes! The app uses Tailwind CSS. You can:
- Edit `tailwind.config.js` for colors and theme
- Modify component files for layout changes
- Add custom CSS in `app/globals.css`

## Troubleshooting

### "Microphone access denied"
Your browser blocked microphone access:
1. Click the camera/microphone icon in the address bar
2. Grant permission to the site
3. Refresh and try again

### "Failed to start broadcast"
Possible causes:
- Microphone not connected or not working
- Browser doesn't support MediaRecorder API
- JavaScript errors (check browser console)

### Audio cuts out or stutters
Try these solutions:
1. Check your internet connection speed
2. Close other tabs/applications using bandwidth
3. Try a different radio station
4. Clear browser cache and reload

### Station shows "Loading" forever
The stream URL might be:
- Invalid or offline
- Blocked by CORS policy
- Requires special authentication
- Behind a paywall or geo-restriction

### Dark mode doesn't work
- Ensure you're using a modern browser
- Try manually toggling with the theme button
- Check browser console for JavaScript errors

## Deployment Questions

### What's the best hosting platform?
For Next.js apps:
- **Easiest**: Vercel (automatic deployments)
- **Free tier**: Railway, Render
- **Full control**: VPS (DigitalOcean, AWS, etc.)

### Do I need a database?
Not for basic functionality. The app uses:
- `localStorage` for user preferences
- In-memory storage for active broadcasts
- JSON files for station data

For production with many users, consider adding a database for:
- User authentication
- Persistent broadcasts
- Analytics

### How much does hosting cost?
- **Vercel/Netlify**: Free tier available
- **Railway**: Free tier, then ~$5-20/month
- **VPS**: $5-50/month depending on resources
- **Bandwidth**: Main cost for popular broadcasts

### Can I use a custom domain?
Yes! All major hosting platforms support custom domains:
- Vercel: Settings → Domains
- Railway: Settings → Public Networking
- VPS: Configure DNS and reverse proxy

## Contributing

### How can I contribute?
We welcome contributions! You can:
1. Report bugs via GitHub issues
2. Suggest features
3. Submit pull requests
4. Improve documentation
5. Share your experience

### I found a bug, what should I do?
1. Check if it's already reported in GitHub issues
2. If not, create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### Can I add more radio stations?
Yes! Edit `public/stations.json` and submit a pull request. Make sure:
- The stream URL is valid and legal
- You have permission to share the stream
- Station information is accurate

## Still have questions?

- Check the [README.md](./README.md) for general information
- See [BROADCASTING.md](./BROADCASTING.md) for broadcasting details
- Open an issue on [GitHub](https://github.com/IbsanjU/revab-radio/issues)

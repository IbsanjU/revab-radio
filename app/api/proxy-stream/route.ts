import { NextRequest, NextResponse } from 'next/server';

// List of allowed domains/patterns for streaming (security measure)
const ALLOWED_STREAM_PATTERNS = [
  /^https?:\/\/[^/]*\.bbc(media)?\.co\.uk\//,
  /^https?:\/\/[^/]*\.musicradio\.com\//,
  /^https?:\/\/[^/]*\.sharp-stream\.com\//,
  /^https?:\/\/[^/]*\.streamguys1?\.com\//,
  /^https?:\/\/[^/]*\.wnyc\.org\//,
  /^https?:\/\/[^/]*\.radioparadise\.com\//,
  /^https?:\/\/[^/]*\.somafm\.com\//,
  /^https?:\/\/[^/]*\.181fm\.com\//,
  /^https?:\/\/[^/]*\.cdnstream1\.com\//,
  /^https?:\/\/[^/]*\.fluxfm\.de\//,
  /^https?:\/\/[^/]*\.shoutca\.st\//,
  /^https?:\/\/[^/]*\.srg-ssr\.ch\//,
  /^https?:\/\/[^/]*\.radiofrance\.fr\//,
  /^https?:\/\/[^/]*\.infomaniak\.ch\//,
  /^https?:\/\/[^/]*\.webradio\.rockantenne\.de\//,
  /^https?:\/\/[^/]*\.sunshine-live\.de\//,
  /^https?:\/\/[^/]*\.radiobob\.de\//,
  /^https?:\/\/174\.36\.206\.197:\d+\//,  // Venice Classic Radio
  /^https?:\/\/ibizaglobalradio\.streaming-pro\.com:\d+\//,
  /^https?:\/\/hyades\.shoutca\.st:\d+\//,
];

// Block private IP ranges to prevent SSRF
const BLOCKED_IP_PATTERNS = [
  /^https?:\/\/(localhost|127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/,
];

function isAllowedUrl(url: string): boolean {
  // Block private IPs (except specifically allowed ones)
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(url)) {
      // Check if it's in the allowed list
      const isExplicitlyAllowed = ALLOWED_STREAM_PATTERNS.some(p => p.test(url));
      if (!isExplicitlyAllowed) {
        return false;
      }
    }
  }
  
  // Check against allowed patterns
  return ALLOWED_STREAM_PATTERNS.some(pattern => pattern.test(url));
}

export async function GET(request: NextRequest) {
  const streamUrl = request.nextUrl.searchParams.get('url');
  
  if (!streamUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Validate URL format (HTTP or HTTPS)
  if (!streamUrl.startsWith('http://') && !streamUrl.startsWith('https://')) {
    return new NextResponse('Invalid URL format', { status: 400 });
  }

  // Security: Validate against allowed domains to prevent SSRF
  if (!isAllowedUrl(streamUrl)) {
    return new NextResponse('URL not allowed. Only whitelisted streaming services are supported.', { status: 403 });
  }

  try {
    const response = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Icy-MetaData': '1',
      },
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to fetch stream');
    }

    // Get content type from the response or default to audio/mpeg
    const contentType = response.headers.get('Content-Type') || 'audio/mpeg';

    // Stream the response
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
      },
    });
  } catch (error) {
    console.error('Error proxying stream:', error);
    return new NextResponse('Failed to proxy stream', { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const streamUrl = request.nextUrl.searchParams.get('url');
  
  if (!streamUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Validate that the URL is HTTP (not HTTPS) for security
  if (!streamUrl.startsWith('http://') && !streamUrl.startsWith('https://')) {
    return new NextResponse('Invalid URL format', { status: 400 });
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

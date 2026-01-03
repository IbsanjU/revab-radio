import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for active broadcasts
// In production, this should use Redis or a database
const broadcasts = new Map<string, {
  stream: ReadableStream;
  controllers: Set<ReadableStreamDefaultController>;
  metadata: {
    stationName: string;
    genre: string;
    description: string;
    createdAt: Date;
  };
}>();

/**
 * GET endpoint - Listen to a broadcast stream
 */
export async function GET(request: NextRequest) {
  const stationId = request.nextUrl.searchParams.get('id');
  
  if (!stationId) {
    return new NextResponse('Missing station ID parameter', { status: 400 });
  }

  const broadcast = broadcasts.get(stationId);
  if (!broadcast) {
    return new NextResponse('Broadcast not found or not live', { status: 404 });
  }

  // Create a new stream for this listener
  let controller: ReadableStreamDefaultController;
  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      broadcast.controllers.add(controller);
    },
    cancel() {
      if (controller) {
        broadcast.controllers.delete(controller);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'X-Station-Name': broadcast.metadata.stationName,
      'X-Genre': broadcast.metadata.genre,
    },
  });
}

/**
 * POST endpoint - Start broadcasting
 */
export async function POST(request: NextRequest) {
  const stationId = request.nextUrl.searchParams.get('id');
  const stationName = request.nextUrl.searchParams.get('name');
  const genre = request.nextUrl.searchParams.get('genre') || 'Custom';
  const description = request.nextUrl.searchParams.get('description') || '';

  if (!stationId || !stationName) {
    return new NextResponse('Missing required parameters (id, name)', { status: 400 });
  }

  // Check if broadcast already exists
  if (broadcasts.has(stationId)) {
    return new NextResponse('Broadcast already active for this station ID', { status: 409 });
  }

  const controllers = new Set<ReadableStreamDefaultController>();
  
  // Create broadcast entry
  const broadcast = {
    stream: request.body as ReadableStream,
    controllers,
    metadata: {
      stationName,
      genre,
      description,
      createdAt: new Date(),
    },
  };

  broadcasts.set(stationId, broadcast);

  // Process incoming stream and distribute to all listeners
  try {
    const reader = request.body?.getReader();
    if (!reader) {
      throw new Error('No stream body provided');
    }

    // Read and broadcast chunks in the background
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Send chunk to all connected listeners
          for (const controller of controllers) {
            try {
              controller.enqueue(value);
            } catch (error) {
              // Remove failed controllers
              controllers.delete(controller);
            }
          }
        }
      } catch (error) {
        console.error('Error broadcasting stream:', error);
      } finally {
        // Cleanup when broadcast ends
        broadcasts.delete(stationId);
        // Close all listener streams
        for (const controller of controllers) {
          try {
            controller.close();
          } catch (e) {
            // Ignore errors on close
          }
        }
      }
    })();

    return new NextResponse(JSON.stringify({
      success: true,
      stationId,
      message: 'Broadcast started successfully',
      listeners: 0,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    broadcasts.delete(stationId);
    return new NextResponse('Failed to start broadcast', { status: 500 });
  }
}

/**
 * DELETE endpoint - Stop broadcasting
 */
export async function DELETE(request: NextRequest) {
  const stationId = request.nextUrl.searchParams.get('id');
  
  if (!stationId) {
    return new NextResponse('Missing station ID parameter', { status: 400 });
  }

  const broadcast = broadcasts.get(stationId);
  if (!broadcast) {
    return new NextResponse('Broadcast not found', { status: 404 });
  }

  // Close all listener streams
  for (const controller of broadcast.controllers) {
    try {
      controller.close();
    } catch (e) {
      // Ignore errors on close
    }
  }

  broadcasts.delete(stationId);

  return new NextResponse(JSON.stringify({
    success: true,
    message: 'Broadcast stopped successfully',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * OPTIONS endpoint for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

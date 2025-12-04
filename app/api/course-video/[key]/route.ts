import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

import { r2 } from '@/lib/r2'

// Configure runtime for streaming large files
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large file streaming

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const { key } = await params
    const decodedKey = decodeURIComponent(key)

    // Validate key format (should start with 'courses/')
    if (!decodedKey.startsWith('courses/')) {
      return NextResponse.json({ error: 'Invalid video key' }, { status: 400 })
    }

    const rangeHeader = request.headers.get('range') || undefined

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: decodedKey,
      Range: rangeHeader,
    })

    const response = await r2.send(command)

    if (!response.Body) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Stream directly from R2 instead of buffering large files into memory
    // This prevents loading entire video into memory and avoids 413 errors
    const nodeStream = response.Body as Readable

    // Convert Node.js Readable stream to Web ReadableStream for Next.js
    // Buffer extends Uint8Array, so it can be passed directly to ReadableStream
    const bodyStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => {
          try {
            // Convert Buffer to Uint8Array if needed (Buffer extends Uint8Array but ReadableStream prefers Uint8Array)
            const uint8Chunk =
              chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)
            controller.enqueue(uint8Chunk)
          } catch (error) {
            controller.error(error)
            nodeStream.destroy()
          }
        })
        nodeStream.on('end', () => {
          controller.close()
        })
        nodeStream.on('error', (err) => {
          controller.error(err)
        })
      },
      cancel() {
        nodeStream.destroy()
      },
    })

    // Propagate headers for range/streaming support
    const headers = new Headers({
      'Content-Type': response.ContentType || 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    })

    // Content-Length from R2 is already the partial length when range is present
    if (response.ContentLength !== undefined) {
      headers.set('Content-Length', response.ContentLength.toString())
    }

    if (response.ContentRange) {
      headers.set('Content-Range', response.ContentRange)
    }

    return new NextResponse(bodyStream, {
      status: rangeHeader ? 206 : 200,
      headers,
    })
  } catch (error) {
    console.error('Error fetching course video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 },
    )
  }
}

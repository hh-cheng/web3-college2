import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

import { r2 } from '@/lib/r2'

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

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: decodedKey,
    })

    const response = await r2.send(command)

    if (!response.Body) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Convert Readable stream to buffer
    const stream = response.Body as Readable
    const chunks: Buffer[] = []

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }

    const buffer = Buffer.concat(chunks)

    // Determine content type from response or default to video
    const contentType = response.ContentType || 'video/mp4'

    // Set appropriate headers for video streaming
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Length': buffer.length.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    })

    // Handle range requests for video streaming
    const range = request.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1
      const chunk = buffer.subarray(start, end + 1)
      const contentLength = end - start + 1

      headers.set('Content-Range', `bytes ${start}-${end}/${buffer.length}`)
      headers.set('Content-Length', contentLength.toString())

      return new NextResponse(chunk, {
        status: 206,
        headers,
      })
    }

    return new NextResponse(buffer, {
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

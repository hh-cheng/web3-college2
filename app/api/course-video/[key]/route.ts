import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

import { r2 } from '@/lib/r2'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } },
) {
  try {
    const { key } = params
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
    const bodyStream = Readable.toWeb(
      response.Body as Readable,
    ) as ReadableStream

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

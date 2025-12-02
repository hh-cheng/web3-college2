import { Readable } from 'stream'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

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
      return NextResponse.json({ error: 'Invalid image key' }, { status: 400 })
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: decodedKey,
    })

    const response = await r2.send(command)

    if (!response.Body) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Convert Readable stream to buffer
    const stream = response.Body as Readable
    const chunks: Buffer[] = []

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }

    const buffer = Buffer.concat(chunks)

    // Determine content type from response or default to image
    const contentType = response.ContentType || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error fetching course image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 },
    )
  }
}

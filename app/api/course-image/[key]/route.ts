import { NextRequest, NextResponse } from 'next/server'

import { createPresignedDownloadUrl } from '@/lib/r2'

// Configure runtime
export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const { key } = await params

    // Handle potential double encoding from Next.js Image Optimization
    let decodedKey: string
    try {
      decodedKey = decodeURIComponent(key)
      // If still encoded, decode again (handles double encoding)
      if (decodedKey.includes('%')) {
        decodedKey = decodeURIComponent(decodedKey)
      }
    } catch {
      // If decoding fails, use the key as-is
      decodedKey = key
    }

    // Validate key format (should start with 'courses/')
    if (!decodedKey.startsWith('courses/')) {
      console.error('Invalid image key format:', decodedKey)
      return NextResponse.json({ error: 'Invalid image key' }, { status: 400 })
    }

    // Generate presigned URL for direct download from R2
    // This bypasses AWS Amplify's response size limit and works with Next.js Image Optimization
    const result = await createPresignedDownloadUrl(decodedKey, 3600) // 1 hour expiry

    if (!result.success || !result.url) {
      console.error(
        'Failed to generate presigned URL for key:',
        decodedKey,
        result.msg,
      )
      return NextResponse.json(
        { error: result.msg || 'Failed to generate image URL' },
        { status: 500 },
      )
    }

    // Fetch the image from R2 and stream it back
    // Next.js Image Optimization requires the actual image data, not a redirect
    const imageResponse = await fetch(result.url)

    if (!imageResponse.ok) {
      console.error(
        'Failed to fetch image from R2:',
        imageResponse.status,
        decodedKey,
      )
      return NextResponse.json(
        { error: 'Image not found in storage' },
        { status: 404 },
      )
    }

    // Stream the image instead of buffering to avoid memory issues
    const contentType =
      imageResponse.headers.get('content-type') || 'image/jpeg'
    const contentLength = imageResponse.headers.get('content-length')

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    })

    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    // Stream the response body directly
    return new NextResponse(imageResponse.body, {
      headers,
    })
  } catch (error) {
    console.error('Error fetching course image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 },
    )
  }
}

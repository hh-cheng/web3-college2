import { NextRequest, NextResponse } from 'next/server'

import { createPresignedDownloadUrl } from '@/lib/r2'

// Configure runtime
export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Iteratively decode a URL-encoded string until no more encoding remains.
 * Handles cases where Next.js Image Optimization may encode URLs multiple times.
 */
function decodeKeyIteratively(encodedKey: string): string {
  let decoded = encodedKey
  let previousDecoded = ''
  let iterations = 0
  const maxIterations = 10 // Safety limit to prevent infinite loops

  // Keep decoding until no more encoded characters remain or we reach max iterations
  while (decoded !== previousDecoded && iterations < maxIterations) {
    previousDecoded = decoded
    try {
      const nextDecoded = decodeURIComponent(decoded)
      // Only update if decoding actually changed something
      if (nextDecoded !== decoded) {
        decoded = nextDecoded
        iterations++
      } else {
        break
      }
    } catch {
      // If decoding fails, stop and return what we have
      break
    }
  }

  return decoded
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const originalKey = await params.then((p) => p.key)
  let decodedKey: string

  try {
    // Handle potential multiple levels of encoding from Next.js Image Optimization
    decodedKey = decodeKeyIteratively(originalKey)

    // Log decoding details for debugging
    if (decodedKey !== originalKey) {
      console.log(
        `[course-image] Decoded key: "${originalKey}" -> "${decodedKey}"`,
      )
    }
  } catch (error) {
    // If decoding fails completely, use the key as-is
    console.error(
      `[course-image] Failed to decode key "${originalKey}":`,
      error,
    )
    decodedKey = originalKey
  }

  // Validate key format (should start with 'courses/')
  if (!decodedKey || !decodedKey.startsWith('courses/')) {
    console.error(
      `[course-image] Invalid key format. Original: "${originalKey}", Decoded: "${decodedKey}"`,
    )
    return NextResponse.json(
      {
        error: 'Invalid image key format',
        details: 'Key must start with "courses/"',
      },
      { status: 400 },
    )
  }

  try {
    // Generate presigned URL for direct download from R2
    // This bypasses AWS Amplify's response size limit and works with Next.js Image Optimization
    const result = await createPresignedDownloadUrl(decodedKey, 3600) // 1 hour expiry

    if (!result.success || !result.url) {
      console.error(
        `[course-image] Failed to generate presigned URL. Key: "${decodedKey}", Original: "${originalKey}", Error: ${result.msg}`,
      )
      return NextResponse.json(
        {
          error: 'Failed to generate image URL',
          details: result.msg || 'R2 service error',
        },
        { status: 500 },
      )
    }

    // Fetch the image from R2 and stream it back
    // Next.js Image Optimization requires the actual image data, not a redirect
    const imageResponse = await fetch(result.url)

    if (!imageResponse.ok) {
      console.error(
        `[course-image] Failed to fetch image from R2. Status: ${imageResponse.status}, Key: "${decodedKey}", Original: "${originalKey}"`,
      )
      return NextResponse.json(
        {
          error: 'Image not found in storage',
          details: `R2 returned status ${imageResponse.status}`,
        },
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
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(
      `[course-image] Unexpected error. Original key: "${originalKey}", Error: ${errorMessage}`,
      error,
    )
    return NextResponse.json(
      {
        error: 'Failed to fetch image',
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

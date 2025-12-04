import { NextRequest, NextResponse } from 'next/server'

import { createPresignedDownloadUrl } from '@/lib/r2'

// Configure runtime
export const runtime = 'nodejs'
export const maxDuration = 30 // Reduced since we're just generating URLs

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

    // Generate presigned URL for direct download from R2
    // This bypasses AWS Amplify's 10MB response size limit
    const result = await createPresignedDownloadUrl(decodedKey, 3600) // 1 hour expiry

    if (!result.success || !result.url) {
      return NextResponse.json(
        { error: result.msg || 'Failed to generate video URL' },
        { status: 500 },
      )
    }

    // Redirect to presigned URL - browser downloads directly from R2
    // This completely bypasses Amplify's response size limitations
    return NextResponse.redirect(result.url, {
      status: 307, // Temporary redirect
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache redirect for 1 hour
      },
    })
  } catch (error) {
    console.error('Error fetching course video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 },
    )
  }
}

'use server'
import { catchError, firstValueFrom, from, map, mergeMap, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'
import { createPresignedUploadUrl } from '@/lib/r2'

export type UploadCourseResult =
  | { success: true; data: { courseId: number }; msg: null }
  | { success: false; data: null; msg: string }

export type PresignedUploadResult =
  | {
      success: true
      data: {
        cover: { url: string; key: string }
        video: { url: string; key: string }
      }
      msg: null
    }
  | { success: false; data: null; msg: string }

export async function createUploadUrls(
  coverFileName: string,
  coverType: string,
  videoFileName: string,
  videoType: string,
): Promise<PresignedUploadResult> {
  if (!coverFileName || !coverType || !videoFileName || !videoType) {
    return {
      success: false,
      data: null,
      msg: 'Cover and video file details are required',
    }
  }

  try {
    const [coverResult, videoResult] = await Promise.all([
      createPresignedUploadUrl('courses', coverFileName, coverType),
      createPresignedUploadUrl('courses', videoFileName, videoType),
    ])

    if (!coverResult.success || !coverResult.key || !coverResult.url) {
      return {
        success: false,
        data: null,
        msg: coverResult.msg || 'Failed to create cover upload URL',
      }
    }

    if (!videoResult.success || !videoResult.key || !videoResult.url) {
      return {
        success: false,
        data: null,
        msg: videoResult.msg || 'Failed to create video upload URL',
      }
    }

    return {
      success: true,
      data: {
        cover: { url: coverResult.url, key: coverResult.key },
        video: { url: videoResult.url, key: videoResult.key },
      },
      msg: null,
    }
  } catch (error: any) {
    console.error('Error creating upload URLs:', error)
    return {
      success: false,
      data: null,
      msg: error?.message || 'Failed to create upload URLs',
    }
  }
}

export async function saveCourse(
  title: string,
  price: string,
  coverKey: string,
  videoKey: string,
  creatorAddress: string,
  chainId: number,
  courseOnchainId: string,
): Promise<UploadCourseResult> {
  // Validate required fields
  if (!title || !price || !coverKey || !videoKey || !creatorAddress) {
    return {
      success: false,
      data: null,
      msg: 'All fields are required',
    }
  }

  // Validate price is a valid number
  const priceNum = parseFloat(price)
  if (isNaN(priceNum) || priceNum < 0) {
    return {
      success: false,
      data: null,
      msg: 'Price must be a valid positive number',
    }
  }

  return await firstValueFrom(
    from(getPrisma()).pipe(
      mergeMap((prisma) => {
        return from(
          prisma.courses.create({
            data: {
              course_onchain_id: courseOnchainId,
              creator_address: creatorAddress,
              chain_id: chainId,
              title,
              price,
              key: videoKey,
              cover_key: coverKey,
            },
          }),
        )
      }),
      map((course) => {
        return {
          success: true,
          data: { courseId: course.id },
          msg: null,
        } as UploadCourseResult
      }),
      catchError((error) => {
        console.error('Error saving course:', error)
        return of({
          success: false,
          data: null,
          msg: error.message || 'Failed to save course',
        } as UploadCourseResult)
      }),
    ),
  )
}

'use server'
import { catchError, firstValueFrom, from, map, mergeMap, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/r2'

export type UploadCourseResult =
  | { success: true; data: { courseId: number }; msg: null }
  | { success: false; data: null; msg: string }

export async function uploadCourse(
  title: string,
  price: string,
  coverImage: File,
  video: File,
  creatorAddress: string,
  chainId: number,
  courseOnchainId: string,
): Promise<UploadCourseResult> {
  // Validate required fields
  if (!title || !price || !coverImage || !video || !creatorAddress) {
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
    from(
      Promise.all([
        uploadFile(coverImage, 'courses'),
        uploadFile(video, 'courses'),
      ]),
    ).pipe(
      mergeMap(([coverResult, videoResult]) => {
        // Check if cover image upload failed
        if (!coverResult.success || !coverResult.key) {
          return of({
            success: false,
            data: null,
            msg: `Failed to upload cover image: ${coverResult.msg || 'Unknown error'}`,
          } as UploadCourseResult)
        }

        // Check if video upload failed
        if (!videoResult.success || !videoResult.key) {
          return of({
            success: false,
            data: null,
            msg: `Failed to upload video: ${videoResult.msg || 'Unknown error'}`,
          } as UploadCourseResult)
        }

        // Write to database with the provided on-chain course ID
        return from(getPrisma()).pipe(
          mergeMap((prisma) => {
            return from(
              prisma.courses.create({
                data: {
                  course_onchain_id: courseOnchainId,
                  creator_address: creatorAddress,
                  chain_id: chainId,
                  title,
                  price,
                  key: videoResult.key,
                  cover_key: coverResult.key,
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
        )
      }),
      catchError((error) => {
        console.error('Error uploading course:', error)
        return of({
          success: false,
          data: null,
          msg: error.message || 'Failed to upload course',
        } as UploadCourseResult)
      }),
    ),
  )
}

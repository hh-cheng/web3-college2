'use server'
import { format } from 'date-fns'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'

export type GetUploadedCoursesResult =
  | {
      success: true
      data: Array<{
        id: number
        title: string
        price: string
        cover_key: string
        created_at: string
        course_onchain_id: string
      }>
      msg: null
    }
  | { success: false; data: []; msg: string }

export async function getUploadedCourses(
  creatorAddress: string,
  chainID: number,
): Promise<GetUploadedCoursesResult> {
  if (!creatorAddress || !chainID) {
    return {
      success: false,
      data: [],
      msg: 'Creator address and chain ID are required',
    }
  }

  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        // Use Prisma raw SQL query to fetch courses by creator
        const query = `
          SELECT 
            id,
            title,
            price,
            cover_key,
            created_at,
            course_onchain_id
          FROM "Courses"
          WHERE creator_address = $1 AND chain_id = $2
          ORDER BY created_at DESC
        `

        return from(
          prisma.$queryRawUnsafe<
            Array<{
              id: number
              title: string
              price: string
              cover_key: string
              created_at: Date
              course_onchain_id: string
            }>
          >(query, creatorAddress, chainID),
        )
      }),
      map((courses) => {
        return courses.map((course) => {
          return {
            id: course.id,
            title: course.title,
            price: course.price,
            cover_key: course.cover_key,
            created_at: format(course.created_at, 'yyyy-MM-dd HH:mm:ss'),
            course_onchain_id: course.course_onchain_id,
          }
        })
      }),
      map((courses) => {
        return {
          success: true as const,
          data: courses,
          msg: null,
        } as GetUploadedCoursesResult
      }),
      catchError((err) => {
        console.log('err in getUploadedCourses', JSON.stringify(err, null, 2))
        return of({
          success: false as const,
          data: [],
          msg: err.message,
        } as GetUploadedCoursesResult)
      }),
    ),
  )
}

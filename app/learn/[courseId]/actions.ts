'use server'
import { format } from 'date-fns'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'

export type GetCourseByIdResult =
  | {
      success: true
      data: {
        id: number
        key: string
        title: string
        price: string
        cover_key: string
        created_at: string
        course_onchain_id: string
        creator_address: string
        isOwned: boolean
      }
      msg: null
    }
  | { success: false; data: null; msg: string }

export async function getCourseById(
  courseId: number,
  chainID: number,
  userAddress?: string,
): Promise<GetCourseByIdResult> {
  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        const query = userAddress
          ? `
          SELECT 
            c.id,
            c.key,
            c.title,
            c.price,
            c.cover_key,
            c.created_at,
            c.course_onchain_id,
            c.creator_address,
            CASE 
              WHEN c.creator_address = $3 THEN true
              WHEN EXISTS (
                SELECT 1 FROM "Purchases" p 
                WHERE p.course_onchain_id = c.course_onchain_id 
                AND p.buyer_address = $3 
                AND p.chain_id = $2
              ) THEN true
              ELSE false
            END as "isOwned"
          FROM "Courses" c
          WHERE c.id = $1 AND c.chain_id = $2
          LIMIT 1
        `
          : `
          SELECT 
            c.id,
            c.key,
            c.title,
            c.price,
            c.cover_key,
            c.created_at,
            c.course_onchain_id,
            c.creator_address,
            false as "isOwned"
          FROM "Courses" c
          WHERE c.id = $1 AND c.chain_id = $2
          LIMIT 1
        `

        const params = userAddress
          ? [courseId, chainID, userAddress]
          : [courseId, chainID]

        return from(
          prisma.$queryRawUnsafe<
            Array<{
              id: number
              key: string
              title: string
              price: string
              cover_key: string
              created_at: Date
              course_onchain_id: string
              creator_address: string
              isOwned: boolean
            }>
          >(query, ...params),
        )
      }),
      map((courses) => {
        if (courses.length === 0) {
          return {
            success: false as const,
            data: null,
            msg: 'Course not found',
          } as GetCourseByIdResult
        }

        const course = courses[0]
        return {
          success: true as const,
          data: {
            id: course.id,
            key: course.key,
            title: course.title,
            price: course.price,
            cover_key: course.cover_key,
            created_at: format(course.created_at, 'yyyy-MM-dd HH:mm:ss'),
            course_onchain_id: course.course_onchain_id,
            creator_address: course.creator_address,
            isOwned: course.isOwned,
          },
          msg: null,
        } as GetCourseByIdResult
      }),
      catchError((err) => {
        console.log('err in getCourseById', JSON.stringify(err, null, 2))
        return of({
          success: false as const,
          data: null,
          msg: err.message,
        } as GetCourseByIdResult)
      }),
    ),
  )
}

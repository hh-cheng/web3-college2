'use server'
import { format } from 'date-fns'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'

export async function getCourses(chainID: number) {
  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        // Use Prisma raw SQL query to fetch courses
        const query = `
          SELECT 
            id,
            key,
            title,
            price,
            cover_key,
            created_at,
            updated_at
          FROM "Courses"
          WHERE chain_id = $1
          ORDER BY created_at DESC
        `

        return from(
          prisma.$queryRawUnsafe<
            Array<{
              id: number
              key: string
              title: string
              price: string
              cover_key: string
              created_at: Date
              updated_at: Date
            }>
          >(query, chainID),
        )
      }),
      map((courses) => {
        return courses.map((course) => {
          return {
            id: course.id,
            key: course.key,
            title: course.title,
            price: course.price,
            cover_key: course.cover_key,
            created_at: format(course.created_at, 'yyyy-MM-dd HH:mm:ss'),
            updated_at: format(course.updated_at, 'yyyy-MM-dd HH:mm:ss'),
          }
        })
      }),
      map((courses) => {
        return { success: true, data: courses, msg: null }
      }),
      catchError((err) => {
        console.log('err in getCourses', JSON.stringify(err, null, 2))
        return of({ success: false, data: [], msg: err.message })
      }),
    ),
  )
}

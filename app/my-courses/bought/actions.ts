'use server'
import { format } from 'date-fns'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'

export type GetBoughtCoursesResult =
  | {
      success: true
      data: Array<{
        id: number
        title: string
        price: string
        cover_key: string
        course_onchain_id: string
        purchase_date: string
        tx_hash: string
      }>
      msg: null
    }
  | { success: false; data: []; msg: string }

export async function getBoughtCourses(
  buyerAddress: string,
  chainID: number,
): Promise<GetBoughtCoursesResult> {
  if (!buyerAddress || !chainID) {
    return {
      success: false,
      data: [],
      msg: 'Buyer address and chain ID are required',
    }
  }

  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        // Use Prisma raw SQL query to fetch purchases joined with courses
        const query = `
          SELECT 
            c.id,
            c.title,
            c.price,
            c.cover_key,
            c.course_onchain_id,
            p.created_at as purchase_date,
            p.tx_hash
          FROM "Purchases" p
          INNER JOIN "Courses" c ON p.course_onchain_id = c.course_onchain_id
          WHERE p.buyer_address = $1 AND p.chain_id = $2
          ORDER BY p.created_at DESC
        `

        return from(
          prisma.$queryRawUnsafe<
            Array<{
              id: number
              title: string
              price: string
              cover_key: string
              course_onchain_id: string
              purchase_date: Date
              tx_hash: string
            }>
          >(query, buyerAddress, chainID),
        )
      }),
      map((results) => {
        return results.map((result) => {
          return {
            id: result.id,
            title: result.title,
            price: result.price,
            cover_key: result.cover_key,
            course_onchain_id: result.course_onchain_id,
            purchase_date: format(result.purchase_date, 'yyyy-MM-dd HH:mm:ss'),
            tx_hash: result.tx_hash,
          }
        })
      }),
      map((courses) => {
        return {
          success: true as const,
          data: courses,
          msg: null,
        } as GetBoughtCoursesResult
      }),
      catchError((err) => {
        console.log('err in getBoughtCourses', JSON.stringify(err, null, 2))
        return of({
          success: false as const,
          data: [],
          msg: err.message,
        } as GetBoughtCoursesResult)
      }),
    ),
  )
}

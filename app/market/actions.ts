'use server'
import { format } from 'date-fns'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'
import type { CourseWithOwnership } from './types'

export async function createPurchaseRecord(params: {
  courseOnchainId: string
  buyerAddress: string
  txHash: string
  chainID: number
  amount: string
}) {
  const { courseOnchainId, buyerAddress, txHash, chainID, amount } = params

  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap(async (prisma) => {
        // Check if purchase already exists
        const existing = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
          `
          SELECT id FROM "Purchases"
          WHERE course_onchain_id = $1 AND buyer_address = $2 AND chain_id = $3
        `,
          courseOnchainId,
          buyerAddress,
          chainID,
        )

        if (existing.length > 0) {
          return { success: true, msg: 'Purchase record already exists' }
        }

        // Insert purchase record
        await prisma.$executeRawUnsafe(
          `
          INSERT INTO "Purchases" (course_onchain_id, buyer_address, tx_hash, chain_id, amount, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `,
          courseOnchainId,
          buyerAddress,
          txHash,
          chainID,
          amount,
        )

        return { success: true, msg: null }
      }),
      catchError((err) => {
        console.log('err in createPurchaseRecord', JSON.stringify(err, null, 2))
        return of({ success: false, msg: err.message })
      }),
    ),
  )
}

export async function getCourses(
  chainID: number,
  userAddress?: string,
): Promise<
  | { success: true; data: CourseWithOwnership[]; msg: null }
  | { success: false; data: []; msg: string }
> {
  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        // Use Prisma raw SQL query to fetch courses with ownership check
        const query = userAddress
          ? `
          SELECT 
            c.id,
            c.key,
            c.title,
            c.price,
            c.cover_key,
            c.created_at,
            c.updated_at,
            c.course_onchain_id,
            c.creator_address,
            CASE 
              WHEN c.creator_address = $2 THEN true
              WHEN EXISTS (
                SELECT 1 FROM "Purchases" p 
                WHERE p.course_onchain_id = c.course_onchain_id 
                AND p.buyer_address = $2 
                AND p.chain_id = $1
              ) THEN true
              ELSE false
            END as "isOwned"
          FROM "Courses" c
          WHERE c.chain_id = $1
          ORDER BY c.created_at DESC
        `
          : `
          SELECT 
            c.id,
            c.key,
            c.title,
            c.price,
            c.cover_key,
            c.created_at,
            c.updated_at,
            c.course_onchain_id,
            c.creator_address,
            false as "isOwned"
          FROM "Courses" c
          WHERE c.chain_id = $1
          ORDER BY c.created_at DESC
        `

        const params = userAddress ? [chainID, userAddress] : [chainID]

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
              course_onchain_id: string
              creator_address: string
              isOwned: boolean
            }>
          >(query, ...params),
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
            course_onchain_id: course.course_onchain_id,
            creator_address: course.creator_address,
            isOwned: course.isOwned,
          }
        })
      }),
      map((courses) => {
        return { success: true as const, data: courses, msg: null }
      }),
      catchError((err) => {
        console.log('err in getCourses', JSON.stringify(err, null, 2))
        return of({
          success: false as const,
          data: [] as [],
          msg: err.message as string,
        })
      }),
    ),
  )
}

'use server'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'

export type UserData = {
  id: number
  wallet_address: string
  nickname: string | null
  avatar: string | null
}

export type GetOrCreateUserResult =
  | { success: true; data: UserData; msg: null }
  | { success: false; data: null; msg: string }

export async function getOrCreateUser(
  walletAddress: string,
): Promise<GetOrCreateUserResult> {
  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        // Use upsert to atomically find or create user
        return from(
          prisma.users.upsert({
            where: {
              wallet_address: walletAddress,
            },
            update: {
              // If user exists, just return it (no updates needed)
            },
            create: {
              wallet_address: walletAddress,
              nickname: walletAddress, // Default nickname is the address
            },
            select: {
              id: true,
              wallet_address: true,
              nickname: true,
              avatar: true,
            },
          }),
        )
      }),
      map((user): GetOrCreateUserResult => {
        return { success: true, data: user, msg: null }
      }),
      catchError((err) => {
        console.error('err in getOrCreateUser', JSON.stringify(err, null, 2))
        return of<GetOrCreateUserResult>({
          success: false,
          data: null,
          msg: err.message || 'Failed to sync user',
        })
      }),
    ),
  )
}

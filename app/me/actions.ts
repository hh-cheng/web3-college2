'use server'
import { catchError, concatMap, firstValueFrom, from, map, of } from 'rxjs'

import { getPrisma } from '@/lib/prisma'

export type UpdateNicknameResult =
  | { success: true; data: { nickname: string | null }; msg: null }
  | { success: false; data: null; msg: string }

const MAX_NICKNAME_LENGTH = 50

export async function updateNickname(
  walletAddress: string,
  nickname: string,
): Promise<UpdateNicknameResult> {
  // Validation
  const trimmedNickname = nickname.trim()
  if (trimmedNickname.length === 0) {
    return {
      success: false,
      data: null,
      msg: 'Nickname cannot be empty',
    }
  }

  if (trimmedNickname.length > MAX_NICKNAME_LENGTH) {
    return {
      success: false,
      data: null,
      msg: `Nickname cannot exceed ${MAX_NICKNAME_LENGTH} characters`,
    }
  }

  return await firstValueFrom(
    from(getPrisma()).pipe(
      concatMap((prisma) => {
        return from(
          prisma.users.update({
            where: {
              wallet_address: walletAddress,
            },
            data: {
              nickname: trimmedNickname,
            },
            select: {
              nickname: true,
            },
          }),
        )
      }),
      map((user): UpdateNicknameResult => {
        return { success: true, data: { nickname: user.nickname }, msg: null }
      }),
      catchError((err) => {
        console.error('err in updateNickname', JSON.stringify(err, null, 2))
        return of<UpdateNicknameResult>({
          success: false,
          data: null,
          msg: err.message || 'Failed to update nickname',
        })
      }),
    ),
  )
}

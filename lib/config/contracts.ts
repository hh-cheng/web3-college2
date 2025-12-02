'use client'

export const YD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_YD_TOKEN_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

export const COURSE_MANAGER_ADDRESS = (process.env
  .NEXT_PUBLIC_COURSE_MANAGER_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔍 Contract Addresses:', {
    YD_TOKEN_ADDRESS,
    COURSE_MANAGER_ADDRESS,
    env_YD_TOKEN: process.env.NEXT_PUBLIC_YD_TOKEN_ADDRESS,
    env_COURSE_MANAGER: process.env.NEXT_PUBLIC_COURSE_MANAGER_ADDRESS,
  })
}

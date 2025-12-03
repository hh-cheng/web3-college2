'use client'

export const YD_TOKEN_ADDRESS = (process.env.YDTOKEN_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

export const COURSE_MANAGER_ADDRESS = (process.env.COURSE_MANAGER_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔍 Contract Addresses:', {
    YD_TOKEN_ADDRESS,
    COURSE_MANAGER_ADDRESS,
    env_YD_TOKEN: process.env.YDTOKEN_ADDRESS,
    env_COURSE_MANAGER: process.env.COURSE_MANAGER_ADDRESS,
  })
}

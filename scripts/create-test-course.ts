#!/usr/bin/env tsx
/**
 * Create a test course on-chain
 * Usage: tsx scripts/create-test-course.ts
 */

import { createWalletClient, createPublicClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import CourseManagerABI from '../app/abi/CourseManager.json'

// Anvil default account #0
const PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const COURSE_MANAGER_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

const walletClient = createWalletClient({
  account,
  chain: foundry,
  transport: http('http://127.0.0.1:8545'),
})

const publicClient = createPublicClient({
  chain: foundry,
  transport: http('http://127.0.0.1:8545'),
})

async function createCourse() {
  console.log('Creating test course on-chain...')
  console.log('Creator address:', account.address)

  // Course details
  const price = BigInt(10) // 10 YD tokens (no decimals)
  const metadataUri = 'ipfs://test-course-metadata-uri'

  try {
    const hash = await walletClient.writeContract({
      address: COURSE_MANAGER_ADDRESS as `0x${string}`,
      abi: CourseManagerABI.abi,
      functionName: 'createCourse',
      args: [price, metadataUri],
    })

    console.log('Transaction hash:', hash)
    console.log('Waiting for confirmation...')

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('✅ Course created successfully!')
    console.log('Block number:', receipt.blockNumber)
    console.log('Gas used:', receipt.gasUsed.toString())

    // Get the course ID from logs
    const courseCreatedLog = receipt.logs.find(
      (log: any) =>
        log.topics[0] ===
        '0x4d03f9e5c1c3e6d5e1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e', // CourseCreated event
    )

    if (courseCreatedLog) {
      const courseId = BigInt(courseCreatedLog.topics[1] as string)
      console.log('\n📚 Course ID:', courseId.toString())
      console.log('Price:', price.toString(), 'YD tokens')
      console.log('Metadata URI:', metadataUri)
    }
  } catch (error: any) {
    console.error('❌ Error creating course:', error.message)
    throw error
  }
}

createCourse()
  .then(() => {
    console.log('\n✅ Done! You can now purchase this course.')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

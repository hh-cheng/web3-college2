#!/usr/bin/env tsx
/**
 * Send ETH to a test account
 * Usage: tsx scripts/fund-account.ts
 */

import { createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'

// Anvil default account #0 (has 10,000 ETH)
const PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

const walletClient = createWalletClient({
  account,
  chain: foundry,
  transport: http('http://127.0.0.1:8545'),
})

// Account #1 address
const TO_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

async function fundAccount() {
  console.log('Sending 100 ETH from Account #0 to Account #1...')
  console.log('From:', account.address)
  console.log('To:', TO_ADDRESS)

  try {
    const hash = await walletClient.sendTransaction({
      to: TO_ADDRESS as `0x${string}`,
      value: parseEther('100'),
    })

    console.log('✅ Transaction sent:', hash)
    console.log('Account #1 now has ETH for gas!')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

fundAccount()

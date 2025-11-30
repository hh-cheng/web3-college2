'use server'
import { PrismaPg } from '@prisma/adapter-pg'

import { buildPgUrl } from './secret'
import { PrismaClient } from '../app/generated/prisma/client' // ✅ CRITICAL: Include /client

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | null
}

async function getPrismaClient(): Promise<PrismaClient> {
  // Return existing client if available
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Build database URL with credentials from AWS Secrets Manager
  const databaseUrl = await buildPgUrl()

  // Create adapter with connection string
  const adapter = new PrismaPg({ connectionString: databaseUrl })

  // Create Prisma client with adapter (required for Rust-free engine)
  const client = new PrismaClient({ adapter })

  // Cache client globally to avoid creating multiple instances
  globalForPrisma.prisma = client

  return client
}

// Export async getter for the Prisma client
export async function getPrisma(): Promise<PrismaClient> {
  return getPrismaClient()
}

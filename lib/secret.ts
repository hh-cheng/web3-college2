'use server'

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'

const secretName = process.env.DB_SECRET_ID!

// AWS SDK automatically uses credential chain (env vars, IAM role, etc.)
// No need to manually configure credentials - AWS SDK handles this
const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-2',
})

type AwsDbSecret = {
  username: string
  password: string
}

const TTL_MS = 5 * 60 * 1000 // 5 minute cache to reduce API calls
let cached: { secret?: AwsDbSecret; fetchedAt?: number } = {}

export async function getDbPassword(): Promise<string> {
  const now = Date.now()

  // Return cached password if still valid
  if (cached.secret && cached.fetchedAt && now - cached.fetchedAt < TTL_MS) {
    return cached.secret.password
  }

  // Fetch from AWS Secrets Manager
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    )

    if (!response.SecretString) {
      throw new Error('Secret string is empty')
    }

    const secret = JSON.parse(response.SecretString) as AwsDbSecret
    cached = { secret, fetchedAt: now }
    return secret.password
  } catch (error) {
    // For a list of exceptions thrown, see:
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.error('Error fetching secret from AWS Secrets Manager:', error)
    console.error('Secret ID:', secretName)
    throw error
  }
}

export async function buildPgUrl(): Promise<string> {
  const password = await getDbPassword()
  const username = process.env.DB_USERNAME!
  const dbName = process.env.DB_NAME
  const host = process.env.RDS_PROXY_HOST
  const port = parseInt(process.env.DB_PORT || '5432', 10)

  if (!dbName || !host) {
    throw new Error('DB_NAME and RDS_PROXY_HOST must be set')
  }

  // URL encode to handle special characters
  const encodedUsername = encodeURIComponent(username)
  const encodedPassword = encodeURIComponent(password)
  const encodedDbName = encodeURIComponent(dbName)

  const params = process.env.DB_CONN_PARAMS || 'sslmode=require'
  const queryString = params ? `?${params}` : ''

  return `postgresql://${encodedUsername}:${encodedPassword}@${host}:${port}/${encodedDbName}${queryString}`
}

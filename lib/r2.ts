import type { Readable } from 'stream'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { catchError, firstValueFrom, from, map, mergeMap, of } from 'rxjs'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
})

export type UploadFileResult =
  | { success: true; key: string; msg: null }
  | { success: false; key: null; msg: string }

export type PresignedUrlResult =
  | { success: true; key: string; url: string; msg: null }
  | { success: false; key: null; url: null; msg: string }

export async function uploadFile(
  file: File,
  type: 'courses' | 'users',
): Promise<UploadFileResult> {
  return await firstValueFrom(
    from(file.arrayBuffer()).pipe(
      mergeMap((buffer) => {
        const key = `${type}/${Date.now()}-${file.name}`
        const command = new PutObjectCommand({
          Key: key,
          ContentType: file.type,
          Body: Buffer.from(buffer),
          Bucket: process.env.R2_BUCKET!,
        })

        return from(r2.send(command)).pipe(map(() => ({ key })))
      }),
      map(({ key }): UploadFileResult => {
        return { success: true as const, key, msg: null }
      }),
      catchError((error) => {
        return of({
          success: false as const,
          key: null,
          msg: error.message,
        } as UploadFileResult)
      }),
    ),
  )
}

export async function createPresignedUploadUrl(
  type: 'courses' | 'users',
  fileName: string,
  contentType: string,
): Promise<PresignedUrlResult> {
  try {
    const key = `${type}/${Date.now()}-${fileName}`
    const command = new PutObjectCommand({
      Key: key,
      ContentType: contentType,
      Bucket: process.env.R2_BUCKET!,
    })

    const url = await getSignedUrl(r2, command, { expiresIn: 60 * 10 })

    return {
      success: true as const,
      key,
      url,
      msg: null,
    }
  } catch (error: any) {
    return {
      success: false as const,
      key: null,
      url: null,
      msg: error?.message || 'Failed to generate upload URL',
    }
  }
}

export async function readFile(key: string) {
  return await firstValueFrom(
    from(
      r2.send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
        }),
      ),
    ).pipe(
      map((res) => {
        return { success: true, data: res.Body as Readable }
      }),
      catchError((error) => {
        return of({ success: false, msg: error.message })
      }),
    ),
  )
}

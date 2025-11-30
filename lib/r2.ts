'use server'
import type { Readable } from 'stream'
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

export async function uploadFile(file: File, type: 'courses' | 'users') {
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

        return from(r2.send(command))
      }),
      map(() => {
        return { success: true, msg: null }
      }),
      catchError((error) => {
        return of({ success: false, msg: error.message })
      }),
    ),
  )
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

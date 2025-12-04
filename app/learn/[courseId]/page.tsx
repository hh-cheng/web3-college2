'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { getCourseById } from './actions'
import useWeb3 from '@/lib/hooks/useWeb3'

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { address, chainID } = useWeb3()

  const { data, isLoading, error } = useQuery({
    enabled: !!courseId && !!chainID,
    queryKey: ['course', courseId, chainID, address],
    queryFn: () =>
      getCourseById(Number(courseId), chainID!, address || undefined),
  })

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-12 bg-muted rounded-md animate-pulse" />
        <div className="aspect-video bg-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/market')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market
        </Button>
        <div className="p-12 border rounded-lg text-center">
          <p className="text-destructive mb-4">
            {data?.msg || 'Failed to load course'}
          </p>
          <Button onClick={() => router.push('/market')} variant="outline">
            Go to Market
          </Button>
        </div>
      </div>
    )
  }

  const course = data.data

  if (!course.isOwned) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/market')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market
        </Button>
        <div className="p-12 border border-destructive rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have access to this course. Please purchase it first.
          </p>
          <Button onClick={() => router.push('/market')} variant="default">
            Go to Market
          </Button>
        </div>
      </div>
    )
  }

  const videoUrl = `/api/course-video/${encodeURIComponent(course.key)}`

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Button
        variant="ghost"
        className="mb-4 cursor-pointer"
        onClick={() => router.push('/market')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Market
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Price: {course.price} ETH</span>
          <span>Created: {course.created_at}</span>
        </div>
      </div>

      {course.cover_key && (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <Image
            fill
            alt={course.title}
            src={`/api/course-image/${course.cover_key}`}
            unoptimized
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full"
          src={videoUrl}
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

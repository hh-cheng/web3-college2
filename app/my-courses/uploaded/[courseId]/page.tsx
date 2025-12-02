'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import useUploadedCourses from '../service'
import { Button } from '@/components/ui/button'

export default function CourseVideoPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { data } = useUploadedCourses()

  const course = data?.success
    ? data.data.find((c) => c.id.toString() === courseId)
    : null

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/my-courses/uploaded')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Uploaded Courses
        </Button>
        <div className="p-12 border rounded-lg text-center">
          <p className="text-muted-foreground">Course not found</p>
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
        onClick={() => router.push('/my-courses/uploaded')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Uploaded Courses
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Price: {course.price} ETH</span>
          <span>Created: {course.created_at}</span>
        </div>
      </div>

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

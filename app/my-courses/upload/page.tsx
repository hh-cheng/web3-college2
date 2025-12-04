'use client'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2 } from 'lucide-react'

import { createUploadUrls, saveCourse } from './actions'
import useWeb3 from '@/lib/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { useCreateCourseOnChain } from './hooks'

export default function UploadPage() {
  const router = useRouter()
  const { address, chainID, isConnected, connect, isConnecting } = useWeb3()
  const createCourseOnChain = useCreateCourseOnChain()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [video, setVideo] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate image type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file for the cover')
        return
      }
      setCoverImage(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate video type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file')
        return
      }
      setVideo(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check wallet connection
    if (!isConnected || !address || !chainID) {
      toast.error('Please connect your wallet first')
      return
    }

    // Validate form
    if (!title.trim()) {
      toast.error('Please enter a course title')
      return
    }

    if (!price.trim()) {
      toast.error('Please enter a course price')
      return
    }

    if (!coverImage) {
      toast.error('Please select a cover image')
      return
    }

    if (!video) {
      toast.error('Please select a video file')
      return
    }

    setIsSubmitting(true)

    try {
      // Step 1: Create course on-chain first
      toast.loading('Creating course on blockchain...')
      const metadataUri = `ipfs://course-${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`

      const onChainResult = await createCourseOnChain.mutateAsync({
        price: price.trim(),
        metadataUri,
      })

      if (!onChainResult.courseId) {
        throw new Error('Failed to get course ID from blockchain')
      }

      toast.dismiss()
      toast.loading('Preparing upload links...')

      // Step 2: Upload files and save to database with the on-chain course ID
      const courseOnchainId = onChainResult.courseId.toString()

      const presigned = await createUploadUrls(
        coverImage.name,
        coverImage.type,
        video.name,
        video.type,
      )

      if (!presigned.success || !presigned.data) {
        throw new Error(presigned.msg || 'Failed to prepare upload')
      }

      toast.dismiss()
      toast.loading('Uploading cover image...')

      const uploadFile = async (url: string, file: File) => {
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        })

        if (!res.ok) {
          throw new Error(`Failed to upload file (${res.status})`)
        }
      }

      await uploadFile(presigned.data.cover.url, coverImage)

      toast.dismiss()
      toast.loading('Uploading video...')

      await uploadFile(presigned.data.video.url, video)

      toast.dismiss()
      toast.loading('Saving course...')

      const result = await saveCourse(
        title.trim(),
        price.trim(),
        presigned.data.cover.key,
        presigned.data.video.key,
        address,
        chainID,
        courseOnchainId,
      )

      toast.dismiss()

      if (result.success) {
        toast.success('Course uploaded successfully!')
        // Reset form
        setTitle('')
        setPrice('')
        setCoverImage(null)
        setVideo(null)
        setCoverPreview(null)
        if (coverInputRef.current) coverInputRef.current.value = ''
        if (videoInputRef.current) videoInputRef.current.value = ''
        // Refresh page
        router.refresh()
      } else {
        toast.error(result.msg || 'Failed to upload course')
      }
    } catch (error: any) {
      console.error('Error uploading course:', error)
      toast.dismiss()
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground text-lg">
          Please connect your wallet to upload a course
        </p>
        <Button onClick={connect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Upload Course</h1>
        <p className="text-muted-foreground">
          Fill in the course details and upload your content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-foreground block"
          >
            Course Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Course Price */}
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="text-sm font-medium text-foreground block"
          >
            Course Price <span className="text-destructive">*</span>
          </label>
          <input
            id="price"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            Enter the price in YD tokens (e.g., 10 for 10 YD tokens)
          </p>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <label
            htmlFor="cover"
            className="text-sm font-medium text-foreground block"
          >
            Cover Image <span className="text-destructive">*</span>
          </label>
          <input
            id="cover"
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {coverPreview && (
            <div className="mt-4">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="max-w-full h-auto max-h-64 rounded-md border border-input"
              />
            </div>
          )}
        </div>

        {/* Video File */}
        <div className="space-y-2">
          <label
            htmlFor="video"
            className="text-sm font-medium text-foreground block"
          >
            Video File <span className="text-destructive">*</span>
          </label>
          <input
            id="video"
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {video && (
            <p className="text-xs text-muted-foreground">
              Selected: {video.name} ({(video.size / 1024 / 1024).toFixed(2)}{' '}
              MB)
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Course</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

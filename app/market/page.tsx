'use client'

import { Wallet as WalletIcon } from 'lucide-react'

import useMarket from './service'
import { Button } from '@/components/ui/button'

export default function MarketPage() {
  const { data, isLoading, error, chainID, connect, isConnecting } = useMarket()

  if (!chainID) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Course Market</h1>
          <p className="text-lg text-muted-foreground">
            Browse available courses on the blockchain
          </p>
        </div>
        <div className="p-12 border rounded-lg text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Wallet Not Connected</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to browse available courses
            </p>
          </div>
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="mt-4"
            size="lg"
          >
            <WalletIcon className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Course Market</h1>
          <p className="text-lg text-muted-foreground">
            Browse available courses on the blockchain
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 border rounded-lg animate-pulse">
              <div className="h-48 bg-muted rounded-md mb-4" />
              <div className="h-6 bg-muted rounded-md mb-2" />
              <div className="h-4 bg-muted rounded-md w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Course Market</h1>
          <p className="text-lg text-muted-foreground">
            Browse available courses on the blockchain
          </p>
        </div>
        <div className="p-8 border border-destructive rounded-lg text-center">
          <p className="text-destructive mb-4">
            Failed to load courses. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const courses = data?.success ? data.data : []
  const errorMessage = data?.success === false ? data.msg : null

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Course Market</h1>
        <p className="text-lg text-muted-foreground">
          Browse available courses on the blockchain
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="p-12 border rounded-lg text-center">
          <p className="text-muted-foreground">
            No courses available at the moment. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 border rounded-lg hover:shadow-lg transition-shadow space-y-4"
            >
              {course.cover_key && (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <span className="text-xs text-muted-foreground">
                    Cover Image
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{course.price} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created: {course.created_at}</span>
                </div>
              </div>
              <Button className="w-full" variant="default">
                View Course
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

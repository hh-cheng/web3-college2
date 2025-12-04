'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet as WalletIcon, Loader2 } from 'lucide-react'

import useMarket from './service'
import useWeb3 from '@/lib/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import type { CourseWithOwnership } from './types'
import { useApproveToken, usePurchaseCourse, useCheckAllowance } from './hooks'

export default function MarketPage() {
  const router = useRouter()
  const { data, isLoading, error, chainID, address, connect, isConnecting } =
    useMarket()
  const { address: walletAddress } = useWeb3()
  const approveMutation = useApproveToken()
  const purchaseMutation = usePurchaseCourse()
  const checkAllowance = useCheckAllowance()
  const [checkingAllowance, setCheckingAllowance] = useState<
    Record<number, boolean>
  >({})
  const [allowanceStatus, setAllowanceStatus] = useState<
    Record<number, boolean>
  >({})

  const courses = data?.success ? data.data : []
  const errorMessage = data?.success === false ? data.msg : null

  const handleApprove = async (course: CourseWithOwnership) => {
    try {
      // YD Token has 0 decimals, so parse price as integer
      const priceInSmallestUnit = BigInt(Math.floor(parseFloat(course.price)))
      await approveMutation.mutateAsync({
        amount: priceInSmallestUnit,
        coursePrice: course.price,
      })
      // Check allowance after approval
      setCheckingAllowance((prev) => ({ ...prev, [course.id]: true }))
      try {
        const hasAllow = await checkAllowance(course.price)
        setAllowanceStatus((prev) => ({
          ...prev,
          [course.id]: hasAllow,
        }))
      } finally {
        setCheckingAllowance((prev) => ({
          ...prev,
          [course.id]: false,
        }))
      }
    } catch (error) {
      console.error('Approve error:', error)
    }
  }

  const handlePurchase = async (course: CourseWithOwnership) => {
    try {
      await purchaseMutation.mutateAsync({
        courseId: course.id,
        courseOnchainId: course.course_onchain_id,
        price: course.price,
      })
    } catch (error) {
      console.error('Purchase error:', error)
    }
  }

  // Check allowances for unowned courses
  useEffect(() => {
    if (!walletAddress || !courses.length) return

    const checkAllowances = async () => {
      for (const course of courses) {
        if (
          !course.isOwned &&
          allowanceStatus[course.id] === undefined &&
          !checkingAllowance[course.id]
        ) {
          setCheckingAllowance((prev) => ({ ...prev, [course.id]: true }))
          try {
            const hasAllow = await checkAllowance(course.price)
            setAllowanceStatus((prev) => ({ ...prev, [course.id]: hasAllow }))
          } catch (error) {
            console.error('Error checking allowance:', error)
          } finally {
            setCheckingAllowance((prev) => ({ ...prev, [course.id]: false }))
          }
        }
      }
    }

    checkAllowances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, courses.length])

  if (!chainID || !address) {
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
              Please connect your wallet to browse and purchase courses
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
          {courses.map((course) => {
            const isOwned = course.isOwned
            const isApproving = approveMutation.isPending
            const isPurchasing = purchaseMutation.isPending
            const hasAllowance = allowanceStatus[course.id] ?? false

            return (
              <div
                key={course.id}
                className="p-6 border rounded-lg hover:shadow-lg transition-shadow space-y-4"
              >
                {course.cover_key && (
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    <Image
                      fill
                      alt={course.title}
                      src={`/api/course-image/${course.cover_key}`}
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML =
                            '<span class="text-xs text-muted-foreground">Cover Image</span>'
                        }
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {course.price} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Created: {course.created_at}</span>
                  </div>
                </div>
                {isOwned ? (
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => router.push(`/learn/${course.id}`)}
                  >
                    View Course
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {!hasAllowance && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleApprove(course)}
                        disabled={isApproving || isPurchasing}
                      >
                        {isApproving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    )}
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => handlePurchase(course)}
                      disabled={
                        !hasAllowance ||
                        isPurchasing ||
                        isApproving ||
                        checkingAllowance[course.id]
                      }
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Purchasing...
                        </>
                      ) : checkingAllowance[course.id] ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        'Buy'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

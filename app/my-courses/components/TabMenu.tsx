'use client'
import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TabMenu() {
  const router = useRouter()
  const pathname = usePathname()

  const activeTab =
    pathname === '/my-courses/upload'
      ? 'upload'
      : pathname === '/my-courses/uploaded'
        ? 'uploaded'
        : 'bought'

  const handleTabChange = (value: string) => {
    if (value === 'bought') {
      router.push('/my-courses/bought')
    } else if (value === 'upload') {
      router.push('/my-courses/upload')
    } else if (value === 'uploaded') {
      router.push('/my-courses/uploaded')
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="bought" className="cursor-pointer">
          Bought
        </TabsTrigger>
        <TabsTrigger value="upload" className="cursor-pointer">
          Upload
        </TabsTrigger>
        <TabsTrigger value="uploaded" className="cursor-pointer">
          Uploaded
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

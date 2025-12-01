'use client'
import TabMenu from './components/TabMenu'

export default function MyCoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="px-8 space-y-8">
      <TabMenu />
      {children}
    </section>
  )
}

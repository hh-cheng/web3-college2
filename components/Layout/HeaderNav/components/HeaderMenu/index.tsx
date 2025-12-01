'use client'
import { usePathname } from 'next/navigation'
import PillNav, { type PillNavItem } from '@/components/ui/PillNav'

export default function HeaderMenu() {
  const pathname = usePathname()

  const navItems: PillNavItem[] = [
    {
      label: 'Market',
      href: '/market',
      ariaLabel: 'Navigate to Market page',
    },
    {
      label: 'My Courses',
      href: '/my-courses',
      ariaLabel: 'Navigate to My Courses page',
    },
    {
      label: 'Me',
      href: '/me',
      ariaLabel: 'Navigate to My Profile page',
    },
  ]

  return (
    <PillNav
      items={navItems}
      activeHref={pathname}
      baseColor="#ffffff"
      pillColor="#f0f0f0"
      pillTextColor="#0a0e27"
      hoveredPillTextColor="#0a0e27"
      initialLoadAnimation={false}
      wrapperClassName="relative top-0 left-0 w-auto"
      className="relative"
    />
  )
}

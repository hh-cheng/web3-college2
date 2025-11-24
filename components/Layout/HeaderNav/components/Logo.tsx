import Link from 'next/link'

import RotatingText from '@/components/ui/RotatingText'

export default function Logo() {
  return (
    <Link href="/" prefetch={false}>
      <RotatingText
        animate={{ y: 0 }}
        staggerFrom={'last'}
        exit={{ y: '-120%' }}
        initial={{ y: '100%' }}
        staggerDuration={0.025}
        rotationInterval={3000}
        animatePresenceInitial
        mainClassName="pt-2 font-bold text-xl"
        texts={['Web3 College', 'Web3 College']}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      />
    </Link>
  )
}

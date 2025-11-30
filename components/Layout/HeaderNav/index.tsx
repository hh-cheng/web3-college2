'use client'
import Logo from './components/Logo'
import Wallet from './components/Wallet'
import GlassSurface from '@/components/ui/GlassSurface'

const cssVars = {
  ['--nav-h']: '42px',
  ['--base']: '#ffffff',
  ['--pill-gap']: '3px',
  ['--pill-bg']: '#f0f0f0',
  ['--pill-pad-x']: '18px',
  ['--pill-text']: '#0a0e27',
  ['--hover-text']: '#0a0e27',
} as React.CSSProperties

export default function HeaderNav() {
  return (
    <section className="fixed top-8 left-0 w-full z-50 flex justify-center">
      <GlassSurface
        blur={15}
        width="90%"
        height={60}
        displace={15}
        redOffset={5}
        opacity={0.95}
        blueOffset={25}
        brightness={80}
        greenOffset={15}
        borderRadius={15}
        mixBlendMode="screen"
        distortionScale={-150}
      >
        <nav
          style={cssVars}
          aria-label="Primary"
          className="w-full flex items-center justify-between px-6 h-full"
        >
          {/* Logo/Brand */}
          <Logo />

          {/* Navigation Pills */}
          {/* <HeaderMenu /> */}

          {/* Wallet Component (Right Side) */}
          <Wallet />
        </nav>
      </GlassSurface>
    </section>
  )
}

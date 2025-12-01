import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

import HeaderNav from '@/components/Layout/HeaderNav'
import QueryProvider from '@/components/Layout/QueryProvider'
import WalletInitializer from '@/components/Layout/WalletInitializer'

import './globals.css'

const firaCode = localFont({
  src: [
    {
      weight: '300',
      style: 'normal',
      path: '../public/fonts/FiraCode-Light.woff2',
    },
    {
      weight: '400',
      style: 'normal',
      path: '../public/fonts/FiraCode-Regular.woff2',
    },
    {
      weight: '700',
      style: 'normal',
      path: '../public/fonts/FiraCode-Bold.woff2',
    },
  ],
  variable: '--font-fira-code',
})

export const metadata: Metadata = {
  title: 'Web3 College',
  description: 'Web3 College',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} antialiased`}>
        <WalletInitializer />
        <HeaderNav />
        <main className="pt-32 px-8 h-screen overflow-y-auto scrollbar-hide">
          <QueryProvider>{children}</QueryProvider>
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}

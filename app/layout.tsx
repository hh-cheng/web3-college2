import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'

const firaCode = localFont({
  src: [
    {
      path: '../public/fonts/FiraCode-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/FiraCode-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/FiraCode-Bold.woff2',
      weight: '700',
      style: 'normal',
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
      <body className={`${firaCode.variable} antialiased`}>{children}</body>
    </html>
  )
}

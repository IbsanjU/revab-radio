import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Revab Radio - Your Personal Radio Station',
  description: 'A comprehensive radio station application with modern UI, multiple stations, and advanced playback features',
  keywords: ['radio', 'music', 'streaming', 'online radio', 'internet radio'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  )
}

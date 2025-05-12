import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'TalOS',
  description: 'Virtual OS in React',
  authors: [{ name: 'KwikKill' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

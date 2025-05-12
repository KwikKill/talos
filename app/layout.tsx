import type { Metadata } from 'next'
import './globals.css'


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
    <html lang="en" className=''>
      <body>
        {children}
      </body>
    </html>
  )
}

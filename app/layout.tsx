import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/app/components/Navbar'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Happy Cart',
  description: 'Catálogo de productos y boletas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className={geist.variable}>
        <body className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist)]">
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}

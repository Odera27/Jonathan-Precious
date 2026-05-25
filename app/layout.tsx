import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/lib/context/AuthContext'
import { NotificationProvider } from '@/lib/context/NotificationContext'
import { WalletProvider } from '@/lib/context/WalletContext'
import ToastContainer from '@/components/shared/ToastContainer'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CampusMart - Campus Inventory & Marketplace',
  description: 'Campus Inventory & Marketplace System for vendors, students, and administrators',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <NotificationProvider>
            <WalletProvider>
              {children}
              <ToastContainer />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </WalletProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

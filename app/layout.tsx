import type { Metadata } from 'next'
import { Architects_Daughter, Geist_Mono, Outfit } from 'next/font/google'
import './globals.css'
import { ModalProviders } from '@/components/modals/modal-providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { EdgeStoreProvider } from '@/lib/edgestore'
import { TRPCReactProvider } from '@/trpc/client'

const geistSans = Outfit({
  variable: '--font-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const geistNotebooks = Architects_Daughter({
  variable: '--font-notebooks',
  subsets: ['latin'],
  weight: ['400']
})

export const metadata: Metadata = {
  title: 'Lumina-Notes',
  description: 'A note taking app for developers',
  keywords: 'notes, developer, notes-app, note-taking, dev-notes'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${geistNotebooks.variable}`}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <EdgeStoreProvider>
              <ModalProviders />
              {children}
              <Toaster />
            </EdgeStoreProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}

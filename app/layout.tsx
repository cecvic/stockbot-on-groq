import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import './globals.css'
import { cn } from '../lib/utils'
import { Providers } from '../components/providers'
import { Header } from '../components/header'
import { Toaster } from '../components/ui/sonner'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'StockBot powered by Groq',
    template: `%s - StockBot powered by Groq`
  },
  description:
    'Lightning Fast AI Chatbot that Responds With Live Interactive Stock Charts, Financials, News, Screeners, and More.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased bg-[#0D0D0D] text-white',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Toaster position="top-center" />
        <Providers
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-800 flex flex-col">
              <div className="p-4">
                <button className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center justify-center">
                  + New Chat
                </button>
              </div>
              <div className="flex-1 overflow-auto p-2">
                {/* Recent chats will go here */}
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}

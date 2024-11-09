import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import { ChatSessionProvider } from '@/lib/chat/session-context'
import { ChatSessionsSidebar } from '@/components/sidebar/chat-sessions-sidebar'
import { cn } from '@/lib/utils'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'font-sans antialiased',
        inter.className
      )}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ChatSessionProvider>
            <div className="flex">
              <ChatSessionsSidebar />
              <main className="flex-1 ml-16 md:ml-80 transition-all duration-300">
                {children}
              </main>
            </div>
            <Toaster />
          </ChatSessionProvider>
        </Providers>
      </body>
    </html>
  )
}

'use client'

import { cn } from '../lib/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { EmptyScreen } from './empty-screen'
import { useLocalStorage } from '../lib/hooks/use-local-storage'
import { useEffect } from 'react'
import { Message, Session } from '../lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '../lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { TickerTape } from './tradingview/ticker-tape'
import { MissingApiKeyBanner } from './missing-api-key-banner'
import { useChat } from 'ai/react'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [_, setNewChatId] = useLocalStorage('newChatId', id)
  
  const { messages, input, setInput, handleSubmit: chatSubmit } = useChat({
    api: '/api/chat',
    id,
    body: {
      id,
      userId: session?.user?.id
    },
    onResponse(response) {
      if (response.ok) {
        router.refresh()
      }
    }
  })

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    setNewChatId(id)
  }, [id, setNewChatId])

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  const handleMessageSubmit = async (value: string) => {
    try {
      setInput(value)
      const event = {
        preventDefault: () => {},
        currentTarget: {
          elements: {
            message: { value }
          }
        }
      } as unknown as React.FormEvent<HTMLFormElement>
      await chatSubmit(event)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  const chatMessages: Message[] = messages.map(msg => ({
    ...msg,
    createdAt: new Date()
  }))

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      {messages.length ? (
        <MissingApiKeyBanner missingKeys={missingKeys} />
      ) : (
        <TickerTape />
      )}

      <div
        className={cn(
          'max-w-5xl mx-auto px-4',
          messages.length ? 'pb-[200px] pt-4 md:pt-6' : 'pb-[200px] pt-0',
          className
        )}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList 
            messages={chatMessages}
            isShared={false} 
            session={session} 
          />
        ) : (
          <EmptyScreen onMessageSubmit={handleMessageSubmit} />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        onSubmit={handleMessageSubmit}
      />
    </div>
  )
}

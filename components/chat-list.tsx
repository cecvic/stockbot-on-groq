'use client'

import { Separator } from './ui/separator'
import { Message, Session } from '../lib/types'
import { UserMessage } from './stocks/message'

export interface ChatListProps {
  messages: Message[]
  session?: Session
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatListProps) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-white'
            }`}>
              {message.content}
            </div>
          </div>
          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  )
}

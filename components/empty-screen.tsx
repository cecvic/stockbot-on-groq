import { UseChatHelpers } from 'ai/react'
import { Button } from './ui/button'
import { ExternalLink } from './external-link'
import { IconArrowRight } from './ui/icons'
import Image from 'next/image'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { useUIState, useActions } from 'ai/rsc'
import type { AI } from '../lib/chat/actions'
import { useState, useEffect } from 'react'

const exampleMessages = [
  {
    icon: '📈',
    title: 'Stock Price',
    message: 'What is the price of Apple stock?'
  },
  {
    icon: '📊',
    title: 'Stock Chart',
    message: 'Show me a stock chart for $GOOGL'
  },
  {
    icon: '📰',
    title: 'Recent Events',
    message: 'What are some recent events about Amazon?'
  },
  {
    icon: '💰',
    title: 'Financials',
    message: "What are Microsoft's latest financials?"
  }
]

export function EmptyScreen() {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const handleExampleClick = async (message: string) => {
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{message}</UserMessage>
      }
    ])

    const responseMessage = await submitUserMessage(message)
    setMessages(currentMessages => [...currentMessages, responseMessage])
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/groqlabs-logo-black.png"
          alt="BigData Logo"
          width={120}
          height={40}
          className="invert"
        />
      </div>

      {/* Prompts Section */}
      <div className="w-full max-w-4xl px-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Prompts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleMessages.map((example, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors cursor-pointer"
              onClick={() => handleExampleClick(example.message)}
            >
              <div className="flex-shrink-0 text-2xl">{example.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-400">{example.title}</span>
                </div>
                <p className="text-sm text-gray-300">{example.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="fixed bottom-4 w-full max-w-4xl px-4">
        <div className="flex items-center gap-2 w-full bg-gray-900 rounded-lg border border-gray-800 p-2">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border-none focus:outline-none text-white px-2"
          />
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <IconArrowRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

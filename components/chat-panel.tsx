'use client'

import * as React from 'react'
import { Button } from './ui/button'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { IconShare } from './ui/icons'
import { FooterText } from './footer'
import { Message } from '../lib/types'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  onSubmit: (message: string) => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  onSubmit
}: ChatPanelProps) {
  const handleSubmit = (value: string) => {
    onSubmit(value)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent to-[#0D0D0D] pb-4 pt-20 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-5xl sm:px-4">
        <div className="space-y-4 border-t border-gray-800 bg-[#0D0D0D] px-4 py-2 shadow-lg sm:border md:py-4">
          <PromptForm 
            input={input} 
            setInput={setInput} 
            onSubmit={handleSubmit}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

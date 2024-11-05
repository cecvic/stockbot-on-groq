import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '../lib/utils'
import { Button, buttonVariants } from './ui/button'
import { IconGitHub } from './ui/icons'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-end w-full h-16 px-4 bg-[#0D0D0D] border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <a
          target="_blank"
          href="https://github.com/bklieger-groq/groq-gen-ui/"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }), 'border-gray-800 hover:bg-gray-900')}
        >
          <IconGitHub className="text-white" />
          <span className="hidden ml-2 md:flex text-white">GitHub</span>
        </a>
      </div>
    </header>
  )
}

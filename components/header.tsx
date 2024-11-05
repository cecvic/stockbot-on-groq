import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '../lib/utils'
import { Button, buttonVariants } from './ui/button'
import { IconGitHub } from './ui/icons'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-end w-full h-16 px-4 bg-[#0D0D0D] border-b border-gray-800">
    </header>
  )
}

'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        className="rounded-full bg-background px-4 py-2 flex items-center gap-2"
        onClick={() => {
          startTransition(() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          })
        }}
      >
        {!theme ? null : theme === 'dark' ? (
          <>
            <IconMoon className="size-6 transition-all" />
            <span className="text-sm font-medium">Switch Mode</span>
          </>
        ) : (
          <>
            <IconSun className="size-6 transition-all" />
            <span className="text-sm font-medium">Switch Mode</span>
          </>
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}

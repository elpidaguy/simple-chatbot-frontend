"use client"
import clsx from 'clsx'
import { ReactNode } from 'react'

export default function MessageBubble({ role = 'user', children, error }: { role?: 'user' | 'assistant'; children: ReactNode; error?: boolean }) {
  const isUser = role === 'user'
  return (
    <div className={clsx('my-2 flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[70%] p-3 rounded-lg',
          isUser ? 'bg-dracula-currentLine text-dracula-foreground' : 'bg-dracula-purple text-white',
          error && 'ring-2 ring-red-500'
        )}
      >
        {children}
      </div>
    </div>
  )
}

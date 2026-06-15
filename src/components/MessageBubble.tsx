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
          isUser ? 'bg-catppuccin-surface0 text-catppuccin-text' : 'bg-catppuccin-mauve text-catppuccin-base',
          error && 'ring-2 ring-red-500'
        )}
      >
        <div className={clsx(isUser ? '' : 'markdown')}>
          {children}
        </div>
      </div>
    </div>
  )
}

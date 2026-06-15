"use client"
import { useState } from 'react'

export default function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [text, setText] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  return (
    <form onSubmit={submit} className="w-full flex items-center space-x-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="flex-1 bg-catppuccin-surface0 text-catppuccin-text rounded p-2 focus:outline-none focus:ring-2 focus:ring-catppuccin-sky disabled:opacity-50"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit(e as any)
          }
        }}
        disabled={disabled}
        aria-label="Message input"
      />
      <button type="submit" className="px-4 py-2 bg-catppuccin-mauve text-catppuccin-base rounded font-semibold hover:opacity-90 disabled:opacity-50" disabled={disabled}>
        Send
      </button>
    </form>
  )
}

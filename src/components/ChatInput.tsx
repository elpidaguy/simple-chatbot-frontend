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
        className="flex-1 bg-dracula-currentLine text-dracula-foreground rounded p-2 focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            submit(e as any)
          }
        }}
        disabled={disabled}
        aria-label="Message input"
      />
      <button type="submit" className="px-4 py-2 bg-dracula-purple rounded" disabled={disabled}>
        Send
      </button>
    </form>
  )
}

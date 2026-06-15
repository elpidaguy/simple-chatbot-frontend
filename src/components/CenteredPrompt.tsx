"use client"
import { useState } from 'react'

export default function CenteredPrompt({ onStart }: { onStart: (text: string) => void }) {
  const [text, setText] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onStart(text.trim())
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-2xl p-6">
        <textarea
          rows={3}
          placeholder="Type your message and press Enter..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-catppuccin-surface0 text-catppuccin-text rounded p-4 focus:outline-none focus:ring-2 focus:ring-catppuccin-sky"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              submit(e as any)
            }
          }}
        />
      </form>
    </div>
  )
}

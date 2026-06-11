"use client"
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { postChatStream } from '../lib/apiClient'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import LoadingDots from './LoadingDots'

type Message = { role: 'user' | 'assistant'; content?: string; streaming?: boolean; error?: boolean }

export default function ChatView({ initialPrompt }: { initialPrompt: string | null }) {
  const { authFetch } = useAuth()
  const [messages, setMessages] = useState<Message[]>(() => (initialPrompt ? [{ role: 'user', content: initialPrompt }] : []))
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const appendMessage = (msg: Message) => setMessages((m) => [...m, msg])

  async function sendMessage(text: string) {
    appendMessage({ role: 'user', content: text })
    setIsStreaming(true)
    appendMessage({ role: 'assistant', content: '', streaming: true })
    try {
      await postChatStream({ model: 'models/gemini-3.5-flash', messages: [{ role: 'user', content: text }] }, authFetch, (chunk) => {
        // append chunk to last assistant message
        setMessages((prev) => {
          const copy = [...prev]
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant') {
              copy[i] = { ...copy[i], content: (copy[i].content || '') + chunk }
              break
            }
          }
          return copy
        })
      })
      // Clear streaming flag after response completes
      setMessages((prev) => {
        const copy = [...prev]
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant') {
            copy[i] = { ...copy[i], streaming: false }
            break
          }
        }
        return copy
      })
    } catch (err: any) {
      setError(err?.message || String(err))
      // mark last assistant message as error
      setMessages((prev) => {
        const copy = [...prev]
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant') {
            copy[i] = { ...copy[i], error: true, streaming: false }
            break
          }
        }
        return copy
      })
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div ref={containerRef} className="space-y-2 mb-4">
        {messages.map((m, idx) => (
          <MessageBubble key={idx} role={m.role} error={m.error}>
            {m.content}
            {m.streaming && <LoadingDots />}
          </MessageBubble>
        ))}
      </div>
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
      {error && <div className="mt-2 text-red-400">{error}</div>}
    </div>
  )
}

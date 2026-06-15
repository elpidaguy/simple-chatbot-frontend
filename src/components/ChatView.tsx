"use client"
import { useEffect, useState, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../context/AuthContext'
import { postChatStream } from '../lib/apiClient'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import LoadingDots from './LoadingDots'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
  error?: boolean
}

export default function ChatView({ initialPrompt }: { initialPrompt: string | null }) {
  const { authFetch } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assistantIdRef = useRef<string | null>(null)
  const initialPromptSentRef = useRef(false)

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }, 0)
  }, [messages])

  // Send initial prompt on mount (only once)
  useEffect(() => {
    if (initialPrompt && !initialPromptSentRef.current) {
      initialPromptSentRef.current = true
      sendMessage(initialPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      try {
        setError(null)

        // Add user message
        const userId = Date.now().toString()
        setMessages((prev) => [...prev, { id: userId, role: 'user', content: text }])

        // Create assistant message placeholder
        const assistantId = `assistant-${Date.now()}`
        assistantIdRef.current = assistantId
        setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', streaming: true }])

        setIsStreaming(true)

        // Call API with streaming
        await postChatStream(
          {
            model: 'models/gemini-3.5-flash',
            messages: [{ role: 'user', content: text }],
          },
          authFetch,
          (chunk) => {
            console.log('Chunk received:', chunk)
            setMessages((prev) => {
              const updated = [...prev]
              const idx = updated.findIndex((m) => m.id === assistantId)
              if (idx !== -1) {
                updated[idx] = {
                  ...updated[idx],
                  content: updated[idx].content + chunk,
                }
              }
              return updated
            })
          }
        )

        // Mark streaming complete
        setMessages((prev) => {
          const updated = [...prev]
          const idx = updated.findIndex((m) => m.id === assistantId)
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], streaming: false }
          }
          return updated
        })
      } catch (err: any) {
        console.error('Error in sendMessage:', err)
        setError(err?.message || String(err))

        // Mark as error
        if (assistantIdRef.current) {
          setMessages((prev) => {
            const updated = [...prev]
            const idx = updated.findIndex((m) => m.id === assistantIdRef.current)
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], error: true, streaming: false }
            }
            return updated
          })
        }
      } finally {
        setIsStreaming(false)
      }
    },
    [authFetch]
  )

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 p-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-catppuccin-subtext0 mt-8">Start a conversation...</div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} error={msg.error}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              )}
              {msg.streaming && <LoadingDots />}
            </MessageBubble>
          ))
        )}
      </div>

      <div className="p-4 border-t border-catppuccin-surface1">
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
        {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
      </div>
    </div>
  )
}

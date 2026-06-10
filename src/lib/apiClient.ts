import { createParser } from 'eventsource-parser'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

type Message = { role: string; content: string }

export async function postChat(payload: { model?: string; messages: Message[]; temperature?: number; max_tokens?: number }, authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {
  const url = `${API_BASE}/api/chat`
  const res = await authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'API error')
  }
  return res.json()
}

export async function postChatStream(payload: { model?: string; messages: Message[]; temperature?: number; max_tokens?: number }, authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, onChunk: (chunk: string) => void) {
  const url = `${API_BASE}/api/chat/stream`
  const res = await authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Stream API error')
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('text/event-stream')) {
    const text = await res.text()
    throw new Error(text || 'Unexpected response content type')
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      onChunk(event.data)
    }
  })

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    parser.feed(chunk)
  }
}

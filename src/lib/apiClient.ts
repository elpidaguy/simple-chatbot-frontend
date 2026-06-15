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

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    buffer += chunk

    // Process complete SSE messages (delimited by double newlines)
    const lines = buffer.split('\n')
    
    // Keep the last incomplete line in buffer
    buffer = lines[lines.length - 1]
    
    // Process complete lines
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim()
      
      // Skip empty lines and comments
      if (!line || line.startsWith(':')) continue
      
      // Parse "data: ..." format
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        console.log('Parsed SSE data:', data)
        onChunk(data)
      } else if (line.startsWith('event: ')) {
        // Handle event type if needed
        console.log('SSE event:', line.slice(7))
      }
    }
  }

  // Process any remaining buffer
  if (buffer.trim()) {
    const line = buffer.trim()
    if (line.startsWith('data: ')) {
      const data = line.slice(6)
      console.log('Parsed final SSE data:', data)
      onChunk(data)
    }
  }
}

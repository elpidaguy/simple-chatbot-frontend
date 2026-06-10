"use client"
import { useState, useEffect } from 'react'
import CenteredPrompt from '../components/CenteredPrompt'
import ChatView from '../components/ChatView'

export default function Page() {
  const [started, setStarted] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null)

  useEffect(() => {
    const input = document.getElementById('token-input')
    if (input) {
      // noop placeholder — AuthContext handles token
    }
  }, [])

  if (!started) {
    return (
      <CenteredPrompt
        onStart={(text: string) => {
          setInitialPrompt(text)
          setStarted(true)
        }}
      />
    )
  }

  return <ChatView initialPrompt={initialPrompt} />
}

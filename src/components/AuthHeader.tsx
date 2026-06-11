"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthHeader() {
  const { token, setToken } = useAuth()
  const [value, setValue] = useState(token || '')

  useEffect(() => {
    setValue(token || '')
  }, [token])

  return (
    <div className="flex items-center space-x-2">
      <input
        id="token-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste token"
        className="bg-dracula-currentLine text-sm p-1 rounded"
      />
      <button
        onClick={() => setToken(value ? value.trim() : null)}
        className="text-sm px-2 py-1 bg-dracula-selection rounded"
      >
        Set
      </button>
      <button onClick={() => setToken(null)} className="text-sm px-2 py-1 border rounded">
        Clear
      </button>
    </div>
  )
}

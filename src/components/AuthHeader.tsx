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
        className="bg-catppuccin-surface0 text-catppuccin-text text-sm p-1 rounded focus:outline-none focus:ring-2 focus:ring-catppuccin-sky"
      />
      <button
        onClick={() => setToken(value ? value.trim() : null)}
        className="text-sm px-2 py-1 bg-catppuccin-mauve text-catppuccin-base rounded font-semibold hover:opacity-90"
      >
        Set
      </button>
      <button onClick={() => setToken(null)} className="text-sm px-2 py-1 border border-catppuccin-sky text-catppuccin-sky rounded hover:bg-catppuccin-surface0">
        Clear
      </button>
    </div>
  )
}

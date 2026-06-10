"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthContextValue = {
  token: string | null
  setToken: (t: string | null) => void
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = typeof window !== 'undefined' ? (localStorage.getItem('jwt') || process.env.NEXT_PUBLIC_TEST_TOKEN || '') : (process.env.NEXT_PUBLIC_TEST_TOKEN || '')
  const [token, setTokenState] = useState<string | null>(initial || null)

  function setToken(t: string | null) {
    setTokenState(t)
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem('jwt', t)
      else localStorage.removeItem('jwt')
    }
  }

  const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers as HeadersInit)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const res = await fetch(input, { ...init, headers })
    return res
  }

  return (
    <AuthContext.Provider value={{ token, setToken, authFetch }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

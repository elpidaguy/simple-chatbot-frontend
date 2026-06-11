import '../styles/globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import AuthHeader from '../components/AuthHeader'

export const metadata = {
  title: 'Generic AI chatbot',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-dracula-background text-dracula-foreground">
            <header className="p-4 flex items-center justify-between border-b border-dracula-currentLine">
              <h1 className="text-xl font-semibold">Generic AI chatbot</h1>
              <AuthHeader />
            </header>
            <main className="p-6">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

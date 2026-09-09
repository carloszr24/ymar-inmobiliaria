'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AdminAuthGuardProps = {
  children: ReactNode | ((ctx: { logout: () => Promise<void> }) => ReactNode)
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [pwError, setPwError] = useState(false)
  const [pwErrorMsg, setPwErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        return data
      })
      .then((data: { authed?: boolean }) => {
        if (data.authed) setAuthed(true)
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const login = async () => {
    setPwError(false)
    setPwErrorMsg(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, pin }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (res.ok) {
        setAuthed(true)
        setPassword('')
        setPin('')
        return
      }
      if (res.status === 429) {
        setPwErrorMsg(data.error || 'Demasiados intentos. Espera unos minutos.')
        return
      }
      if (res.status === 403) {
        setPwErrorMsg('Acceso no permitido desde esta red.')
        return
      }
      setPwError(true)
      setPwErrorMsg(data.error || 'Contraseña o PIN incorrectos')
    } catch {
      setPwError(true)
      setPwErrorMsg('No se pudo conectar. Inténtalo de nuevo.')
    }
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setAuthed(false)
  }

  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-sm text-stone-400 animate-pulse">Comprobando sesión…</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-light text-stone-900 mb-8 text-center">Acceso admin</h1>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPwError(false)
                  setPwErrorMsg(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="Contraseña"
                autoComplete="current-password"
                className={cn(
                  'w-full border px-4 py-3 pr-10 text-sm focus:outline-none transition-colors',
                  pwError ? 'border-red-300 bg-red-50' : 'border-stone-200 focus:border-stone-900'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setPwError(false)
                  setPwErrorMsg(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="PIN"
                autoComplete="one-time-code"
                className={cn(
                  'w-full border px-4 py-3 pr-10 text-sm focus:outline-none transition-colors tracking-[0.3em]',
                  pwError ? 'border-red-300 bg-red-50' : 'border-stone-200 focus:border-stone-900'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPin((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
              >
                {showPin ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {pwErrorMsg && <p className="text-red-500 text-xs">{pwErrorMsg}</p>}
            <button type="button" onClick={login} className="btn-primary w-full py-3 text-sm">
              Entrar
            </button>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-stone-400 text-center">
                Local: <code className="bg-stone-100 px-1">ADMIN_PASSWORD</code> y{' '}
                <code className="bg-stone-100 px-1">ADMIN_PIN</code> en{' '}
                <code className="bg-stone-100 px-1">.env</code>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <>{typeof children === 'function' ? children({ logout }) : children}</>
}

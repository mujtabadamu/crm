import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, LogIn, Store, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext'

export function LoginPage() {
  const { currentUser, login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (currentUser) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/'
    return <Navigate to={redirectTo} replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = login(username.trim(), password)
    setSubmitting(false)
    if (!result.success) {
      setError(result.message ?? 'Unable to log in.')
      return
    }
    toast.success('Welcome back!')
    navigate('/')
  }

  function fillDemo(role: 'admin' | 'cashier') {
    if (role === 'admin') {
      setUsername('admin')
      setPassword('admin123')
    } else {
      setUsername('cashier')
      setPassword('cashier123')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
            <Store size={24} />
          </div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">San Hussein Mall CRM</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Jimeta, Yola &middot; Adamawa State</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Sign in to your account</h2>

          <label className="mb-3 block text-sm">
            <span className="mb-1 block font-medium text-[var(--color-text)]">Username</span>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-soft)]">
              <UserIcon size={16} className="text-[var(--color-text-muted)]" />
              <input
                className="w-full text-sm outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                autoFocus
                required
              />
            </div>
          </label>

          <label className="mb-2 block text-sm">
            <span className="mb-1 block font-medium text-[var(--color-text)]">Password</span>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-soft)]">
              <Lock size={16} className="text-[var(--color-text-muted)]" />
              <input
                type="password"
                className="w-full text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          {error && <p className="mb-3 rounded-md bg-[var(--color-danger-soft)] px-3 py-2 text-xs text-[var(--color-danger)]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
          >
            <LogIn size={16} />
            Sign in
          </button>

          <div className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-[var(--color-text-muted)]">
            <p className="mb-2 font-medium text-[var(--color-text)]">Demo accounts</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => fillDemo('admin')} className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 font-medium hover:bg-black/5">
                Administrator
              </button>
              <button type="button" onClick={() => fillDemo('cashier')} className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 font-medium hover:bg-black/5">
                Cashier
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

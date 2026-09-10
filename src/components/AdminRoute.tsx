import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function AdminRoute() {
  const { hasRole, logAccessDenied } = useApp()
  const location = useLocation()
  const isAdmin = hasRole('Administrator')
  const loggedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isAdmin && loggedRef.current !== location.pathname) {
      logAccessDenied(`Attempted to access restricted page: ${location.pathname}`)
      loggedRef.current = location.pathname
    }
  }, [isAdmin, location.pathname, logAccessDenied])

  if (!isAdmin) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-danger-soft)] text-[var(--color-danger)]">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Access denied</h2>
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
          This section is restricted to Administrator accounts. Please contact your system
          administrator if you believe this is an error.
        </p>
      </div>
    )
  }

  return <Outlet />
}

import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-bg)] px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
        <Compass size={28} />
      </div>
      <h1 className="text-lg font-semibold text-[var(--color-text)]">Page not found</h1>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">The page you are looking for does not exist or may have been moved.</p>
      <Link to="/" className="mt-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
        Back to Dashboard
      </Link>
    </div>
  )
}

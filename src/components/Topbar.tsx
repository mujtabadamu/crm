import { LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext'
import { initials } from '../lib/format'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (!currentUser) return null

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur">
      <button className="rounded-md p-1.5 text-gray-500 hover:bg-black/5 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight text-[var(--color-text)]">{currentUser.fullName}</p>
          <p className="text-xs leading-tight text-[var(--color-text-muted)]">{currentUser.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-semibold text-[var(--color-primary-dark)]">
          {initials(currentUser.fullName.split(' ')[0] ?? '', currentUser.fullName.split(' ')[1] ?? '')}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:bg-black/5"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

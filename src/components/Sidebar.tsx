import {
  BarChart3,
  Gift,
  LayoutDashboard,
  Package,
  Percent,
  ScrollText,
  ShoppingCart,
  Store,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/products', label: 'Products', icon: Package, adminOnly: true },
  { to: '/transactions', label: 'Transactions', icon: ShoppingCart },
  { to: '/loyalty', label: 'Loyalty Points', icon: Gift },
  { to: '/promotions', label: 'Promotions', icon: Percent, adminOnly: true },
  { to: '/reports', label: 'Reports', icon: BarChart3, adminOnly: true },
  { to: '/users', label: 'User Management', icon: UserCog, adminOnly: true },
  { to: '/audit-log', label: 'Audit Log', icon: ScrollText, adminOnly: true },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { hasRole } = useApp()
  const isAdmin = hasRole('Administrator')

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]'
        : 'text-gray-600 hover:bg-black/5 hover:text-[var(--color-text)]'
    }`

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <Store size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-[var(--color-text)]">San Hussein Mall</p>
              <p className="text-xs leading-tight text-[var(--color-text-muted)]">CRM System</p>
            </div>
          </div>
          <button className="rounded-md p-1 text-gray-500 hover:bg-black/5 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => linkClasses(isActive)} onClick={onClose}>
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="border-t border-[var(--color-border)] px-5 py-4 text-xs text-[var(--color-text-muted)]">
          Jimeta, Yola &middot; Adamawa State
        </div>
      </aside>
    </>
  )
}

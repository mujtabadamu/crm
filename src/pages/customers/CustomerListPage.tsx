import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Pencil, Phone, Plus, Search, Trash2, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { CustomerFormModal } from './CustomerFormModal'
import { formatCurrency, formatDate, initials } from '../../lib/format'
import type { Customer } from '../../types'

export function CustomerListPage() {
  const { customers, deleteCustomer } = useApp()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.phone.includes(q) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    )
  }, [customers, query])

  function openAdd() {
    setEditingCustomer(null)
    setModalOpen(true)
  }

  function openEdit(customer: Customer) {
    setEditingCustomer(customer)
    setModalOpen(true)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    deleteCustomer(pendingDelete.id)
    toast.success('Customer record deleted')
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Search, register, and manage customer information."
        actions={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Plus size={16} /> Register Customer
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:max-w-sm">
        <Search size={16} className="text-[var(--color-text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone or email"
          className="w-full text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description={query ? 'Try a different search term.' : 'Register your first customer to get started.'}
          action={
            !query && (
              <button onClick={openAdd} className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
                Register Customer
              </button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1"><Phone size={12} /> Phone</span>
                  </th>
                  <th className="px-4 py-3 font-medium">Loyalty Points</th>
                  <th className="px-4 py-3 font-medium">Total Spent</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <Link to={`/customers/${c.id}`} className="flex items-center gap-3 group">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary-dark)]">
                          {initials(c.firstName, c.lastName)}
                        </span>
                        <span className="font-medium text-[var(--color-text)] group-hover:underline">
                          {c.firstName} {c.lastName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{c.phone}</td>
                    <td className="px-4 py-3">{c.loyaltyPoints.toLocaleString()} pts</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(c.totalSpent)}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-black/5" aria-label="Edit customer">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setPendingDelete(c)} className="rounded-md p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]" aria-label="Delete customer">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CustomerFormModal key={String(modalOpen)} open={modalOpen} onClose={() => setModalOpen(false)} customer={editingCustomer} />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete customer"
        message={`Are you sure you want to delete ${pendingDelete?.firstName} ${pendingDelete?.lastName}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

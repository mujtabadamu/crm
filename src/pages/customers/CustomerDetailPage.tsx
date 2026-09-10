import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Gift, Mail, MapPin, Pencil, Phone, ShoppingBag } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { CustomerFormModal } from './CustomerFormModal'
import { formatCurrency, formatDateTime, initials } from '../../lib/format'

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { customers, transactions, loyaltyRedemptions } = useApp()
  const [editOpen, setEditOpen] = useState(false)

  const customer = customers.find((c) => c.id === id)

  const purchases = useMemo(
    () =>
      transactions
        .filter((t) => t.customerId === id)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [transactions, id],
  )

  const redemptions = useMemo(
    () =>
      loyaltyRedemptions
        .filter((r) => r.customerId === id)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [loyaltyRedemptions, id],
  )

  if (!customer) {
    return <Navigate to="/customers" replace />
  }

  return (
    <div>
      <Link to="/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
        <ArrowLeft size={15} /> Back to customers
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-base font-semibold text-[var(--color-primary-dark)]">
                {initials(customer.firstName, customer.lastName)}
              </span>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">Customer since {formatDateTime(customer.createdAt)}</p>
              </div>
            </div>
            <button onClick={() => setEditOpen(true)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-black/5" aria-label="Edit customer">
              <Pencil size={16} />
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-text)]">
              <Phone size={15} className="text-[var(--color-text-muted)]" /> {customer.phone}
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-[var(--color-text)]">
                <Mail size={15} className="text-[var(--color-text-muted)]" /> {customer.email}
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2 text-[var(--color-text)]">
                <MapPin size={15} className="text-[var(--color-text-muted)]" /> {customer.address}
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[var(--color-primary-soft)] p-3">
              <p className="text-xs text-[var(--color-primary-dark)]">Loyalty Points</p>
              <p className="text-lg font-semibold text-[var(--color-primary-dark)]">{customer.loyaltyPoints.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Total Spent</p>
              <p className="text-lg font-semibold text-amber-700">{formatCurrency(customer.totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
            <ShoppingBag size={16} className="text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Purchase History</h3>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {purchases.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">No transactions recorded for this customer yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Items</th>
                    <th className="px-4 py-2 font-medium">Cashier</th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((t) => (
                    <tr key={t.id} className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{formatDateTime(t.date)}</td>
                      <td className="px-4 py-2.5">{t.items.map((i) => `${i.productName} x${i.quantity}`).join(', ')}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{t.cashierName}</td>
                      <td className="px-4 py-2.5 text-right font-medium">{formatCurrency(t.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-b border-[var(--color-border)] px-4 py-3">
            <Gift size={16} className="text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Loyalty Redemptions</h3>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {redemptions.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">No points redeemed yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {redemptions.map((r) => (
                  <li key={r.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div>
                      <p className="text-[var(--color-text)]">{r.description}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{formatDateTime(r.date)}</p>
                    </div>
                    <Badge tone="amber">-{r.pointsRedeemed} pts</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <CustomerFormModal key={String(editOpen)} open={editOpen} onClose={() => setEditOpen(false)} customer={customer} />
    </div>
  )
}

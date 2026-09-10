import { useMemo, useState } from 'react'
import { Gift, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatDateTime, initials } from '../../lib/format'
import { RedeemPointsModal } from './RedeemPointsModal'
import type { Customer } from '../../types'

export function LoyaltyPage() {
  const { customers, loyaltyRedemptions } = useApp()
  const [query, setQuery] = useState('')
  const [redeeming, setRedeeming] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
    if (!q) return sorted
    return sorted.filter((c) => c.phone.includes(q) || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q))
  }, [customers, query])

  const recentRedemptions = useMemo(
    () => [...loyaltyRedemptions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 8),
    [loyaltyRedemptions],
  )

  const customerName = (id: string) => {
    const c = customers.find((c) => c.id === id)
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown'
  }

  return (
    <div>
      <PageHeader title="Loyalty Points" description="1 point is earned for every ₦100 spent. Track balances and redeem points." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:max-w-sm">
            <Search size={16} className="text-[var(--color-text-muted)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or phone" className="w-full text-sm outline-none" />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Gift} title="No customers found" />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Points Balance</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.02]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary-dark)]">
                              {initials(c.firstName, c.lastName)}
                            </span>
                            <span className="font-medium text-[var(--color-text)]">
                              {c.firstName} {c.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{c.phone}</td>
                        <td className="px-4 py-3 font-medium">{c.loyaltyPoints.toLocaleString()} pts</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setRedeeming(c)}
                            disabled={c.loyaltyPoints === 0}
                            className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Redeem Points
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Recent Redemptions</h3>
          {recentRedemptions.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No redemptions recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentRedemptions.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--color-text)]">{customerName(r.customerId)}</span>
                    <span className="text-xs font-medium text-[var(--color-danger)]">-{r.pointsRedeemed} pts</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{r.description}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDateTime(r.date)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <RedeemPointsModal key={String(!!redeeming)} customer={redeeming} onClose={() => setRedeeming(null)} />
    </div>
  )
}

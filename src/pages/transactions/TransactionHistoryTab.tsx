import { useMemo, useState } from 'react'
import { Eye, Receipt, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatCurrency, formatDateTime } from '../../lib/format'
import type { Transaction } from '../../types'
import { ReceiptModal } from './ReceiptModal'

export function TransactionHistoryTab() {
  const { transactions, customers } = useApp()
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState<Transaction | null>(null)

  const customerName = (id: string) => {
    const c = customers.find((c) => c.id === id)
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown customer'
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date))
    if (!q) return sorted
    return sorted.filter((t) => {
      const customer = customers.find((c) => c.id === t.customerId)
      return (
        customer?.phone.includes(q) ||
        `${customer?.firstName} ${customer?.lastName}`.toLowerCase().includes(q) ||
        t.cashierName.toLowerCase().includes(q)
      )
    })
  }, [transactions, customers, query])

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:max-w-sm">
        <Search size={16} className="text-[var(--color-text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by customer, phone, or cashier"
          className="w-full text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions found" description="Record a sale from the New Sale tab." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Cashier</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDateTime(t.date)}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">{customerName(t.customerId)}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{t.cashierName}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{t.items.length} item(s)</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(t.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button onClick={() => setViewing(t)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-black/5" aria-label="View receipt">
                          <Eye size={15} />
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

      <ReceiptModal transaction={viewing} onClose={() => setViewing(null)} />
    </div>
  )
}

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Award, Gift, Package, ShoppingCart } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatCard } from '../../components/ui/StatCard'
import { formatCurrency, formatDate } from '../../lib/format'

export function ReportsPage() {
  const { transactions, customers, loyaltyRedemptions } = useApp()

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalTransactions = transactions.length
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0

  const salesTrend = useMemo(() => {
    const byDay = new Map<string, number>()
    transactions.forEach((t) => {
      const day = formatDate(t.date)
      byDay.set(day, (byDay.get(day) ?? 0) + t.total)
    })
    return Array.from(byDay.entries()).map(([day, total]) => ({ day, total }))
  }, [transactions])

  const topCustomers = useMemo(() => [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10), [customers])

  const productPerformance = useMemo(() => {
    const stats = new Map<string, { name: string; quantity: number; revenue: number }>()
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        const entry = stats.get(item.productId) ?? { name: item.productName, quantity: 0, revenue: 0 }
        entry.quantity += item.quantity
        entry.revenue += item.lineTotal
        stats.set(item.productId, entry)
      })
    })
    return Array.from(stats.values()).sort((a, b) => b.revenue - a.revenue)
  }, [transactions])

  const totalPointsIssued = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0) + loyaltyRedemptions.reduce((sum, r) => sum + r.pointsRedeemed, 0)
  const totalPointsRedeemed = loyaltyRedemptions.reduce((sum, r) => sum + r.pointsRedeemed, 0)
  const topPointHolders = useMemo(() => [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints).slice(0, 5), [customers])

  return (
    <div>
      <PageHeader title="Reports" description="Sales, customer, product, and loyalty performance summaries." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} icon={ShoppingCart} tone="primary" />
        <StatCard label="Transactions" value={totalTransactions.toString()} icon={Package} tone="blue" />
        <StatCard label="Average Sale" value={formatCurrency(averageSale)} icon={Award} tone="accent" />
        <StatCard label="Points Redeemed" value={totalPointsRedeemed.toLocaleString()} icon={Gift} tone="amber" />
      </div>

      <section className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Sales Summary</h2>
        {salesTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e5ea" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} cursor={{ fill: 'rgba(47,111,79,0.08)' }} />
              <Bar dataKey="total" fill="#2f6f4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">No sales data available.</p>
        )}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Top Customers</h2>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-2 font-medium">Customer</th>
                  <th className="px-4 py-2 font-medium">Phone</th>
                  <th className="px-4 py-2 text-right font-medium">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-2.5 font-medium text-[var(--color-text)]">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{c.phone}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{formatCurrency(c.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Product Performance</h2>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {productPerformance.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">No sales recorded yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium">Units Sold</th>
                    <th className="px-4 py-2 text-right font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.map((p) => (
                    <tr key={p.name} className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-2.5 font-medium text-[var(--color-text)]">{p.name}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{p.quantity}</td>
                      <td className="px-4 py-2.5 text-right font-medium">{formatCurrency(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Loyalty Summary</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-[var(--color-primary-soft)] p-3">
            <p className="text-xs text-[var(--color-primary-dark)]">Total Points Issued (lifetime)</p>
            <p className="text-lg font-semibold text-[var(--color-primary-dark)]">{totalPointsIssued.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="text-xs text-amber-700">Total Points Redeemed</p>
            <p className="text-lg font-semibold text-amber-700">{totalPointsRedeemed.toLocaleString()}</p>
          </div>
        </div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Top Point Holders</h3>
        <ul className="divide-y divide-[var(--color-border)]">
          {topPointHolders.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">
                {c.firstName} {c.lastName}
              </span>
              <span className="text-[var(--color-text-muted)]">{c.loyaltyPoints.toLocaleString()} pts</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Gift, Package, ShoppingCart, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { formatCurrency, formatDate } from '../lib/format'

export function DashboardPage() {
  const { currentUser, customers, products, transactions } = useApp()

  const totalSales = useMemo(() => transactions.reduce((sum, t) => sum + t.total, 0), [transactions])
  const totalLoyaltyPoints = useMemo(() => customers.reduce((sum, c) => sum + c.loyaltyPoints, 0), [customers])
  const lowStockProducts = useMemo(() => products.filter((p) => p.stock <= 15), [products])

  const topCustomers = useMemo(
    () => [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5),
    [customers],
  )

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5),
    [transactions],
  )

  const chartData = useMemo(() => {
    const byDay = new Map<string, number>()
    transactions.forEach((t) => {
      const day = formatDate(t.date)
      byDay.set(day, (byDay.get(day) ?? 0) + t.total)
    })
    return Array.from(byDay.entries())
      .map(([day, total]) => ({ day, total }))
      .slice(-7)
  }, [transactions])

  const customerName = (id: string) => {
    const c = customers.find((c) => c.id === id)
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown'
  }

  return (
    <div>
      <PageHeader title={`Welcome back, ${currentUser?.fullName.split(' ')[0]}`} description="Here is what's happening at San Hussein Mall today." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Customers" value={customers.length.toString()} icon={Users} tone="primary" />
        <StatCard label="Products in Stock" value={products.length.toString()} icon={Package} tone="blue" />
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} icon={ShoppingCart} tone="accent" />
        <StatCard label="Loyalty Points Issued" value={totalLoyaltyPoints.toLocaleString()} icon={Gift} tone="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Sales Overview</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} cursor={{ fill: 'rgba(47,111,79,0.08)' }} />
                <Bar dataKey="total" fill="#2f6f4f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">No transactions recorded yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Top Customers</h3>
          <ul className="space-y-3">
            {topCustomers.map((c, idx) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-[var(--color-text-muted)]">
                    {idx + 1}
                  </span>
                  <Link to={`/customers/${c.id}`} className="font-medium text-[var(--color-text)] hover:underline">
                    {c.firstName} {c.lastName}
                  </Link>
                </div>
                <span className="text-[var(--color-text-muted)]">{formatCurrency(c.totalSpent)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Transactions</h3>
            <Link to="/transactions" className="text-xs font-medium text-[var(--color-primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-2 font-medium">Customer</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Cashier</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-2.5">{customerName(t.customerId)}</td>
                    <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{formatDate(t.date)}</td>
                    <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{t.cashierName}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{formatCurrency(t.total)}</td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Low Stock Alerts</h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">All products are well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {lowStockProducts.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text)]">{p.name}</span>
                  <Badge tone={p.stock === 0 ? 'red' : 'amber'}>{p.stock} left</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

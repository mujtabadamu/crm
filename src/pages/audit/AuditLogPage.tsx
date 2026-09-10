import { useMemo, useState } from 'react'
import { ScrollText, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { formatDateTime } from '../../lib/format'
import type { AuditAction } from '../../types'

function toneForAction(action: AuditAction): 'green' | 'red' | 'blue' | 'gray' | 'amber' {
  if (action === 'ACCESS_DENIED' || action === 'LOGIN_FAILED') return 'red'
  if (action === 'LOGIN' || action === 'LOGOUT') return 'blue'
  if (action.startsWith('DELETE')) return 'red'
  if (action.startsWith('CREATE')) return 'green'
  if (action.startsWith('UPDATE')) return 'amber'
  return 'gray'
}

export function AuditLogPage() {
  const { auditLog } = useApp()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...auditLog].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    if (!q) return sorted
    return sorted.filter(
      (a) => a.username.toLowerCase().includes(q) || a.action.toLowerCase().includes(q) || a.details.toLowerCase().includes(q),
    )
  }, [auditLog, query])

  return (
    <div>
      <PageHeader title="Audit Log" description="A record of important activities performed within the system." />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:max-w-sm">
        <Search size={16} className="text-[var(--color-text-muted)]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by user, action, or details" className="w-full text-sm outline-none" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ScrollText} title="No audit records found" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDateTime(entry.timestamp)}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">{entry.username}</td>
                    <td className="px-4 py-3">
                      <Badge tone={toneForAction(entry.action)}>{entry.action.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

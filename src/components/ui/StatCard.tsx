import type { ComponentType } from 'react'

interface StatCardProps {
  label: string
  value: string
  icon: ComponentType<{ size?: number; className?: string }>
  hint?: string
  tone?: 'primary' | 'accent' | 'blue' | 'amber'
}

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  primary: 'bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]',
  accent: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-orange-50 text-orange-700',
}

export function StatCard({ label, value, icon: Icon, hint, tone = 'primary' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
      {hint && <p className="mt-2 text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  )
}

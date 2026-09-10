import type { ReactNode } from 'react'

type Tone = 'green' | 'amber' | 'red' | 'gray' | 'blue'

const toneClasses: Record<Tone, string> = {
  green: 'bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-50 text-blue-700',
}

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}

import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { NewSaleTab } from './NewSaleTab'
import { TransactionHistoryTab } from './TransactionHistoryTab'

type Tab = 'new' | 'history'

export function TransactionsPage() {
  const [tab, setTab] = useState<Tab>('new')

  return (
    <div>
      <PageHeader title="Transactions" description="Record sales and review transaction history." />

      <div className="mb-5 flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 sm:w-fit">
        <button
          onClick={() => setTab('new')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            tab === 'new' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-black/5'
          }`}
        >
          New Sale
        </button>
        <button
          onClick={() => setTab('history')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            tab === 'history' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-black/5'
          }`}
        >
          History
        </button>
      </div>

      {tab === 'new' ? <NewSaleTab /> : <TransactionHistoryTab />}
    </div>
  )
}

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Percent, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Badge } from '../../components/ui/Badge'
import { PromotionFormModal } from './PromotionFormModal'
import { formatCurrency, formatDate } from '../../lib/format'
import type { Promotion } from '../../types'

export function PromotionsPage() {
  const { promotions, deletePromotion } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Promotion | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  function statusOf(p: Promotion): { label: string; tone: 'green' | 'gray' | 'amber' } {
    if (!p.active) return { label: 'Inactive', tone: 'gray' }
    if (today < p.startDate) return { label: 'Scheduled', tone: 'amber' }
    if (today > p.endDate) return { label: 'Expired', tone: 'gray' }
    return { label: 'Live', tone: 'green' }
  }

  function openAdd() {
    setEditingPromotion(null)
    setModalOpen(true)
  }

  function openEdit(promotion: Promotion) {
    setEditingPromotion(promotion)
    setModalOpen(true)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    deletePromotion(pendingDelete.id)
    toast.success('Promotion deleted')
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="Promotions"
        description="Create and manage promotional campaigns applied at checkout."
        actions={
          <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            <Plus size={16} /> New Promotion
          </button>
        }
      />

      {promotions.length === 0 ? (
        <EmptyState icon={Percent} title="No promotions yet" description="Create a promotion to offer discounts at checkout." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((p) => {
            const status = statusOf(p)
            return (
              <div key={p.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-[var(--color-text)]">{p.title}</h3>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
                <p className="mb-3 text-2xl font-semibold text-[var(--color-primary-dark)]">
                  {p.discountType === 'percentage' ? `${p.discountValue}%` : formatCurrency(p.discountValue)}
                  <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">off</span>
                </p>
                <p className="mb-4 text-xs text-[var(--color-text-muted)]">
                  {formatDate(p.startDate)} &rarr; {formatDate(p.endDate)}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-black/5">
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setPendingDelete(p)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <PromotionFormModal key={String(modalOpen)} open={modalOpen} onClose={() => setModalOpen(false)} promotion={editingPromotion} />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete promotion"
        message={`Are you sure you want to delete "${pendingDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

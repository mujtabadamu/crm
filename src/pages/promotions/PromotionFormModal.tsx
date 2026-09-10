import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../components/ui/Modal'
import { SelectField, TextField } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import type { DiscountType, Promotion } from '../../types'

interface PromotionFormModalProps {
  open: boolean
  onClose: () => void
  promotion?: Promotion | null
}

const emptyForm = {
  title: '',
  discountType: 'percentage' as DiscountType,
  discountValue: '',
  startDate: '',
  endDate: '',
  active: true,
}

function initialForm(promotion?: Promotion | null) {
  return promotion
    ? {
        title: promotion.title,
        discountType: promotion.discountType,
        discountValue: String(promotion.discountValue),
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        active: promotion.active,
      }
    : emptyForm
}

// The parent passes key={String(open)} so this component remounts fresh each time it opens.
export function PromotionFormModal({ open, onClose, promotion }: PromotionFormModalProps) {
  const { addPromotion, updatePromotion } = useApp()
  const [form, setForm] = useState(() => initialForm(promotion))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    if (!form.title.trim()) nextErrors.title = 'Promotion title is required.'
    const value = Number(form.discountValue)
    if (!form.discountValue || Number.isNaN(value) || value <= 0) nextErrors.discountValue = 'Enter a valid discount value.'
    if (form.discountType === 'percentage' && value > 100) nextErrors.discountValue = 'Percentage discount cannot exceed 100.'
    if (!form.startDate) nextErrors.startDate = 'Start date is required.'
    if (!form.endDate) nextErrors.endDate = 'End date is required.'
    if (form.startDate && form.endDate && form.endDate < form.startDate) nextErrors.endDate = 'End date must be after start date.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      title: form.title.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      startDate: form.startDate,
      endDate: form.endDate,
      active: form.active,
    }

    if (promotion) {
      updatePromotion(promotion.id, payload)
      toast.success('Promotion updated successfully')
    } else {
      addPromotion(payload)
      toast.success('Promotion created successfully')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      title={promotion ? 'Edit Promotion' : 'Create New Promotion'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" form="promotion-form" className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            {promotion ? 'Save Changes' : 'Create Promotion'}
          </button>
        </>
      }
    >
      <form id="promotion-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField label="Promotion Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} />
        </div>
        <SelectField
          label="Discount Type"
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value as DiscountType })}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount (₦)</option>
        </SelectField>
        <TextField
          label={form.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₦)'}
          type="number"
          min="0"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          error={errors.discountValue}
        />
        <TextField label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} error={errors.startDate} />
        <TextField label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} error={errors.endDate} />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-[var(--color-border)]" />
          <span className="font-medium text-[var(--color-text)]">Active</span>
        </label>
      </form>
    </Modal>
  )
}

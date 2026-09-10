import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../components/ui/Modal'
import { TextField } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import type { Customer } from '../../types'

// The parent passes key={String(!!customer)} so this component remounts fresh each time it opens.
export function RedeemPointsModal({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  const { redeemPoints } = useApp()
  const [points, setPoints] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!customer) return
    const value = Number(points)
    if (!points || Number.isNaN(value) || value <= 0 || !Number.isInteger(value)) {
      setError('Enter a valid whole number of points.')
      return
    }
    const result = redeemPoints(customer.id, value, description.trim())
    if (!result.success) {
      setError(result.message ?? 'Unable to redeem points.')
      return
    }
    toast.success('Loyalty points redeemed successfully')
    onClose()
  }

  return (
    <Modal
      open={!!customer}
      title={`Redeem Points — ${customer ? `${customer.firstName} ${customer.lastName}` : ''}`}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" form="redeem-form" className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            Redeem
          </button>
        </>
      }
    >
      {customer && (
        <form id="redeem-form" onSubmit={handleSubmit} className="space-y-4">
          <p className="rounded-lg bg-[var(--color-primary-soft)] px-3 py-2 text-sm text-[var(--color-primary-dark)]">
            Available balance: <strong>{customer.loyaltyPoints.toLocaleString()} points</strong>
          </p>
          <TextField
            label="Points to Redeem"
            type="number"
            min="1"
            max={customer.loyaltyPoints}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            error={error}
          />
          <TextField
            label="Redemption Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Discount on next purchase"
          />
        </form>
      )}
    </Modal>
  )
}

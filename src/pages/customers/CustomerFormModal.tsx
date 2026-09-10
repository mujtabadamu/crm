import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../components/ui/Modal'
import { TextField } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import type { Customer } from '../../types'

interface CustomerFormModalProps {
  open: boolean
  onClose: () => void
  customer?: Customer | null
}

const emptyForm = { firstName: '', lastName: '', phone: '', email: '', address: '' }

function initialForm(customer?: Customer | null) {
  return customer
    ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      }
    : emptyForm
}

// The parent passes key={String(open)} so this component remounts fresh
// each time it opens, giving each edit/add session its own initial state.
export function CustomerFormModal({ open, onClose, customer }: CustomerFormModalProps) {
  const { addCustomer, updateCustomer, customers } = useApp()
  const [form, setForm] = useState(() => initialForm(customer))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.'
    if (!/^0\d{9,10}$/.test(form.phone.trim())) nextErrors.phone = 'Enter a valid phone number (e.g. 08031234567).'
    else if (customers.some((c) => c.phone === form.phone.trim() && c.id !== customer?.id)) {
      nextErrors.phone = 'A customer with this phone number already exists.'
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    }

    if (customer) {
      updateCustomer(customer.id, payload)
      toast.success('Customer updated successfully')
    } else {
      addCustomer(payload)
      toast.success('Customer registered successfully')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      title={customer ? 'Edit Customer' : 'Register New Customer'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" form="customer-form" className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            {customer ? 'Save Changes' : 'Register Customer'}
          </button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          error={errors.firstName}
        />
        <TextField
          label="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          error={errors.lastName}
        />
        <TextField
          label="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
          placeholder="08031234567"
        />
        <TextField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="optional"
        />
        <div className="sm:col-span-2">
          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="optional"
          />
        </div>
      </form>
    </Modal>
  )
}

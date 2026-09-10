import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../components/ui/Modal'
import { SelectField, TextField } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import type { Role, User } from '../../types'

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  user?: User | null
}

const emptyForm = { username: '', password: '', fullName: '', role: 'Cashier' as Role, active: true }

function initialForm(user?: User | null) {
  return user
    ? { username: user.username, password: user.password, fullName: user.fullName, role: user.role, active: user.active }
    : emptyForm
}

// The parent passes key={String(open)} so this component remounts fresh each time it opens.
export function UserFormModal({ open, onClose, user }: UserFormModalProps) {
  const { addUser, updateUser } = useApp()
  const [form, setForm] = useState(() => initialForm(user))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!form.username.trim()) nextErrors.username = 'Username is required.'
    if (!form.password || form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      username: form.username.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      role: form.role,
      active: form.active,
    }

    if (user) {
      updateUser(user.id, payload)
      toast.success('User updated successfully')
      onClose()
    } else {
      const result = addUser(payload)
      if (!result.success) {
        setErrors({ username: result.message ?? 'Unable to create user.' })
        return
      }
      toast.success('User account created successfully')
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      title={user ? 'Edit User' : 'Create New User'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" form="user-form" className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            {user ? 'Save Changes' : 'Create User'}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} />
        </div>
        <TextField label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} error={errors.username} />
        <TextField label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
        <SelectField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
          <option value="Administrator">Administrator</option>
          <option value="Cashier">Cashier</option>
        </SelectField>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-[var(--color-border)]" />
          <span className="font-medium text-[var(--color-text)]">Active account</span>
        </label>
      </form>
    </Modal>
  )
}

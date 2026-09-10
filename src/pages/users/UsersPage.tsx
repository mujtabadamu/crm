import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Plus, Trash2, UserCog } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Badge } from '../../components/ui/Badge'
import { UserFormModal } from './UserFormModal'
import { formatDate } from '../../lib/format'
import type { User } from '../../types'

export function UsersPage() {
  const { users, currentUser, deleteUser } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)

  function openAdd() {
    setEditingUser(null)
    setModalOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setModalOpen(true)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    deleteUser(pendingDelete.id)
    toast.success('User account deleted')
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage system users and control role-based access."
        actions={
          <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            <Plus size={16} /> New User
          </button>
        }
      />

      {users.length === 0 ? (
        <EmptyState icon={UserCog} title="No users found" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                      {u.fullName} {u.id === currentUser?.id && <span className="text-xs text-[var(--color-text-muted)]">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{u.username}</td>
                    <td className="px-4 py-3">
                      <Badge tone={u.role === 'Administrator' ? 'blue' : 'gray'}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={u.active ? 'green' : 'red'}>{u.active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(u)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-black/5" aria-label="Edit user">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setPendingDelete(u)}
                          disabled={u.id === currentUser?.id}
                          className="rounded-md p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserFormModal key={String(modalOpen)} open={modalOpen} onClose={() => setModalOpen(false)} user={editingUser} />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete user"
        message={`Are you sure you want to delete the account "${pendingDelete?.username}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

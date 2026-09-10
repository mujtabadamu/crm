import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Badge } from '../../components/ui/Badge'
import { ProductFormModal } from './ProductFormModal'
import { formatCurrency } from '../../lib/format'
import type { Product } from '../../types'

export function ProductListPage() {
  const { products, deleteProduct } = useApp()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }, [products, query])

  function openAdd() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    deleteProduct(pendingDelete.id)
    toast.success('Product deleted')
    setPendingDelete(null)
  }

  function stockTone(stock: number) {
    if (stock === 0) return 'red'
    if (stock <= 15) return 'amber'
    return 'green'
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage product catalog, pricing, and stock levels."
        actions={
          <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            <Plus size={16} /> Add Product
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:max-w-sm">
        <Search size={16} className="text-[var(--color-text-muted)]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or category" className="w-full text-sm outline-none" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description={query ? 'Try a different search term.' : 'Add your first product to the catalog.'} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">{p.name}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{p.category}</td>
                    <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={stockTone(p.stock)}>{p.stock} units</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-black/5" aria-label="Edit product">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setPendingDelete(p)} className="rounded-md p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]" aria-label="Delete product">
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

      <ProductFormModal key={String(modalOpen)} open={modalOpen} onClose={() => setModalOpen(false)} product={editingProduct} />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

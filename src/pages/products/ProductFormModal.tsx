import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../components/ui/Modal'
import { TextField } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import type { Product } from '../../types'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  product?: Product | null
}

const emptyForm = { name: '', category: '', price: '', stock: '' }

function initialForm(product?: Product | null) {
  return product
    ? { name: product.name, category: product.category, price: String(product.price), stock: String(product.stock) }
    : emptyForm
}

// The parent passes key={String(open)} so this component remounts fresh each time it opens.
export function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const { addProduct, updateProduct } = useApp()
  const [form, setForm] = useState(() => initialForm(product))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim()) nextErrors.name = 'Product name is required.'
    if (!form.category.trim()) nextErrors.category = 'Category is required.'
    const price = Number(form.price)
    if (!form.price || Number.isNaN(price) || price <= 0) nextErrors.price = 'Enter a valid price.'
    const stock = Number(form.stock)
    if (form.stock === '' || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      nextErrors.stock = 'Enter a valid stock quantity.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    }

    if (product) {
      updateProduct(product.id, payload)
      toast.success('Product updated successfully')
    } else {
      addProduct(payload)
      toast.success('Product added successfully')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      title={product ? 'Edit Product' : 'Add New Product'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" form="product-form" className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]">
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        </div>
        <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} error={errors.category} />
        <TextField
          label="Price (₦)"
          type="number"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          error={errors.price}
        />
        <TextField
          label="Stock Quantity"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          error={errors.stock}
        />
      </form>
    </Modal>
  )
}

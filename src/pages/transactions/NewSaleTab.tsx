import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Minus, Plus, Search, ShoppingCart, Trash2, UserCheck, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../lib/format'
import type { Transaction } from '../../types'
import { ReceiptModal } from './ReceiptModal'

interface CartLine {
  productId: string
  quantity: number
}

export function NewSaleTab() {
  const { customers, products, promotions, createTransaction } = useApp()

  const [customerQuery, setCustomerQuery] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [productQuery, setProductQuery] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [promotionId, setPromotionId] = useState<string>('')
  const [receipt, setReceipt] = useState<Transaction | null>(null)

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) ?? null

  const customerResults = useMemo(() => {
    const q = customerQuery.trim().toLowerCase()
    if (!q || selectedCustomer) return []
    return customers
      .filter((c) => c.phone.includes(q) || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q))
      .slice(0, 6)
  }, [customers, customerQuery, selectedCustomer])

  const productResults = useMemo(() => {
    const q = productQuery.trim().toLowerCase()
    const base = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : products
    return base.slice(0, 8)
  }, [products, productQuery])

  const activePromotions = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return promotions.filter((p) => p.active && p.startDate <= today && today <= p.endDate)
  }, [promotions])

  const cartDetails = useMemo(
    () =>
      cart.map((line) => {
        const product = products.find((p) => p.id === line.productId)!
        return { ...line, product, lineTotal: product.price * line.quantity }
      }),
    [cart, products],
  )

  const subtotal = cartDetails.reduce((sum, l) => sum + l.lineTotal, 0)
  const promotion = activePromotions.find((p) => p.id === promotionId)
  const discount = promotion
    ? promotion.discountType === 'percentage'
      ? Math.round((subtotal * promotion.discountValue) / 100)
      : Math.min(promotion.discountValue, subtotal)
    : 0
  const total = subtotal - discount
  const projectedPoints = Math.floor(total / 100)

  function addToCart(productId: string, stock: number) {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        if (existing.quantity >= stock) {
          toast.error('No more stock available for this product.')
          return prev
        }
        return prev.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l))
      }
      if (stock < 1) {
        toast.error('This product is out of stock.')
        return prev
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  function changeQuantity(productId: string, delta: number, stock: number) {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.productId !== productId) return l
          const nextQty = l.quantity + delta
          if (nextQty > stock) {
            toast.error('No more stock available for this product.')
            return l
          }
          return { ...l, quantity: nextQty }
        })
        .filter((l) => l.quantity > 0),
    )
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((l) => l.productId !== productId))
  }

  function resetSale() {
    setCart([])
    setSelectedCustomerId(null)
    setCustomerQuery('')
    setPromotionId('')
  }

  function completeSale() {
    if (!selectedCustomer) {
      toast.error('Please select a customer before completing the sale.')
      return
    }
    if (cart.length === 0) {
      toast.error('Add at least one product to the sale.')
      return
    }
    const result = createTransaction({
      customerId: selectedCustomer.id,
      items: cart,
      promotionId: promotion?.id,
    })
    if (!result.success) {
      toast.error(result.message ?? 'Unable to complete the sale.')
      return
    }
    toast.success('Transaction recorded successfully!')
    setReceipt(result.transaction ?? null)
    resetSale()
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">1. Select Customer</h3>
          {selectedCustomer ? (
            <div className="flex items-center justify-between rounded-lg bg-[var(--color-primary-soft)] px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-[var(--color-primary-dark)]">
                <UserCheck size={16} />
                <span className="font-medium">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </span>
                <span className="text-xs">({selectedCustomer.phone})</span>
              </div>
              <button onClick={() => setSelectedCustomerId(null)} className="rounded-md p-1 text-[var(--color-primary-dark)] hover:bg-black/5" aria-label="Clear customer">
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2">
                <Search size={15} className="text-[var(--color-text-muted)]" />
                <input
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  placeholder="Search customer by phone or name"
                  className="w-full text-sm outline-none"
                />
              </div>
              {customerResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
                  {customerResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomerId(c.id)
                        setCustomerQuery('')
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-black/5"
                    >
                      <span className="font-medium text-[var(--color-text)]">
                        {c.firstName} {c.lastName}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">{c.phone}</span>
                    </button>
                  ))}
                </div>
              )}
              {customerQuery && customerResults.length === 0 && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">No matching customer. Register them from the Customers page first.</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">2. Add Products</h3>
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2">
            <Search size={15} className="text-[var(--color-text-muted)]" />
            <input
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder="Search products"
              className="w-full text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {productResults.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p.id, p.stock)}
                disabled={p.stock === 0}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  <span className="block font-medium text-[var(--color-text)]">{p.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{p.stock} in stock</span>
                </span>
                <span className="font-medium text-[var(--color-text)]">{formatCurrency(p.price)}</span>
              </button>
            ))}
            {productResults.length === 0 && <p className="text-sm text-[var(--color-text-muted)]">No products match your search.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
          <ShoppingCart size={16} /> Sale Summary
        </h3>

        {cartDetails.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-text-muted)]">No products added yet.</p>
        ) : (
          <ul className="mb-4 max-h-64 space-y-2 overflow-y-auto pr-1">
            {cartDetails.map((line) => (
              <li key={line.productId} className="rounded-lg border border-[var(--color-border)] p-2.5">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-[var(--color-text)]">{line.product.name}</p>
                  <button onClick={() => removeLine(line.productId)} className="text-[var(--color-danger)]" aria-label="Remove item">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeQuantity(line.productId, -1, line.product.stock)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-border)] hover:bg-black/5"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => changeQuantity(line.productId, 1, line.product.stock)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-border)] hover:bg-black/5"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text)]">{formatCurrency(line.lineTotal)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <label className="mb-4 block text-sm">
          <span className="mb-1 block font-medium text-[var(--color-text)]">Apply Promotion</span>
          <select
            value={promotionId}
            onChange={(e) => setPromotionId(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">No promotion</option>
            {activePromotions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.discountType === 'percentage' ? `${p.discountValue}%` : formatCurrency(p.discountValue)})
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1.5 border-t border-[var(--color-border)] pt-3 text-sm">
          <div className="flex justify-between text-[var(--color-text-muted)]">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[var(--color-danger)]">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-[var(--color-text)]">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--color-primary-dark)]">
            <span>Loyalty points to earn</span>
            <span>+{projectedPoints}</span>
          </div>
        </div>

        <button
          onClick={completeSale}
          className="mt-4 w-full rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]"
        >
          Complete Sale
        </button>
      </div>

      <ReceiptModal transaction={receipt} onClose={() => setReceipt(null)} />
    </div>
  )
}

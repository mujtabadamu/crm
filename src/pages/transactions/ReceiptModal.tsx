import { Modal } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDateTime } from '../../lib/format'
import type { Transaction } from '../../types'

export function ReceiptModal({ transaction, onClose }: { transaction: Transaction | null; onClose: () => void }) {
  const { customers } = useApp()
  const customer = transaction ? customers.find((c) => c.id === transaction.customerId) : null

  return (
    <Modal open={!!transaction} title="Transaction Receipt" onClose={onClose} size="sm">
      {transaction && (
        <div className="text-sm">
          <div className="mb-4 border-b border-dashed border-[var(--color-border)] pb-3 text-center">
            <p className="font-semibold text-[var(--color-text)]">San Hussein Mall</p>
            <p className="text-xs text-[var(--color-text-muted)]">Jimeta, Yola, Adamawa State</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{formatDateTime(transaction.date)}</p>
          </div>

          <div className="mb-3 flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>Customer: {customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}</span>
            <span>Cashier: {transaction.cashierName}</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[var(--color-text-muted)]">
                <th className="pb-1 font-medium">Item</th>
                <th className="pb-1 text-center font-medium">Qty</th>
                <th className="pb-1 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item) => (
                <tr key={item.productId} className="border-t border-[var(--color-border)]">
                  <td className="py-1.5">{item.productName}</td>
                  <td className="py-1.5 text-center">{item.quantity}</td>
                  <td className="py-1.5 text-right">{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 space-y-1 border-t border-dashed border-[var(--color-border)] pt-3">
            <div className="flex justify-between text-[var(--color-text-muted)]">
              <span>Subtotal</span>
              <span>{formatCurrency(transaction.subtotal)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-[var(--color-danger)]">
                <span>Discount</span>
                <span>-{formatCurrency(transaction.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-[var(--color-text)]">
              <span>Total</span>
              <span>{formatCurrency(transaction.total)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-primary-dark)]">
              <span>Loyalty Points Earned</span>
              <span>+{transaction.pointsEarned}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

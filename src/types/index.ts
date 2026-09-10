export type Role = 'Administrator' | 'Cashier'

export interface User {
  id: string
  username: string
  password: string
  fullName: string
  role: Role
  active: boolean
  createdAt: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  loyaltyPoints: number
  totalSpent: number
  createdAt: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

export interface TransactionItem {
  productId: string
  productName: string
  quantity: number
  price: number
  lineTotal: number
}

export interface Transaction {
  id: string
  customerId: string
  cashierId: string
  cashierName: string
  date: string
  items: TransactionItem[]
  subtotal: number
  discount: number
  promotionId?: string
  total: number
  pointsEarned: number
}

export type DiscountType = 'percentage' | 'fixed'

export interface Promotion {
  id: string
  title: string
  discountType: DiscountType
  discountValue: number
  startDate: string
  endDate: string
  active: boolean
}

export interface LoyaltyRedemption {
  id: string
  customerId: string
  pointsRedeemed: number
  description: string
  date: string
}

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'CREATE_CUSTOMER'
  | 'UPDATE_CUSTOMER'
  | 'DELETE_CUSTOMER'
  | 'CREATE_PRODUCT'
  | 'UPDATE_PRODUCT'
  | 'DELETE_PRODUCT'
  | 'CREATE_TRANSACTION'
  | 'REDEEM_POINTS'
  | 'CREATE_PROMOTION'
  | 'UPDATE_PROMOTION'
  | 'DELETE_PROMOTION'
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'ACCESS_DENIED'

export interface AuditLogEntry {
  id: string
  userId: string
  username: string
  action: AuditAction
  details: string
  timestamp: string
}

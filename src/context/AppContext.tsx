import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  mockAuditLog,
  mockCustomers,
  mockLoyaltyRedemptions,
  mockProducts,
  mockPromotions,
  mockTransactions,
  mockUsers,
} from '../data/mockData'
import { generateId } from '../lib/id'
import type {
  AuditAction,
  AuditLogEntry,
  Customer,
  LoyaltyRedemption,
  Product,
  Promotion,
  Role,
  Transaction,
  User,
} from '../types'

const STORAGE_KEY = 'crm_app_state_v1'

interface AppState {
  currentUserId: string | null
  users: User[]
  customers: Customer[]
  products: Product[]
  transactions: Transaction[]
  promotions: Promotion[]
  loyaltyRedemptions: LoyaltyRedemption[]
  auditLog: AuditLogEntry[]
}

function seedState(): AppState {
  return {
    currentUserId: null,
    users: mockUsers,
    customers: mockCustomers,
    products: mockProducts,
    transactions: mockTransactions,
    promotions: mockPromotions,
    loyaltyRedemptions: mockLoyaltyRedemptions,
    auditLog: mockAuditLog,
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return { ...seedState(), ...parsed }
  } catch {
    return seedState()
  }
}

export interface LoginResult {
  success: boolean
  message?: string
}

export interface CreateTransactionInput {
  customerId: string
  items: { productId: string; quantity: number }[]
  promotionId?: string
}

interface AppContextValue {
  currentUser: User | null
  users: User[]
  customers: Customer[]
  products: Product[]
  transactions: Transaction[]
  promotions: Promotion[]
  loyaltyRedemptions: LoyaltyRedemption[]
  auditLog: AuditLogEntry[]
  login: (username: string, password: string) => LoginResult
  logout: () => void
  hasRole: (role: Role) => boolean
  logAccessDenied: (details: string) => void
  addCustomer: (data: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'createdAt'>) => Customer
  updateCustomer: (id: string, data: Partial<Omit<Customer, 'id'>>) => void
  deleteCustomer: (id: string) => void
  addProduct: (data: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => void
  deleteProduct: (id: string) => void
  createTransaction: (input: CreateTransactionInput) => { success: boolean; message?: string; transaction?: Transaction }
  redeemPoints: (customerId: string, points: number, description: string) => { success: boolean; message?: string }
  addPromotion: (data: Omit<Promotion, 'id'>) => Promotion
  updatePromotion: (id: string, data: Partial<Omit<Promotion, 'id'>>) => void
  deletePromotion: (id: string) => void
  addUser: (data: Omit<User, 'id' | 'createdAt'>) => { success: boolean; message?: string; user?: User }
  updateUser: (id: string, data: Partial<Omit<User, 'id'>>) => void
  deleteUser: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  )

  const pushAudit = useCallback((userId: string, username: string, action: AuditAction, details: string) => {
    setState((prev) => ({
      ...prev,
      auditLog: [
        {
          id: generateId('a'),
          userId,
          username,
          action,
          details,
          timestamp: new Date().toISOString(),
        },
        ...prev.auditLog,
      ],
    }))
  }, [])

  const login = useCallback(
    (username: string, password: string): LoginResult => {
      const user = state.users.find((u) => u.username.toLowerCase() === username.toLowerCase())
      if (!user || user.password !== password) {
        pushAudit('unknown', username || 'unknown', 'LOGIN_FAILED', `Failed login attempt for username "${username}"`)
        return { success: false, message: 'Invalid username or password.' }
      }
      if (!user.active) {
        return { success: false, message: 'This account has been deactivated.' }
      }
      setState((prev) => ({ ...prev, currentUserId: user.id }))
      pushAudit(user.id, user.username, 'LOGIN', `${user.role} logged in`)
      return { success: true }
    },
    [state.users, pushAudit],
  )

  const logout = useCallback(() => {
    if (currentUser) {
      pushAudit(currentUser.id, currentUser.username, 'LOGOUT', `${currentUser.role} logged out`)
    }
    setState((prev) => ({ ...prev, currentUserId: null }))
  }, [currentUser, pushAudit])

  const hasRole = useCallback((role: Role) => currentUser?.role === role, [currentUser])

  const logAccessDenied = useCallback(
    (details: string) => {
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'ACCESS_DENIED', details)
      }
    },
    [currentUser, pushAudit],
  )

  const addCustomer = useCallback(
    (data: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'createdAt'>) => {
      const customer: Customer = {
        ...data,
        id: generateId('c'),
        loyaltyPoints: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      }
      setState((prev) => ({ ...prev, customers: [customer, ...prev.customers] }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'CREATE_CUSTOMER', `Registered customer ${customer.firstName} ${customer.lastName}`)
      }
      return customer
    },
    [currentUser, pushAudit],
  )

  const updateCustomer = useCallback(
    (id: string, data: Partial<Omit<Customer, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        customers: prev.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'UPDATE_CUSTOMER', `Updated customer record ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const deleteCustomer = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, customers: prev.customers.filter((c) => c.id !== id) }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'DELETE_CUSTOMER', `Deleted customer record ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const addProduct = useCallback(
    (data: Omit<Product, 'id'>) => {
      const product: Product = { ...data, id: generateId('p') }
      setState((prev) => ({ ...prev, products: [product, ...prev.products] }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'CREATE_PRODUCT', `Added product ${product.name}`)
      }
      return product
    },
    [currentUser, pushAudit],
  )

  const updateProduct = useCallback(
    (id: string, data: Partial<Omit<Product, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'UPDATE_PRODUCT', `Updated product ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'DELETE_PRODUCT', `Deleted product ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const createTransaction = useCallback(
    (input: CreateTransactionInput) => {
      if (input.items.length === 0) {
        return { success: false, message: 'Add at least one product to the sale.' }
      }
      const customer = state.customers.find((c) => c.id === input.customerId)
      if (!customer) {
        return { success: false, message: 'Select a customer for this sale.' }
      }

      const items: Transaction['items'] = []
      for (const line of input.items) {
        const product = state.products.find((p) => p.id === line.productId)
        if (!product) {
          return { success: false, message: 'One of the selected products no longer exists.' }
        }
        if (line.quantity < 1) {
          return { success: false, message: `Quantity for ${product.name} must be at least 1.` }
        }
        if (product.stock < line.quantity) {
          return { success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}.` }
        }
        items.push({
          productId: product.id,
          productName: product.name,
          quantity: line.quantity,
          price: product.price,
          lineTotal: product.price * line.quantity,
        })
      }

      const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
      let discount = 0
      const promotion = input.promotionId
        ? state.promotions.find((p) => p.id === input.promotionId && p.active)
        : undefined
      if (promotion) {
        discount = promotion.discountType === 'percentage'
          ? Math.round((subtotal * promotion.discountValue) / 100)
          : Math.min(promotion.discountValue, subtotal)
      }
      const total = subtotal - discount
      const pointsEarned = Math.floor(total / 100)

      const transaction: Transaction = {
        id: generateId('t'),
        customerId: customer.id,
        cashierId: currentUser?.id ?? 'unknown',
        cashierName: currentUser?.fullName ?? 'Unknown',
        date: new Date().toISOString(),
        items,
        subtotal,
        discount,
        promotionId: promotion?.id,
        total,
        pointsEarned,
      }

      setState((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
        products: prev.products.map((p) => {
          const line = items.find((i) => i.productId === p.id)
          return line ? { ...p, stock: p.stock - line.quantity } : p
        }),
        customers: prev.customers.map((c) =>
          c.id === customer.id
            ? { ...c, loyaltyPoints: c.loyaltyPoints + pointsEarned, totalSpent: c.totalSpent + total }
            : c,
        ),
      }))

      if (currentUser) {
        pushAudit(
          currentUser.id,
          currentUser.username,
          'CREATE_TRANSACTION',
          `Recorded sale of ${total.toLocaleString()} for ${customer.firstName} ${customer.lastName}`,
        )
      }

      return { success: true, transaction }
    },
    [state.customers, state.products, state.promotions, currentUser, pushAudit],
  )

  const redeemPoints = useCallback(
    (customerId: string, points: number, description: string) => {
      const customer = state.customers.find((c) => c.id === customerId)
      if (!customer) return { success: false, message: 'Customer not found.' }
      if (points <= 0) return { success: false, message: 'Enter a valid number of points.' }
      if (customer.loyaltyPoints < points) {
        return { success: false, message: `${customer.firstName} only has ${customer.loyaltyPoints} points available.` }
      }

      const redemption: LoyaltyRedemption = {
        id: generateId('lr'),
        customerId,
        pointsRedeemed: points,
        description: description || 'Loyalty point redemption',
        date: new Date().toISOString(),
      }

      setState((prev) => ({
        ...prev,
        loyaltyRedemptions: [redemption, ...prev.loyaltyRedemptions],
        customers: prev.customers.map((c) =>
          c.id === customerId ? { ...c, loyaltyPoints: c.loyaltyPoints - points } : c,
        ),
      }))

      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'REDEEM_POINTS', `Redeemed ${points} points for ${customer.firstName} ${customer.lastName}`)
      }

      return { success: true }
    },
    [state.customers, currentUser, pushAudit],
  )

  const addPromotion = useCallback(
    (data: Omit<Promotion, 'id'>) => {
      const promotion: Promotion = { ...data, id: generateId('pr') }
      setState((prev) => ({ ...prev, promotions: [promotion, ...prev.promotions] }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'CREATE_PROMOTION', `Created promotion "${promotion.title}"`)
      }
      return promotion
    },
    [currentUser, pushAudit],
  )

  const updatePromotion = useCallback(
    (id: string, data: Partial<Omit<Promotion, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        promotions: prev.promotions.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'UPDATE_PROMOTION', `Updated promotion ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const deletePromotion = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, promotions: prev.promotions.filter((p) => p.id !== id) }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'DELETE_PROMOTION', `Deleted promotion ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const addUser = useCallback(
    (data: Omit<User, 'id' | 'createdAt'>) => {
      if (state.users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
        return { success: false, message: 'That username is already taken.' }
      }
      const user: User = { ...data, id: generateId('u'), createdAt: new Date().toISOString() }
      setState((prev) => ({ ...prev, users: [user, ...prev.users] }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'CREATE_USER', `Created user account "${user.username}" (${user.role})`)
      }
      return { success: true, user }
    },
    [state.users, currentUser, pushAudit],
  )

  const updateUser = useCallback(
    (id: string, data: Partial<Omit<User, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
      }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'UPDATE_USER', `Updated user account ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const deleteUser = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, users: prev.users.filter((u) => u.id !== id) }))
      if (currentUser) {
        pushAudit(currentUser.id, currentUser.username, 'DELETE_USER', `Deleted user account ${id}`)
      }
    },
    [currentUser, pushAudit],
  )

  const value: AppContextValue = {
    currentUser,
    users: state.users,
    customers: state.customers,
    products: state.products,
    transactions: state.transactions,
    promotions: state.promotions,
    loyaltyRedemptions: state.loyaltyRedemptions,
    auditLog: state.auditLog,
    login,
    logout,
    hasRole,
    logAccessDenied,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    createTransaction,
    redeemPoints,
    addPromotion,
    updatePromotion,
    deletePromotion,
    addUser,
    updateUser,
    deleteUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- provider + hook is the standard context pattern
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}

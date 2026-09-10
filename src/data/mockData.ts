import type {
  AuditLogEntry,
  Customer,
  LoyaltyRedemption,
  Product,
  Promotion,
  Transaction,
  User,
} from '../types'

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'admin',
    password: 'admin123',
    fullName: 'Hassan Mustapha',
    role: 'Administrator',
    active: true,
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'u2',
    username: 'cashier',
    password: 'cashier123',
    fullName: 'Amina Yusuf',
    role: 'Cashier',
    active: true,
    createdAt: '2025-01-12T09:00:00Z',
  },
  {
    id: 'u3',
    username: 'jibrin',
    password: 'cashier123',
    fullName: 'Jibrin Musa',
    role: 'Cashier',
    active: true,
    createdAt: '2025-02-01T09:00:00Z',
  },
]

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    firstName: 'Fatima',
    lastName: 'Abdullahi',
    phone: '08031234567',
    email: 'fatima.abdullahi@example.com',
    address: 'No. 12 Bekaji Road, Jimeta, Yola',
    loyaltyPoints: 240,
    totalSpent: 24500,
    createdAt: '2025-02-14T10:30:00Z',
  },
  {
    id: 'c2',
    firstName: 'Emmanuel',
    lastName: 'Okafor',
    phone: '08052345678',
    email: 'emmanuel.okafor@example.com',
    address: 'No. 5 Bank Road, Yola',
    loyaltyPoints: 610,
    totalSpent: 61200,
    createdAt: '2025-02-20T14:00:00Z',
  },
  {
    id: 'c3',
    firstName: 'Aisha',
    lastName: 'Bello',
    phone: '08163456789',
    email: 'aisha.bello@example.com',
    address: 'No. 3 Damare Street, Jimeta',
    loyaltyPoints: 95,
    totalSpent: 9800,
    createdAt: '2025-03-05T08:15:00Z',
  },
  {
    id: 'c4',
    firstName: 'Chinedu',
    lastName: 'Eze',
    phone: '07039876543',
    email: 'chinedu.eze@example.com',
    address: 'No. 21 Atiku Abubakar Way, Yola',
    loyaltyPoints: 1320,
    totalSpent: 132400,
    createdAt: '2025-01-28T11:45:00Z',
  },
  {
    id: 'c5',
    firstName: 'Hadiza',
    lastName: 'Sani',
    phone: '08098765432',
    email: 'hadiza.sani@example.com',
    address: 'No. 8 Numan Road, Jimeta',
    loyaltyPoints: 45,
    totalSpent: 4500,
    createdAt: '2025-04-02T16:20:00Z',
  },
  {
    id: 'c6',
    firstName: 'Ibrahim',
    lastName: 'Garba',
    phone: '08145678901',
    email: 'ibrahim.garba@example.com',
    address: 'No. 17 Jambutu Ward, Jimeta',
    loyaltyPoints: 780,
    totalSpent: 78900,
    createdAt: '2025-03-18T09:10:00Z',
  },
]

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Golden Penny Spaghetti 500g', category: 'Groceries', price: 850, stock: 120 },
  { id: 'p2', name: 'Peak Milk Tin 400g', category: 'Dairy', price: 1450, stock: 80 },
  { id: 'p3', name: 'Dangote Sugar 1kg', category: 'Groceries', price: 1300, stock: 65 },
  { id: 'p4', name: 'Indomie Noodles Carton', category: 'Groceries', price: 5200, stock: 40 },
  { id: 'p5', name: 'Coca-Cola 50cl (Pack of 12)', category: 'Beverages', price: 3600, stock: 55 },
  { id: 'p6', name: 'Kings Vegetable Oil 5L', category: 'Groceries', price: 9800, stock: 30 },
  { id: 'p7', name: 'Ariel Detergent 1kg', category: 'Household', price: 2200, stock: 45 },
  { id: 'p8', name: 'Closeup Toothpaste 140ml', category: 'Personal Care', price: 950, stock: 90 },
  { id: 'p9', name: 'Nivea Body Lotion 400ml', category: 'Personal Care', price: 3200, stock: 38 },
  { id: 'p10', name: 'Rite Bread (Loaf)', category: 'Bakery', price: 1200, stock: 25 },
  { id: 'p11', name: 'Fresh Yoghurt 1L', category: 'Dairy', price: 1800, stock: 20 },
  { id: 'p12', name: 'Basmati Rice 5kg', category: 'Groceries', price: 8500, stock: 50 },
]

export const mockPromotions: Promotion[] = [
  {
    id: 'pr1',
    title: 'End of Ramadan Discount',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2025-03-20',
    endDate: '2025-04-10',
    active: false,
  },
  {
    id: 'pr2',
    title: 'Independence Day Sale',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2025-09-25',
    endDate: '2025-10-05',
    active: true,
  },
  {
    id: 'pr3',
    title: 'Loyalty Customer ₦2,000 Off',
    discountType: 'fixed',
    discountValue: 2000,
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    active: true,
  },
]

export const mockLoyaltyRedemptions: LoyaltyRedemption[] = [
  {
    id: 'lr1',
    customerId: 'c2',
    pointsRedeemed: 200,
    description: 'Redeemed for ₦2,000 discount on groceries',
    date: '2025-06-12T13:00:00Z',
  },
  {
    id: 'lr2',
    customerId: 'c4',
    pointsRedeemed: 500,
    description: 'Redeemed for ₦5,000 discount on household items',
    date: '2025-07-20T10:30:00Z',
  },
]

function buildItems(
  entries: { productId: string; quantity: number }[],
): Transaction['items'] {
  return entries.map(({ productId, quantity }) => {
    const product = mockProducts.find((p) => p.id === productId)!
    return {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      lineTotal: product.price * quantity,
    }
  })
}

function sumItems(items: Transaction['items']): number {
  return items.reduce((sum, i) => sum + i.lineTotal, 0)
}

const t1Items = buildItems([
  { productId: 'p1', quantity: 3 },
  { productId: 'p5', quantity: 1 },
])
const t2Items = buildItems([
  { productId: 'p2', quantity: 2 },
  { productId: 'p3', quantity: 1 },
])
const t3Items = buildItems([{ productId: 'p6', quantity: 1 }])
const t4Items = buildItems([
  { productId: 'p4', quantity: 2 },
  { productId: 'p7', quantity: 1 },
  { productId: 'p8', quantity: 3 },
])
const t5Items = buildItems([{ productId: 'p12', quantity: 2 }])
const t6Items = buildItems([
  { productId: 'p9', quantity: 1 },
  { productId: 'p10', quantity: 2 },
])

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    customerId: 'c1',
    cashierId: 'u2',
    cashierName: 'Amina Yusuf',
    date: '2025-08-01T11:20:00Z',
    items: t1Items,
    subtotal: sumItems(t1Items),
    discount: 0,
    total: sumItems(t1Items),
    pointsEarned: Math.floor(sumItems(t1Items) / 100),
  },
  {
    id: 't2',
    customerId: 'c2',
    cashierId: 'u2',
    cashierName: 'Amina Yusuf',
    date: '2025-08-03T09:05:00Z',
    items: t2Items,
    subtotal: sumItems(t2Items),
    discount: 0,
    total: sumItems(t2Items),
    pointsEarned: Math.floor(sumItems(t2Items) / 100),
  },
  {
    id: 't3',
    customerId: 'c4',
    cashierId: 'u3',
    cashierName: 'Jibrin Musa',
    date: '2025-08-10T15:45:00Z',
    items: t3Items,
    subtotal: sumItems(t3Items),
    discount: 0,
    total: sumItems(t3Items),
    pointsEarned: Math.floor(sumItems(t3Items) / 100),
  },
  {
    id: 't4',
    customerId: 'c6',
    cashierId: 'u2',
    cashierName: 'Amina Yusuf',
    date: '2025-08-18T12:30:00Z',
    items: t4Items,
    subtotal: sumItems(t4Items),
    discount: Math.round(sumItems(t4Items) * 0.1),
    promotionId: 'pr2',
    total: sumItems(t4Items) - Math.round(sumItems(t4Items) * 0.1),
    pointsEarned: Math.floor((sumItems(t4Items) - Math.round(sumItems(t4Items) * 0.1)) / 100),
  },
  {
    id: 't5',
    customerId: 'c3',
    cashierId: 'u3',
    cashierName: 'Jibrin Musa',
    date: '2025-08-25T17:10:00Z',
    items: t5Items,
    subtotal: sumItems(t5Items),
    discount: 0,
    total: sumItems(t5Items),
    pointsEarned: Math.floor(sumItems(t5Items) / 100),
  },
  {
    id: 't6',
    customerId: 'c2',
    cashierId: 'u2',
    cashierName: 'Amina Yusuf',
    date: '2025-09-02T10:00:00Z',
    items: t6Items,
    subtotal: sumItems(t6Items),
    discount: 0,
    total: sumItems(t6Items),
    pointsEarned: Math.floor(sumItems(t6Items) / 100),
  },
]

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'a1',
    userId: 'u1',
    username: 'admin',
    action: 'LOGIN',
    details: 'Administrator logged in',
    timestamp: '2025-09-01T08:00:00Z',
  },
  {
    id: 'a2',
    userId: 'u2',
    username: 'cashier',
    action: 'LOGIN',
    details: 'Cashier logged in',
    timestamp: '2025-09-01T08:05:00Z',
  },
  {
    id: 'a3',
    userId: 'u2',
    username: 'cashier',
    action: 'CREATE_TRANSACTION',
    details: 'Recorded sale of ₦8,850 for Fatima Abdullahi',
    timestamp: '2025-08-01T11:20:00Z',
  },
  {
    id: 'a4',
    userId: 'u1',
    username: 'admin',
    action: 'CREATE_PROMOTION',
    details: 'Created promotion "Independence Day Sale"',
    timestamp: '2025-08-15T10:00:00Z',
  },
  {
    id: 'a5',
    userId: 'u2',
    username: 'cashier',
    action: 'ACCESS_DENIED',
    details: 'Attempted to access User Management (restricted)',
    timestamp: '2025-08-20T13:15:00Z',
  },
]

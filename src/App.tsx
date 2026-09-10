import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { CustomerListPage } from './pages/customers/CustomerListPage'
import { CustomerDetailPage } from './pages/customers/CustomerDetailPage'
import { ProductListPage } from './pages/products/ProductListPage'
import { TransactionsPage } from './pages/transactions/TransactionsPage'
import { LoyaltyPage } from './pages/loyalty/LoyaltyPage'
import { PromotionsPage } from './pages/promotions/PromotionsPage'
import { ReportsPage } from './pages/reports/ReportsPage'
import { UsersPage } from './pages/users/UsersPage'
import { AuditLogPage } from './pages/audit/AuditLogPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<CustomerListPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />

            <Route element={<AdminRoute />}>
              <Route path="products" element={<ProductListPage />} />
              <Route path="promotions" element={<PromotionsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="audit-log" element={<AuditLogPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProvider>
  )
}

export default App

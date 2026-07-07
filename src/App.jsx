import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProducerLayout from './layouts/ProducerLayout'
import CustomerLayout from './layouts/CustomerLayout'

// Public pages
import HomePage from './pages/auth/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import CompleteProfilePage from './pages/auth/CompleteProfilePage'
import ProductListingPage from './pages/customer/ProductListingPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'


// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CartPage from './pages/customer/CartPage'
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage'

// Producer pages
import ProducerDashboard from './pages/producer/ProducerDashboard'
import AddProductPage from './pages/producer/AddProductPage'
import ManageProductsPage from './pages/producer/ManageProductsPage'
import ProducerOrdersPage from './pages/producer/ProducerOrdersPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'

const RoleRedirect = () => {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (role === 'producer') return <Navigate to="/producer/dashboard" replace />
  return <Navigate to="/customer/dashboard" replace />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Noto Sans Sinhala, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#15803d', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e25f1e', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Role redirect */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Customer routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route element={<CustomerLayout />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/cart" element={<CartPage />} />
              <Route path="/customer/orders" element={<CustomerOrdersPage />} />
            </Route>
          </Route>

          {/* Producer routes */}
          <Route element={<ProtectedRoute allowedRoles={['producer']} />}>
            <Route element={<ProducerLayout />}>
              <Route path="/producer/dashboard" element={<ProducerDashboard />} />
              <Route path="/producer/products" element={<ManageProductsPage />} />
              <Route path="/producer/products/add" element={<AddProductPage />} />
              <Route path="/producer/products/edit/:id" element={<AddProductPage />} />
              <Route path="/producer/orders" element={<ProducerOrdersPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
          path="/complete-profile"
          element={<CompleteProfilePage />}
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

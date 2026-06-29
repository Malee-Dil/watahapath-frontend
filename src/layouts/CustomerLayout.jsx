import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/common/Sidebar'
import TopBar from '../components/common/TopBar'
import { SI } from '../utils/constants'
import { LayoutDashboard, ShoppingCart, ShoppingBag, Store } from 'lucide-react'

const customerLinks = [
  { to: '/customer/dashboard', label: SI.dashboard, icon: <LayoutDashboard size={18} /> },
  { to: '/products', label: SI.products, icon: <Store size={18} /> },
  { to: '/customer/cart', label: SI.cartTitle, icon: <ShoppingCart size={18} /> },
  { to: '/customer/orders', label: SI.myOrders, icon: <ShoppingBag size={18} /> },
]

const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        links={customerLinks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} title={SI.customerDashboard} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout

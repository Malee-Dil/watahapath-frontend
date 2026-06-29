import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/common/Sidebar'
import TopBar from '../components/common/TopBar'
import { SI } from '../utils/constants'
import { LayoutDashboard, Users, Package, ShoppingBag } from 'lucide-react'

const adminLinks = [
  { to: '/admin/dashboard', label: SI.dashboard, icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users', label: SI.userManagement, icon: <Users size={18} /> },
  { to: '/admin/products', label: SI.productManagement, icon: <Package size={18} /> },
  { to: '/admin/orders', label: SI.orderManagement, icon: <ShoppingBag size={18} /> },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        links={adminLinks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} title={SI.adminDashboard} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

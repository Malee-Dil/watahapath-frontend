import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/common/Sidebar'
import TopBar from '../components/common/TopBar'
import { SI } from '../utils/constants'
import { LayoutDashboard, Package, PlusCircle, ShoppingBag } from 'lucide-react'

const producerLinks = [
  { to: '/producer/dashboard', label: SI.dashboard, icon: <LayoutDashboard size={18} /> },
  { to: '/producer/products', label: SI.myProducts, icon: <Package size={18} /> },
  { to: '/producer/products/add', label: SI.addProduct, icon: <PlusCircle size={18} /> },
  { to: '/producer/orders', label: SI.receivedOrders, icon: <ShoppingBag size={18} /> },
]

const ProducerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        links={producerLinks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} title={SI.producerDashboard} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProducerLayout

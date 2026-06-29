import { useEffect, useState } from 'react'
import { orderService } from '../../services/orderService'
import { productService } from '../../services/productService'
import { Link } from 'react-router-dom'
import { PlusCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { SI } from '../../utils/constants'
import StatCard from '../../components/common/StatCard'
import OrderStatusBadge from '../../components/common/OrderStatusBadge'
import { formatPrice, formatDate } from '../../utils/helpers'


const ProducerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true)

      const [orderRes, productRes] = await Promise.all([
        orderService.getProducerOrders(),
        productService.getMyProducts()
      ])

      const ordersData = orderRes.data
      const productsData = productRes.data

      console.log(ordersData)

      setOrders(ordersData)

      const totalRevenue = ordersData.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      )

      const pending = ordersData.filter(o => o.status === 'pending').length

      setStats({
        products: productsData.length,
        orders: ordersData.length,
        revenue: totalRevenue,
        pendingOrders: pending
      })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  fetchDashboard()
}, [])

if (loading) {
  return <div className="p-10 text-center">Loading dashboard...</div>
}

  return (
    <div>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-400 rounded-2xl p-6 text-black mb-6">
        <p className="text-white/80 text-sm mb-1">{SI.welcomeBack}</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Yaldevi' }}>{user?.name} 🌾</h1>
        <p className="text-white/70 text-sm mt-1">ඔබේ නිෂ්පාදන & ඇණවුම් කළමනාකරණය</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label={SI.myProducts} value={stats?.products || 0} color="green" />
        <StatCard icon="🛍️" label={SI.receivedOrders} value={stats?.orders || 0} color="blue" />
        <StatCard icon="⏳" label="අපේක්ෂිත ඇණවුම්" value={stats?.pendingOrders || 0} color="orange" />
        <StatCard icon="💰" label={SI.totalRevenue} value={stats?.revenue || 0} color="gold" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/producer/products/add" className="card p-5 flex items-center gap-4 hover:border-green-200 hover:shadow-card-hover transition-all group">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
            <PlusCircle size={22} className="text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{SI.addProduct}</p>
            <p className="text-xs text-gray-500">නව නිෂ්පාදනයක් එකතු කරන්න</p>
          </div>
        </Link>
        <Link to="/producer/orders" className="card p-5 flex items-center gap-4 hover:border-primary-200 hover:shadow-card-hover transition-all group">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
            <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{SI.receivedOrders}</p>
            <p className="text-xs text-gray-500">{stats?.pendingOrders} අනිිත ඇණවුම්</p>
          </div>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Yaldevi' }}>{SI.recentOrders}</h2>
          <Link to="/producer/orders" className="text-sm text-primary-600 flex items-center gap-1 hover:underline">
            {SI.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">ගනුදෙනුකරු</th>
                <th className="table-header">නිෂ්පාදනය</th>
                <th className="table-header">ප්‍රමාණය</th>
                <th className="table-header">{SI.orderTotal}</th>
                <th className="table-header">{SI.expectedDate}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-medium text-gray-800">{o.customer.name}</td>
                  <td className="table-cell text-gray-600">{o.productName}</td>
                  <td className="table-cell">{o.quantity}</td>
                  <td className="table-cell font-semibold">{formatPrice(o.subtotal)}</td>
                  <td className="table-cell">{formatDate(o.requiredDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProducerDashboard

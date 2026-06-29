import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ShoppingCart, Package, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { SI } from '../../utils/constants'
import StatCard from '../../components/common/StatCard'
import OrderStatusBadge from '../../components/common/OrderStatusBadge'
import { formatPrice, formatDate } from '../../utils/helpers'
import { orderService } from '../../services/orderService'
import toast from 'react-hot-toast'

//const { itemCount, total } = useCart()



const CustomerDashboard = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { itemCount, total } = useCart()

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true)

      const res = await orderService.getMyOrders()

      setOrders(res.data || [])
    } catch (err) {
      console.error(err)
      toast.error('ඇණවුම් ලබාගත නොහැකි විය')
    } finally {
      setLoading(false)
    }
  }

  fetchOrders()
}, [])

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-400 rounded-2xl p-6 text-black mb-6">
        <p className="text-white/80 text-sm mb-1">{SI.welcomeBack}</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Yaldevi' }}>{user?.name} 👋</h1>
        <p className="text-white/80 text-sm mb-1">ඔබේ ඇණවුම් & නිෂ්පාදන නිරීක්ෂණය කරන්න</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📦" label={SI.myOrders} value={orders.length} color="primary" />
        <StatCard icon="🛒" label={SI.cartTitle} value={`${itemCount} ${SI.unit}`} color="orange" />
        <StatCard icon="💰" label="කූඩ වටිනාකම" value={formatPrice(total)} color="gold" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/products', icon: '🛍️', label: SI.products },
          { to: '/customer/cart', icon: '🛒', label: SI.cartTitle },
          { to: '/customer/orders', icon: '📋', label: SI.myOrders },
          { to: '/products?category=vegetables', icon: '🥬', label: 'එළවළු' },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="card p-4 flex flex-col items-center gap-2 hover:border-primary-200 hover:shadow-card-hover transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">{a.icon}</span>
            <span className="text-xs font-medium text-gray-600 text-center">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Yaldevi' }}>{SI.recentOrders}</h2>
          <Link to="/customer/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            {SI.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">ඇණවුම් ID</th>
                <th className="table-header">{SI.orderDate}</th>
                <th className="table-header">{SI.orderItems}</th>
                <th className="table-header">{SI.orderTotal}</th>
                <th className="table-header">{SI.orderStatus}</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-cell text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-cell text-center py-8">
                  ඇණවුම් නොමැත
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-mono text-xs text-gray-500">
                    #{o._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="table-cell">
                    {formatDate(o.createdAt)}
                  </td>

                  <td className="table-cell">
                    {o.items?.length || 0}
                  </td>

                  <td className="table-cell font-semibold text-gray-800">
                    {formatPrice(o.totalAmount)}
                  </td>

                  <td className="table-cell">
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { SI } from '../../utils/constants'
import StatCard from '../../components/common/StatCard'
import OrderStatusBadge from '../../components/common/OrderStatusBadge'
import { formatPrice, formatDate } from '../../utils/helpers'
import api from '../../services/api'



const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const { user } = useAuth()

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard')

      console.log('ADMIN DASHBOARD:', res.data)

      setStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  fetchDashboard()
}, [])

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-400 rounded-2xl p-6 text-black mb-6">
        <p className="text-white/60 text-sm mb-1">{SI.welcomeBack}</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Yaldevi' }}>{user?.name} ⚡</h1>
        <p className="text-white/60 text-sm mt-1">
          {stats?.pendingApprovals > 0 && (
            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
              {stats.pendingApprovals} නිෂ්පාදකයන් අනුමත කිරීම් බලාපොරොත්තු
            </span>
          )}
          සම්පූර්ණ පද්ධතිය නිරීක්ෂණය කරන්න
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label={SI.totalUsers} value={stats?.totalUsers ?? 0} color="blue" />
        <StatCard icon="📦" label={SI.totalProducts} value={stats?.totalProducts ?? 0} color="green" />
        <StatCard icon="🛍️" label={SI.totalOrders} value={stats?.totalOrders ?? 0} color="primary" />
        <StatCard icon="💰" label={SI.totalRevenue} value={formatPrice(stats?.totalRevenue ?? 0)} color="gold" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🌾" label="නිෂ්පාදකයන්" value={stats?.totalProducers ?? 0} color="green" />
        <StatCard icon="🛒" label="ගනුදෙනුකරුවන්" value={stats?.totalCustomers ?? 0} color="blue" />
        <StatCard icon="⏳" label="අපේක්ෂිත ඇණවුම්" value={stats?.pendingOrders ?? 0} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Yaldevi' }}>{SI.recentOrders}</h2>
            <Link to="/admin/orders" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
              {SI.viewAll} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ගනු.</th>
                  <th className="table-header">නිෂ්පාදනය</th>
                  <th className="table-header">මිල</th>
                  <th className="table-header">තත්ත්වය</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-sm">{o.buyer}</td>
                    <td className="table-cell text-gray-500 text-sm">{o.product}</td>
                    <td className="table-cell text-sm font-semibold">{formatPrice(o.total)}</td>
                    <td className="table-cell"><OrderStatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending producer approvals */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Yaldevi' }}>{SI.pending_approval}</h2>
            <Link to="/admin/users" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
              {SI.viewAll} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.pendingProducersList?.map(p => (
              <div key={p._id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700 text-sm">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors">
                    {SI.approveProducer.split(' ')[0]}
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">
                    {SI.rejectProducer.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

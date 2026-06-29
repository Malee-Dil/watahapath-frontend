import { useEffect, useState } from 'react'
import { orderService } from '../../services/orderService'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { SI, ORDER_STATUS } from '../../utils/constants'
import OrderStatusBadge from '../../components/common/OrderStatusBadge'
import { formatPrice, formatDate } from '../../utils/helpers'


const STATUS_OPTIONS = [
  { value: 'all', label: 'සියල්ල' },
  { value: 'pending', label: SI.pending },
  { value: 'confirmed', label: SI.confirmed },
  { value: 'processing', label: SI.processing },
  { value: 'shipped', label: SI.shipped },
  { value: 'delivered', label: SI.delivered },
  { value: 'cancelled', label: SI.cancelled },
]

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true)

      const res = await orderService.getAll()

      console.log('Orders API:', res.data)

      setOrders(res.data.data || res.data)
    } catch (err) {
      console.error('Orders fetch failed:', err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  fetchOrders()
}, [])

  const filtered = (orders || []).filter(o => {
  const matchSearch =
    !search ||
    o.buyer?.toLowerCase().includes(search.toLowerCase()) ||
    o._id?.toLowerCase().includes(search.toLowerCase()) ||
    o.producer?.toLowerCase().includes(search.toLowerCase())

  const matchStatus = statusFilter === 'all' || o.status === statusFilter

  return matchSearch && matchStatus
})

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
    toast.success('ඇණවුම් තත්ත්වය යාවත්කාලීන කළා')
  }

  const totalRevenue = (filtered || []).reduce(
  (s, o) => s + (o.status !== 'cancelled' ? o.total || 0 : 0),
  0
)

  if (loading) {
  return (
    <div className="card py-16 text-center">
      <div className="text-gray-500">Loading orders...</div>
    </div>
  )
}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{SI.orderManagement}</h1>
        <div className="text-right">
          <p className="text-xs text-gray-400">දෘශ්‍ය ඇණවුම් ආදායම</p>
          <p className="font-bold text-primary-600" style={{ fontFamily: 'Yaldevi' }}>{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {STATUS_OPTIONS.slice(1).map(s => (
          <div
            key={s.value}
            onClick={() => setStatusFilter(s.value === statusFilter ? 'all' : s.value)}
            className={`card p-3 text-center cursor-pointer hover:border-primary-200 transition-all ${statusFilter === s.value ? 'border-primary-400 bg-primary-50' : ''}`}
          >
            <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Yaldevi' }}>
              {orders.filter(o => o.status === s.value).length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ඇණවුම් ID, ගනුදෙනුකරු, නිෂ්පාදකයා..."
            className="input-field pl-10"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto min-w-[160px]">
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-2">
        {filtered.map(order => (
          <div key={order._id} className="card overflow-hidden">
            <div
              className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div>
                  {/* <p className="font-mono text-xs text-gray-400">#{order._id.toUpperCase()}</p> */}
                  <p className="font-semibold text-gray-800 text-sm">{order.customer?.name}</p>
                  <p className="text-xs text-gray-400">{order.customer?.email}</p>
                </div>
              </div>
              <div className="hidden sm:block text-center">
                <p className="text-xs text-gray-400">{SI.producers}</p>
                <p className="text-sm font-medium text-gray-700">{order.producer}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{SI.orderDate}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{SI.orderTotal}</p>
                <p className="font-bold text-primary-600" style={{ fontFamily: 'Yaldevi' }}>{formatPrice(order.totalAmount)}</p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                {expanded === order._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {expanded === order._id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* ─────────────────────────────
                      CUSTOMER DETAILS
                  ───────────────────────────── */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Customer Details
                    </p>

                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-gray-800">
                        {order.customer?.name}
                      </p>
                      <p className="text-gray-500">{order.customer?.email}</p>
                      <p className="text-gray-500">{order.customer?.phone}</p>

                      <div className="pt-2 text-gray-600">
                        <span className="text-xs text-gray-400">Address:</span>
                        <p>{order.customer?.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────
                      ORDER ITEMS (PRODUCER VIEW)
                  ───────────────────────────── */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 lg:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Order Items
                    </p>

                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-start border-b border-gray-100 pb-2"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800">
                              {item.productName}
                            </p>

                            <p className="text-xs text-gray-500">
                              Producer: {item.producerName}
                            </p>

                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-primary-600">
                              {formatPrice(item.subtotal)}
                            </p>

                            <p className="text-xs text-gray-400">
                              {item.status}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* TOTAL */}
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────
                      ORDER META INFO
                  ───────────────────────────── */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Order Info
                    </p>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Order ID</p>
                        <p className="font-mono text-xs">{order._id}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs">Created At</p>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs">Status</p>
                        <OrderStatusBadge status={order.status} />
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs">Required Date</p>
                        <p>{formatDate(order.requiredDate)}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card py-16 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400">{SI.noData}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrdersPage

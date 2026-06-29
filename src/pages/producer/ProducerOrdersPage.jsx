import { useState, useEffect } from 'react'
import { orderService } from '../../services/orderService'
import { SI, ORDER_STATUS } from '../../utils/constants'
import OrderStatusBadge from '../../components/common/OrderStatusBadge'
import { formatPrice, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'


const ProducerOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')


  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const response = await orderService.getProducerOrders()

      setOrders(response.data || [])
    } catch (error) {
      console.error(error)
      toast.error('ඇණවුම් ලබාගැනීම අසාර්ථකයි')
    } finally {
      setLoading(false)
    }
  }

  console.log(orders)

  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    o => o.order?.status === 'pending'
  ).length

  const completedOrders = orders.filter(
    o => o.order?.status === 'delivered'
  ).length

  const totalRevenue = orders
    .filter(o => o.order?.status === 'delivered')
    .reduce((sum, o) => sum + (o.subtotal || 0), 0)

  const filtered =
  filterStatus === 'all'
    ? orders
    : orders.filter(o => o.order?.status === filterStatus)

  const handleStatusChange = async (itemId, newStatus) => {
  try {
    await orderService.updateOrderItemStatus(itemId, newStatus)

    setOrders(prev =>
      prev.map(item =>
        item._id === itemId
          ? { ...item, status: newStatus }
          : item
      )
    )

    toast.success('Order updated successfully')
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      'Failed to update order'
    )
  }
}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{SI.receivedOrders}</h1>
        <span className="badge-blue">{orders.length} ඇණවුම්</span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'all', label: 'සියල්ල' },
          { value: 'pending', label: SI.pending },
          { value: 'confirmed', label: SI.confirmed },
          { value: 'processing', label: SI.processing },
          { value: 'shipped', label: SI.shipped },
          { value: 'delivered', label: SI.delivered },
          { value: 'cancelled', label: SI.cancelled },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
              filterStatus === tab.value
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter(o => o.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order._id} className="card overflow-hidden">
            {/* Order header */}
            <div
              className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-mono text-xs text-gray-400">#{order._id.toUpperCase()}</p>
                  <span className="text-gray-300">·</span>
                  <p className="text-xs text-gray-400">{formatDate(order.order?.createdAt)}</p>
                </div>
                <p className="font-semibold text-gray-800">{order.customer?.name}</p>
                <p className="text-xs text-gray-500">{order.customer?.phone} · {order.customer?.address}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-0.5">{SI.orderTotal}</p>
                  <p className="font-bold text-primary-600" style={{ fontFamily: 'Yaldevi' }}>{formatPrice(order.subtotal)}</p>
                </div>
                <OrderStatusBadge status={order.order?.status} />
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === order._id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Product Details */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      {SI.orderItems}
                    </p>

                    <div className="space-y-3">

                      <div className="flex justify-between">
                        <span className="text-gray-500">නිෂ්පාදනය</span>
                        <span className="font-medium text-gray-800">
                          {order.product?.name || order.productName}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">ප්‍රමාණය</span>
                        <span>{order.quantity}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">ඒකක මිල</span>
                        <span>{formatPrice(order.priceAtPurchase)}</span>
                      </div>

                      <div className="flex justify-between border-t pt-3 font-semibold">
                        <span>එකතුව</span>
                        <span className="text-primary-600">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      ගනුදෙනුකරුගේ තොරතුරු
                    </p>

                    <div className="space-y-3">

                      <div>
                        <p className="text-xs text-gray-400 mb-1">නම</p>
                        <p className="font-medium text-gray-800">
                          {order.customer?.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-1">දුරකථන අංකය</p>
                        <p className="font-medium text-gray-800">
                          {order.customerPhone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-1">ඊමේල්</p>
                        <p className="font-medium text-gray-800">
                          {order.customer?.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-1">අවශ්‍ය දිනය</p>
                        <p className="font-medium text-gray-800">
                          {formatDate(order.requiredDate)}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Status Update */}
                {order.status !== 'accepted' &&
                  order.status !== 'rejected' && (
                    <div className="mt-5 border-t pt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                        {SI.updateStatus}
                      </p>

                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() => handleStatusChange(order._id, 'accepted')}
                          className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition"
                        >
                          ✓ Accept Order
                        </button>

                        <button
                          onClick={() => handleStatusChange(order._id, 'rejected')}
                          className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                        >
                          ✕ Reject Order
                        </button>

                      </div>
                    </div>
                  )}
              </div>
            )}

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card py-16 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">ඇණවුම් නොමැත</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProducerOrdersPage

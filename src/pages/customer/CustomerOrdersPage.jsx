import { useEffect, useState } from 'react'
import { SI } from '../../utils/constants'
import OrderStatusBadge from '../../components/common/OrderStatusBadge'
import { formatPrice, formatDate } from '../../utils/helpers'
import EmptyState from '../../components/common/EmptyState'
import { Link } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchOrders = async () => {
  try {
    setLoading(true)

    const res = await orderService.getMyOrders()

    setOrders(res.data)

  } catch (err) {
    console.log(err)
    toast.error('ඇණවුම් ලබා ගැනීමට නොහැකි විය')
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchOrders()
}, [])

const handleCancelOrder = async (orderId) => {
  try {
    await orderService.cancel(orderId)

    toast.success('Order cancelled successfully')

    setOrders(prev =>
      prev.map(o =>
        o._id === orderId
          ? { ...o, status: 'cancelled' }
          : o
      )
    )

  } catch (err) {
    console.log(err)
    toast.error(err.response?.data?.message || 'Failed to cancel order')
  }
}

if (loading) {
  return (
    <div className="flex justify-center py-20">
      <div className="spinner" />
    </div>
  )
}
  
  return (
    <div>
      <h1 className="page-title mb-6">{SI.myOrders}</h1>

      {orders.length === 0 ? (
        <EmptyState icon="📦" title="ඇණවුම් නොමැත" subtitle="ඔබ තවමත් ඇණවුමක් ලබා දී නොමැත" action={<Link to="/products" className="btn-primary">{SI.shopNow}</Link>} />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card overflow-hidden">
              <div
                className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelected(selected === order._id ? null : order._id)}
              >
                <div>
                  <p className="font-mono text-xs text-gray-400 mb-0.5">#{order._id.toUpperCase()}</p>
                  <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-0.5">{SI.orderItems}</p>
                  <p className="font-semibold text-gray-700">{order.items.length} {SI.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-0.5">{SI.orderTotal}</p>
                  <p className="font-bold text-primary-600 text-lg" style={{ fontFamily: 'Yaldevi' }}>{formatPrice(order.totalAmount)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

             {selected === order._id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">

                  {/* ITEMS TITLE */}
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    {SI.orderItems}
                  </p>

                  {/* ITEMS LIST */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => {
                      const name = item.product?.name || item.productName
                      const qty = item.quantity
                      const subtotal =
                        item.subtotal ?? (item.priceAtPurchase * item.quantity)

                      const producer = item.producer
                      const status = item.status

                      return (
                        <div
                          key={i}
                          className="bg-white border border-gray-100 rounded-xl p-4"
                        >
                          <div className="flex justify-between gap-4">

                            {/* LEFT SIDE */}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {name}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Quantity: {qty}
                              </p>

                              {producer && (
                                <div className="mt-3 text-sm text-gray-600">
                                  <p className="text-xs text-gray-400">Producer</p>
                                  <p className="font-medium text-primary-600">
                                    {producer.name}
                                  </p>
                                  <p>📞 {producer.phone}</p>
                                </div>
                              )}

                              <p className="text-xs mt-2 text-gray-500">
                                Status: <span className="font-medium">{status}</span>
                              </p>
                            </div>

                            {/* RIGHT SIDE PRICE */}
                            <div className="text-right">
                              <p className="font-bold text-gray-800">
                                {formatPrice(subtotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* TOTAL */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {SI.total}
                    </span>

                    <span className="font-bold text-primary-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  {/* CANCEL BUTTON (FIXED POSITION) */}
                  {order.status === 'pending' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            await handleCancelOrder(order._id)

                            // instant UI update
                            setOrders(prev =>
                              prev.map(o =>
                                o._id === order._id
                                  ? { ...o, status: 'cancelled' }
                                  : o
                              )
                            )
                          } catch (err) {
                            console.error(err)
                          }
                        }}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerOrdersPage

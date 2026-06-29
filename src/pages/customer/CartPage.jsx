import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { SI, CATEGORIES } from '../../utils/constants'
import { formatPrice } from '../../utils/helpers'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import api from '../../services/api'

const CartPage = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [requiredDate, setRequiredDate] = useState('')

  const handleRemove = (id, name) => {
    removeItem(id)
    toast.success(`"${name}" කූඩයෙන් ඉවත් කළා`)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!requiredDate) {
      toast.error('Please select required date')
      return
    }

    try {
      setLoading(true)

      const payload = {
        items: items.map(i => ({
          productId: i.product._id,
          quantity: i.quantity
        })),
        requiredDate
      }

      await api.post('/orders', payload)

      toast.success('Order placed successfully 🎉')

      clearCart()
      navigate('/customer/orders')

    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title={SI.cartEmpty}
        subtitle={SI.cartEmptyDesc}
        action={
          <Link to="/products" className="btn-primary">
            {SI.continueShopping}
          </Link>
        }
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{SI.cartTitle}</h1>

        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:underline"
        >
          සියල්ල ඉවත් කරන්න
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: CART ITEMS */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const category = CATEGORIES.find(c => c.id === product.category)

            return (
              <div key={product._id} className="card p-4 flex gap-4 items-center">

                {/* Icon */}
                <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {category?.icon || '🛍️'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category?.label}
                  </p>
                  <p className="text-primary-600 font-bold text-sm mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg"
                  >
                    <Minus size={13} />
                  </button>

                  <span className="w-6 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-800">
                    {formatPrice(product.price * quantity)}
                  </p>

                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="text-red-400 hover:text-red-600 mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              ඇණවුම් සාරාංශය
            </h2>

            {/* Required Date */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <Calendar size={14} />
                අවශ්‍ය දිනය
              </label>

              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6 flex justify-between">
              <span className="font-bold">මුළු එකතුව</span>
              <span className="font-bold text-xl text-primary-600">
                {formatPrice(total)}
              </span>
            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full !justify-center py-3 text-base"
            >
              <ShoppingBag size={18} />
              {loading ? 'Processing...' : SI.placeOrder}
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3"
            >
              {SI.continueShopping}
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}

export default CartPage
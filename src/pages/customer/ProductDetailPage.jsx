import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Package, Minus, Plus } from 'lucide-react'
import { SI, CATEGORIES } from '../../utils/constants'
import { formatPrice } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import { productService } from '../../services/productService'
import EmptyState from '../../components/common/EmptyState'


const ProductDetailPage = () => {
  const { id } = useParams()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const category = product
    ? CATEGORIES.find((c) => c.id === product.category)
    : null

  // ─────────────────────────────
  // FETCH PRODUCT FROM BACKEND
  // ─────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await productService.getById(id)
        setProduct(res.data)
      } catch (err) {
        console.error(err)
        toast.error('Product load කරන්න බැරි වුණා')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])  
  // ─────────────────────────────
  // ADD TO CART
  // ─────────────────────────────
  const handleAddToCart = () => {
    if (!product) return

    addItem(product, qty)
    toast.success(`"${product.name}" කූඩයට එකතු කළා`)
  }

  // ─────────────────────────────
  // LOADING STATE
  // ─────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-10 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────
  // NOT FOUND
  // ─────────────────────────────
  if (!product) {
    return (
      <EmptyState
        icon="❌"
        title="Product not found"
        subtitle="මෙම නිෂ්පාදනය නැත"
        action={<Link to="/products" className="btn-primary">Back</Link>}
      />
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/products" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm w-fit">
        <ArrowLeft size={16} /> {SI.back}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl flex items-center justify-center text-8xl border border-orange-100">
          {category?.icon || '🛍️'}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">{category?.icon}</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">{category?.label}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Yaldevi' }}>{product.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-600" style={{ fontFamily: 'Yaldevi' }}>{formatPrice(product.price)}</span>
            <span className="text-sm text-gray-400">/ {product.unit || SI.piece}</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <span className="badge-green">✓ {SI.inStock} ({product.stock} {SI.unit})</span>
            ) : (
              <span className="badge-red">✕ {SI.outOfStock}</span>
            )}
          </div>

          {/* Quantity */}
          {product.inStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">{SI.quantity}:</span>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary flex-1 !justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={18} /> {SI.addToCart}
            </button>
          </div>

          {/* Producer info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Package size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">නිෂ්පාදකයා</p>
              <p className="text-sm font-semibold text-gray-800">{product.producer.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import { SI, CATEGORIES } from '../../utils/constants'
import { formatPrice, truncate } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  // Find matching category object (has .image field from constants.js)
  const category = CATEGORIES.find((c) => c.id === product.category)

  // Image priority: product's own image → category image from constants → generic fallback
  const imageSrc = (!imgError && product.imageUrl)
    ? product.imageUrl
    : category?.image
    || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'

  const handleCardClick = () => {
    console.log("CLICKED PRODUCT:", product._id)
    navigate(`/products/${product._id || product.id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product)
    toast.success(`"${product.name}" කූඩයට එකතු කළා`, { duration: 2000 })
  }

  return (
    <div
      className="product-card group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
            >
              {SI.outOfStock}
            </span>
          </div>
        )}

        {/* Hover eye icon */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.12)' }}
        >
          <div
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg"
            style={{ color: '#e25f1e' }}
          >
            <Eye size={16} />
          </div>
        </div>

        {/* Category badge */}
        {category && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shadow"
            style={{ background: 'rgba(255,255,255,0.92)', color: '#374151' }}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors leading-snug text-sm">
          {truncate(product.name, 50)}
        </h3>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          {truncate(product.description, 70)}
        </p>
        <p>{product.stock}</p>

        <div className="flex items-center justify-between gap-2">
          <span
            className="text-lg font-bold"
            style={{ color: '#e25f1e', fontFamily: 'Yaldevi, sans-serif' }}
          >
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-semibold rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed"
            style={{ background: product.inStock ? '#e25f1e' : '#d1d5db' }}
            onMouseEnter={e => { if (product.inStock) e.currentTarget.style.background = '#c94f10' }}
            onMouseLeave={e => { if (product.inStock) e.currentTarget.style.background = '#e25f1e' }}
          >
            <ShoppingCart size={14} />
            <span>{SI.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

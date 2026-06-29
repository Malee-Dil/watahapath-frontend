import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SI, CATEGORIES } from '../../utils/constants'
import ProductCard from '../../components/common/ProductCard'
import EmptyState from '../../components/common/EmptyState'
import { productService } from '../../services/productService'
import toast from 'react-hot-toast'
import api from '../../services/api'


const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('default')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

    // fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()

        if (selectedCategory) params.append('category', selectedCategory)
        if (search) params.append('search', search)
        if (sortBy !== 'default') params.append('sort', sortBy)

        const res = await api.get(`/products?${params.toString()}`)
        console.log('API Response:', res)

        setProducts(res.data || [])
      } catch (err) {
        console.error(err)
        toast.error('නිෂ්පාදන ලබා ගැනීමට නොහැකි විය')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, search, sortBy])

  // const filtered = products
  //   .filter((p) => {
  //     const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
  //     const matchCat = !selectedCategory || p.category === selectedCategory
  //     return matchSearch && matchCat
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === 'price_asc') return a.price - b.price
  //     if (sortBy === 'price_desc') return b.price - a.price
  //     return 0
  //   })

  const handleCategoryClick = (catId) => {
    const newCat = selectedCategory === catId ? '' : catId
    setSelectedCategory(newCat)
    if (newCat) setSearchParams({ category: newCat })
    else setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-1">{SI.products}</h1>
        <p className="text-gray-500 text-sm">ශ්‍රී ලාංකික ස්වාභාවික නිෂ්පාදන</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={SI.productSearch}
            className="input-field pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto min-w-[160px]">
          <option value="default">වර්ග කිරීම</option>
          <option value="price_asc">මිල (අඩු → වැඩි)</option>
          <option value="price_desc">මිල (වැඩි → අඩු)</option>
        </select>
      </div>

      {/* Categories filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setSelectedCategory(''); setSearchParams({}) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${!selectedCategory ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}
        >
          {SI.allCategories}
        </button>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full text-sm font-medium transition-all border"
              style={{
                background: isActive ? '#e25f1e' : '#ffffff',
                color: isActive ? '#ffffff' : '#374151',
                borderColor: isActive ? '#e25f1e' : '#e5e7eb',
              }}
            >
              {/* Tiny circular image thumbnail */}
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border-2"
                style={{ borderColor: isActive ? 'rgba(255,255,255,0.5)' : '#e5e7eb' }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        {products.length} නිෂ්පාදන හමු විය
        {selectedCategory && ` "${CATEGORIES.find(c => c.id === selectedCategory)?.label}" වර්ගයේ`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <EmptyState icon="🔍" title={SI.noProducts} subtitle="වෙනත් කාණ්ඩයක් හෝ සෙවුම් පදයක් උත්සාහ කරන්න" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default ProductListingPage

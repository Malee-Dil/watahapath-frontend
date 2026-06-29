import { useState } from 'react'
import { Search, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { SI, CATEGORIES } from '../../utils/constants'
import { formatPrice } from '../../utils/helpers'
import { productService } from '../../services/productService'
import { useProducts } from '../../hooks/useData'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const AdminProductsPage = () => {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [deleteId, setDeleteId] = useState(null)

  const { products, loading, refetch, deleteProduct } = useProducts(
    catFilter !== 'all' ? { category: catFilter } : {}
  )

  const filtered = products.filter((p) => {
    if (!search) return true
    const term = search.toLowerCase()
    const producerName = p.producer?.name || ''
    return p.name.toLowerCase().includes(term) || producerName.toLowerCase().includes(term)
  })

  const handleDelete = async () => {
    await deleteProduct(deleteId)
    setDeleteId(null)
  }

  const toggleVisibility = async (product) => {
    try {
      await productService.toggleVisibility(product._id)
      toast.success(`"${product.name}" ${product.visible ? 'සඟවා' : 'දෘශ්‍යමාන'} කළා`)
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{SI.productManagement}</h1>
        <span className="badge-blue">{products.length} නිෂ්පාදන</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="නිෂ්පාදනය හෝ නිෂ්පාදකයා සොයන්න..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="input-field w-auto min-w-[180px]"
        >
          <option value="all">{SI.allCategories}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">{SI.productName}</th>
                <th className="table-header">{SI.productCategory}</th>
                <th className="table-header">නිෂ්පාදකයා</th>
                <th className="table-header">{SI.productPrice}</th>
                <th className="table-header">{SI.stock}</th>
                <th className="table-header">{SI.status}</th>
                <th className="table-header">දෘශ්‍යතාව</th>
                <th className="table-header">{SI.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    {SI.loading}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    {SI.noData}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const cat = CATEGORIES.find((c) => c.id === p.category)
                  return (
                    <tr key={p._id} className={`hover:bg-gray-50 transition-colors ${!p.visible ? 'opacity-50' : ''}`}>
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              cat?.icon || '📦'
                            )}
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-xs text-gray-500">{cat?.label}</td>
                      <td className="table-cell text-xs text-gray-600">{p.producer?.name || '—'}</td>
                      <td className="table-cell font-semibold text-primary-600 text-sm">{formatPrice(p.price)}</td>
                      <td className="table-cell text-sm">{p.stock}</td>
                      <td className="table-cell">
                        <span className={p.inStock ? 'badge-green' : 'badge-red'}>
                          {p.inStock ? SI.inStock : SI.outOfStock}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => toggleVisibility(p)}
                          className={`p-1.5 rounded-lg transition-colors ${p.visible ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={p.visible ? 'සඟවන්න' : 'දෘශ්‍යමාන කරන්න'}
                        >
                          {p.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="නිෂ්පාදනය මකන්නද?"
        message="මෙම නිෂ්පාදනය ස්ථිරවම පද්ධතියෙන් ඉවත් කෙරේ."
        confirmLabel={SI.delete}
      />
    </div>
  )
}

export default AdminProductsPage
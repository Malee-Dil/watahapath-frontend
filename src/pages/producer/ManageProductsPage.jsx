import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { SI, CATEGORIES } from '../../utils/constants'
import { formatPrice } from '../../utils/helpers'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { productService } from '../../services/productService'

const ManageProductsPage = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 Fetch real products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getMyProducts()
        setProducts(res.data)
      } catch (err) {
        console.log(err)
        toast.error('නිෂ්පාදන ලබාගැනීමට නොහැකි විය')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 🔍 search filter
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // 🗑 delete product (frontend + backend)
  const handleDelete = async () => {
    try {
      await productService.delete(deleteId)
      setProducts(products.filter((p) => p._id !== deleteId))
      toast.success('නිෂ්පාදනය මකා දමන ලදී')
    } catch (err) {
      toast.error('මකා දැමීමට නොහැකි විය')
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{SI.myProducts}</h1>

        <Link to="/producer/products/add" className="btn-primary">
          <Plus size={17} /> {SI.addProduct}
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={SI.productSearch}
          className="input-field pl-10"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title={SI.noProducts}
          action={
            <Link to="/producer/products/add" className="btn-primary">
              <Plus size={16} />
              {SI.addProduct}
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              {/* TABLE HEADER */}
              <thead>
                <tr>
                  <th className="table-header">{SI.productName}</th>
                  <th className="table-header">{SI.productCategory}</th>
                  <th className="table-header">{SI.productPrice}</th>
                  <th className="table-header">{SI.stock}</th>
                  <th className="table-header">{SI.status}</th>
                  <th className="table-header">{SI.actions}</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {filtered.map((p) => {
                  const cat = CATEGORIES.find((c) => c.id === p.category)
                  const inStock = p.stock > 0

                  return (
                    <tr key={p._id} className="hover:bg-gray-50">

                      {/* NAME */}
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-xl">
                            {cat?.icon || '📦'}
                          </div>
                          <span className="font-medium text-gray-800">
                            {p.name}
                          </span>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="table-cell text-gray-500">
                        {cat?.label}
                      </td>

                      {/* PRICE */}
                      <td className="table-cell font-semibold text-primary-600">
                        {formatPrice(p.price)}
                      </td>

                      {/* STOCK */}
                      <td className="table-cell">{p.stock}</td>

                      {/* STATUS */}
                      <td className="table-cell">
                        <span className={inStock ? 'badge-green' : 'badge-red'}>
                          {inStock ? SI.inStock : SI.outOfStock}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="table-cell">
                        <div className="flex gap-2">

                          {/* EDIT */}
                          <Link
                            to={`/producer/products/edit/${p._id}`}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </Link>

                          {/* DELETE */}
                          <button
                            onClick={() => setDeleteId(p._id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="නිෂ්පාදනය මකන්නද?"
        message="මෙම නිෂ්පාදනය ස්ථිරවම මකා දැමේ. ඔබට නැවත ලබා ගත නොහැකි වේ."
        confirmLabel={SI.delete}
      />
    </div>
  )
}

export default ManageProductsPage
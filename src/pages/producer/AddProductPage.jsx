import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { SI, CATEGORIES } from '../../utils/constants'
import { productService } from '../../services/productService'

const AddProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    unit: 'kg',
    imageUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)

  // Load the real product from the backend when editing
  useEffect(() => {
    if (!isEdit) return

    const loadProduct = async () => {
      setPageLoading(true)
      try {
        const res = await productService.getById(id)
        const p = res.data
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: String(p.price ?? ''),
          category: p.category || '',
          stock: String(p.stock ?? ''),
          unit: p.unit || 'kg',
          imageUrl: p.imageUrl || '',
        })
      } catch (err) {
        toast.error(err?.response?.data?.message || 'නිෂ්පාදනය පූරණය වීමේ දෝෂයක් සිදු විය')
        navigate('/producer/products')
      } finally {
        setPageLoading(false)
      }
    }

    loadProduct()
  }, [id, isEdit, navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }

      if (isEdit) {
        await productService.update(id, payload)
      } else {
        await productService.create(payload)
      }

      toast.success(isEdit ? 'නිෂ්පාදනය යාවත්කාලීන කළා' : 'නිෂ්පාදනය සාර්ථකව එකතු කළා')
      navigate('/producer/products')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'දෝෂයක් ඇති විය')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 px-2 sm:px-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title">{isEdit ? SI.editProduct : SI.addProduct}</h1>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
        <div className="card p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{SI.productName} *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="නිෂ්පාදනයේ නම ඇතුළත් කරන්න" required />
            </div>

            <div>
              <label className="label">{SI.productDesc}</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[100px] resize-y" placeholder="නිෂ්පාදනය ගැන සවිස්තරාත්මක විස්තරයක් ලියන්න" rows={4} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{SI.productPrice} *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">රු.</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field pl-10" placeholder="0.00" min="0" step="0.01" required />
                </div>
              </div>
              <div>
                <label className="label">{SI.productStock} *</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} className="input-field" placeholder="0" min="0" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{SI.productCategory} *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  {CATEGORIES.map((c) => {
                    const isSelected = form.category === c.id
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setForm({ ...form, category: c.id })}
                        className="relative rounded-xl overflow-hidden transition-all"
                        style={{
                          aspectRatio: '1',
                          outline: isSelected ? '3px solid #e25f1e' : '2px solid transparent',
                          outlineOffset: '2px',
                        }}
                      >
                        <img src={c.image.startsWith('/') ? c.image : `/${c.image}`} alt={c.label} className="w-full h-full object-cover" />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: isSelected
                              ? 'rgba(226,95,30,0.35)'
                              : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)',
                          }}
                        />
                        <p
                          className="absolute bottom-0 left-0 right-0 text-white text-center font-bold pb-1"
                          style={{ fontSize: '10px', fontFamily: 'Yaldevi, sans-serif' }}
                        >
                          {c.label}
                        </p>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                            <span style={{ color: '#e25f1e', fontSize: '10px', fontWeight: 'bold' }}>✓</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <input type="text" value={form.category} readOnly required style={{ opacity: 0, height: 0, position: 'absolute' }} />
              </div>
              {/* <div>
                <label className="label">ඒකක</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
                  {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div> */}
            </div>

            <div>
              <label className="label">{SI.productImage} URL ({SI.optional})</label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              {form.imageUrl && (
                <div className="mt-3 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 !justify-center">
                {SI.cancel}
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 !justify-center disabled:opacity-60 w-full sm:w-auto">
                <Save size={16} />
                {loading ? SI.loading : (isEdit ? 'යාවත්කාලීන කරන්න' : SI.addProduct)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProductPage
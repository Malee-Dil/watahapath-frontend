import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { SI, ROLES } from '../../utils/constants'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: ROLES.CUSTOMER,
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('මුරපද ගැළපෙන්නේ නැත')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('ලියාපදිංචිය සාර්ථකයි! 🎉')
      const redirects = { admin: '/admin/dashboard', producer: '/producer/dashboard', customer: '/customer/dashboard' }
      navigate(redirects[user.role] || '/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'ලියාපදිංචිය අසාර්ථක විය')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-lg">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌱</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Yaldevi' }}>{SI.registerTitle}</h2>
            <p className="text-gray-500 text-sm">{SI.registerSubtitle}</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="label">{SI.selectRole}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: ROLES.CUSTOMER, label: SI.roleCustomer, icon: '🛍️' },
                { value: ROLES.PRODUCER, label: SI.roleProducer, icon: '🌾' },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: role.value })}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    form.role === role.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <span className="font-semibold text-sm">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{SI.fullName}</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="ඔබේ නම" required />
              </div>
              <div>
                <label className="label">{SI.phone}</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="07X XXX XXXX" />
              </div>
            </div>

            <div>
              <label className="label">{SI.email}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="example@email.com" required />
            </div>

            <div>
              <label className="label">{SI.address}</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="ඔබේ ලිපිනය" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{SI.password}</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="input-field pr-11" placeholder="••••••••" required minLength={6} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">{SI.confirmPassword}</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !justify-center text-base py-3 mt-2 disabled:opacity-60">
              <UserPlus size={18} />
              {loading ? SI.loading : SI.register}
            </button>
          </form>

          <p className="mt-5 text-center text-gray-500 text-sm">
            {SI.haveAccount}{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">{SI.loginHere}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

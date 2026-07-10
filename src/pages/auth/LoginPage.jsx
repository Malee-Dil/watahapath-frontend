import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { SI } from '../../utils/constants'
import { GoogleLogin } from '@react-oauth/google'

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success(`${SI.welcomeBack}! 👋`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'ප්‍රවේශ වීම අසාර්ථක විය')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 text-white">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
          style={{
            backgroundImage: "url('/images/common/c1.png')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-sm text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: 'Yaldevi' }}
          >
            {SI.appName}
          </h1>
          <p className="text-lg text-white/80">{SI.appTagline}</p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            {['විශ්වාසදායී', 'අත්කම් නිර්මාණ', 'ගෙදරට ලබා දෙමු', 'ගුණාත්මකභාවය තහවුරු'].map((t) => (
              <div
                key={t}
                className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-white/90"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Yaldevi' }}>{SI.loginTitle}</h2>
            <p className="text-gray-500">{SI.loginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{SI.email}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="label">{SI.password}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary-600 hover:underline">{SI.forgotPassword}</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !justify-center text-base py-3 disabled:opacity-60"
            >
              <LogIn size={18} />
              {loading ? SI.loading : SI.login}
            </button>
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>

                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">
                    හෝ
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const user = await loginWithGoogle(
                        credentialResponse.credential
                      )

                      console.log('GOOGLE USER:', user)

                      toast.success('Google Login Successful 🎉')

                      if (
                        user.role === 'customer' &&
                        !user.profileCompleted
                      ) {
                        navigate('/complete-profile', {
                          replace: true,
                        })
                        return
                      }


                      const redirects = {
                        admin: '/admin/dashboard',
                        producer: '/producer/dashboard',
                        customer: '/customer/dashboard',
                      }

                      navigate(
                        redirects[user.role] || '/dashboard',
                        { replace: true }
                      )

                    } catch (err) {
                      toast.error(
                        err?.response?.data?.message ||
                        'Google Login Failed'
                      )
                    }
                  }}
                  onError={() => {
                    toast.error('Google Login Failed')
                  }}
                />
              </div>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            {SI.noAccount}{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">{SI.registerHere}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { SI } from '../../utils/constants'

const Navbar = () => {
  const { isAuthenticated, user, logout, role } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dashboardPath = {
    admin: '/admin/dashboard',
    producer: '/producer/dashboard',
    customer: '/customer/dashboard',
  }[role] || '/dashboard'

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Yaldevi' }}>ව</span>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Yaldevi' }}>
              {SI.appName}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">{SI.home}</Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">{SI.products}</Link>
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/customer/cart" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>
                <Link to={dashboardPath} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                  <LayoutDashboard size={16} />
                  <span>{SI.dashboard}</span>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-xs font-bold">{user?.name?.charAt(0)}</span>
                  </div>
                  <span className="max-w-24 truncate">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title={SI.logout}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm !px-4 !py-2">{SI.login}</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">{SI.register}</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link to="/" className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>{SI.home}</Link>
          <Link to="/products" className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>{SI.products}</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>{SI.dashboard}</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="py-2 text-left text-red-500 font-medium">{SI.logout}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !justify-center" onClick={() => setMenuOpen(false)}>{SI.login}</Link>
              <Link to="/register" className="btn-primary !justify-center" onClick={() => setMenuOpen(false)}>{SI.register}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

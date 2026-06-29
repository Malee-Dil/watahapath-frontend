import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SI } from '../../utils/constants'
import { getInitials } from '../../utils/helpers'

const TopBar = ({ onMenuToggle, title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 gap-4 shadow-sm sticky top-0 z-30">
      <button
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
        onClick={onMenuToggle}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        {title && (
          <h1 className="text-base font-semibold text-gray-700 hidden sm:block" style={{ fontFamily: 'Yaldevi' }}>
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 relative">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</div>
            <div className="text-xs text-gray-400 leading-tight">{
              { admin: SI.admin, producer: SI.producer, customer: SI.customer }[user?.role]
            }</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title={SI.logout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}

export default TopBar

import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { SI } from '../../utils/constants'

const Sidebar = ({ links, isOpen, onClose, brandColor = 'primary' }) => {
  const location = useLocation()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 lg:static lg:z-auto
          sidebar-gradient text-white flex flex-col
          transition-transform duration-300 ease-in-out
          w-[260px] shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Yaldevi' }}>ව</span>
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'Yaldevi' }}>
              {SI.appName}
            </span>
          </Link>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to ||
              (link.to !== '/' && location.pathname.startsWith(link.to) && link.exact !== true)
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-900/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="shrink-0">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">{SI.appName} © 2024</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

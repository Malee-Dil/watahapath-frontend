import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { SI } from '../utils/constants'

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="bg-dark-900 text-white/60 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Yaldevi' }}>{SI.appName}</p>
        <p className="text-sm">{SI.appTagline}</p>
        <p className="text-xs mt-4 text-white/30">© 2024 {SI.appName}. සියලු හිමිකම් ඇවිරිණි.</p>
      </div>
    </footer>
  </div>
)

export default PublicLayout

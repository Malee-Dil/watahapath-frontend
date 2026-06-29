import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { SI } from '../utils/constants'

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
    <div className="text-8xl mb-6">🌾</div>
    <h1 className="text-6xl font-bold text-primary-500 mb-2" style={{ fontFamily: 'Yaldevi' }}>404</h1>
    <h2 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Yaldevi' }}>
      පිටුව හමු නොවීය
    </h2>
    <p className="text-gray-500 mb-8 max-w-sm">
      ඔබ සොයන පිටුව මෙහි නොමැත. එය ගෙනයා ඇත, ඉවත් කර ඇත, හෝ URL වැරදිය.
    </p>
    <div className="flex gap-3">
      <button onClick={() => window.history.back()} className="btn-secondary">
        <ArrowLeft size={16} /> {SI.back}
      </button>
      <Link to="/" className="btn-primary">
        <Home size={16} /> {SI.home}
      </Link>
    </div>
  </div>
)

export default NotFoundPage

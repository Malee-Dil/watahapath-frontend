import { SI } from '../../utils/constants'

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <div className="text-3xl font-bold text-primary-500" style={{ fontFamily: 'Yaldevi, sans-serif' }}>
      {SI.appName}
    </div>
    <div className="spinner" />
    <p className="text-gray-500 text-sm">{SI.loading}</p>
  </div>
)

export default LoadingScreen

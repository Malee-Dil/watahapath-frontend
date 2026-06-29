import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/common/LoadingScreen'

/**
 * ProtectedRoute – guards routes by auth state and role.
 * allowedRoles: optional array of roles ['admin','producer','customer']
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the correct dashboard if wrong role
    const redirects = {
      admin: '/admin/dashboard',
      producer: '/producer/dashboard',
      customer: '/customer/dashboard',
    }
    return <Navigate to={redirects[role] || '/'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

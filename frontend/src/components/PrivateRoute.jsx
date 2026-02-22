import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Routing for when user logs out
export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

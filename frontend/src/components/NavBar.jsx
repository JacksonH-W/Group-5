import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navbar.css'

// Currently not implemented in dashboard, shows user info and logout button
export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        Type2Code
      </Link>
      {user && (
        <div className="navbar-user">
          <span className="navbar-username">{user.username}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </nav>
  )
}

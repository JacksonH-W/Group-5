import { createContext, useContext, useReducer, useEffect } from 'react'
import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '../api/auth'

const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { user: action.payload, loading: false }
    case 'CLEAR_USER':
      return { user: null, loading: false }
    default:
      return state
  }
}

// Manages the context of the user's "logged in" state
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, loading: true })

  // Get current user state
  useEffect(() => {
    getMe()
      .then((user) => dispatch({ type: 'SET_USER', payload: user }))
      .catch(() => dispatch({ type: 'CLEAR_USER' }))
  }, [])

  // Functions to handle user login, registration and logout
  async function login(email, password) {
    const user = await apiLogin(email, password)
    dispatch({ type: 'SET_USER', payload: user })
    return user
  }

  async function register(username, email, password) {
    const user = await apiRegister(username, email, password)
    dispatch({ type: 'SET_USER', payload: user })
    return user
  }

  async function logout() {
    await apiLogout()
    dispatch({ type: 'CLEAR_USER' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

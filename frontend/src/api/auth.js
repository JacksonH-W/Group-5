import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
})

// GET request to retrieve current user that is logged in
export async function getMe() {
  const { data } = await api.get('/api/auth/me')
  return data
}

// POST request to login user
export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

// POST request to register user
export async function register(username, email, password) {
  const { data } = await api.post('/api/auth/register', { username, email, password })
  return data
}

// Logout current user
export async function logout() {
  await api.post('/api/auth/logout')
}

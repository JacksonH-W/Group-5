import axios from 'axios'

// Axios instance
const api = axios.create({
  // Leave empty so Vite proxy handles /api -> http://127.0.0.1:8000
  baseURL: '',
  withCredentials: true,
})

/**
 * Start a new practice session
 */
export async function startPractice(lessonId, mode = 'practice') {
  const { data } = await api.post('/api/practice/start', {
    lesson_id: lessonId,
    mode,
    metadata: {},
  })
  return data
}

/**
 * Submit practice results
 */
export async function submitPractice(payload) {
  const { data } = await api.post('/api/practice/submit', payload)
  return data
}

/**
 * Fetch aggregated practice stats
 */
export async function fetchPracticeStats(window = 50) {
  const { data } = await api.get('/api/practice/stats', {
    params: { window },
  })
  return data
}

/**
 * Fetch recent practice sessions
 */
export async function fetchPracticeSessions(limit = 10) {
  const { data } = await api.get('/api/practice/sessions', {
    params: { limit },
  })
  return data
}
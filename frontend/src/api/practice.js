import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
})

export async function startPractice(lessonId, mode = 'practice') {
  const { data } = await api.post('/api/practice/start', {
    lesson_id: lessonId,
    mode,
    metadata: {},
  })
  return data
}

export async function submitPractice(payload) {
  const { data } = await api.post('/api/practice/submit', payload)
  return data
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { startPractice, submitPractice } from '../api/practice'

export default function PracticePage() {
  const { lessonId } = useParams()
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const res = await startPractice(lessonId)
        setSessionId(res.session_id)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [lessonId])

  async function handleSubmit() {
    if (!sessionId) return
    setSubmitting(true)
    try {
      await submitPractice({
        session_id: sessionId,
        score: 100,
        correct: 10,
        total: 10,
        duration_seconds: 60,
        results: {},
      })
      alert('Practice submitted')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Starting practice…</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Practice</h2>
      <p>Session ID: {sessionId}</p>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Practice'}
      </button>
    </div>
  )
}

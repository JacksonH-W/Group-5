import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/dashboard.css'

const LESSONS = [
    { id: 1, title: 'Lesson 1: Basics', prompt: 'Write a function that returns "Hello".' },
    { id: 2, title: 'Lesson 2: Variables', prompt: 'Create a variable called count and set it to 0.' },
    { id: 3, title: 'Lesson 3: Conditionals', prompt: 'Write an if/else that checks if x is positive.' },
]

export default function PracticePage() {
    const { lessonId } = useParams()
    const lesson = useMemo(() => {
        const id = Number(lessonId)
        return LESSONS.find((l) => l.id === id) || { id, title: `Lesson ${id}`, prompt: 'Prompt coming soon.' }
    }, [lessonId])

    const [answer, setAnswer] = useState('')

    return (
        <div className="app-shell">
            <NavBar />
            <main className="page">
                <div className="page-header">
                    <h1 className="page-title">{lesson.title}</h1>
                    <p className="page-subtitle">
                        <Link to="/lessons"> Place holder text: ← Back to lessons</Link>
                    </p>
                </div>

                <div className="card card-accent-red">
                    <h2 className="card-title">Prompt</h2>
                    <p className="card-text">{lesson.prompt}</p>

                    <div className="spacer" />

                    <label className="form-label" htmlFor="answer">
                        Place holder text: Your answer
                    </label>
                    <textarea
                        id="answer"
                        className="text-area"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type here..."
                        rows={10}
                    />

                    <div className="card-actions">
                        <button className="btn-primary btn-inline" disabled>
                            Place holder text: Submit (backend hookup next)
                        </button>
                        <button className="btn-secondary btn-inline" onClick={() => setAnswer('')}>
                            Place holder text: Clear
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

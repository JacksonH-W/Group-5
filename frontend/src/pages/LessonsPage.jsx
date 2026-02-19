import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/dashboard.css'

const LESSONS = [
    { id: 1, title: 'Lesson 1: Basics', description: 'Warm-up: simple prompts and short answers.' },
    { id: 2, title: 'Lesson 2: Variables', description: 'Practice turning text instructions into code.' },
    { id: 3, title: 'Lesson 3: Conditionals', description: 'If/else practice with small tasks.' },
]

export default function LessonsPage() {
    return (
        <div className="app-shell">
            <NavBar />
            <main className="page">
                <div className="page-header">
                    <h1 className="page-title">Place holder text: Lessons</h1>
                    <p className="page-subtitle">Place holder text: Choose a lesson to practice.</p>
                </div>

                <div className="list">
                    {LESSONS.map((lesson) => (
                        <div className="list-item" key={lesson.id}>
                            <div className="list-item-main">
                                <div className="list-item-title">{lesson.title}</div>
                                <div className="list-item-subtitle">{lesson.description}</div>
                            </div>
                            <Link className="btn-primary btn-inline" to={`/practice/${lesson.id}`}>
                                Place holder text: Practice
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

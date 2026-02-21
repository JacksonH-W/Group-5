import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/lessonsGrid.css'

const UNITS = [
    {
        id: 1,
        title: 'Functions',
        subtitle: 'Placeholder subtitle about functions',
        lessons: [
            { stepId: 1, label: 'function', locked: false },
            { stepId: 2, label: 'hello()', locked: false },
            { stepId: 3, label: '{ }', locked: false },
            { stepId: 4, label: 'return', locked: false },
            { stepId: 5, label: '"Hello";', locked: false },
            { stepId: 6, label: 'Combine', locked: true }, 
        ],
    },
    {
        id: 2,
        title: 'Variables',
        subtitle: 'Placeholder subtitle about variables',
        lessons: [
            { stepId: 1, label: 'let', locked: false },
            { stepId: 2, label: 'const', locked: false },
            { stepId: 3, label: '=', locked: false },
            { stepId: 4, label: 'name', locked: true },
            { stepId: 5, label: '"Rustic"', locked: true },
            { stepId: 6, label: 'Combine', locked: true },
        ],
    },
]

export default function LessonsPage() {
    return (
        <div className="app-shell">
            <NavBar />

            <main className="lessons-shell">
                <div className="lessons-topline">
                    <div className="lessons-metrics">
                        <span>0% progress</span>
                        <span>0 stars</span>
                        <span>0 points</span>
                    </div>
                </div>

                <h1 className="lessons-title">Lessons</h1>

                {UNITS.map((unit) => (
                    <section key={unit.id} className="unit-section">
                        <div className="unit-header">
                            <h2 className="unit-title">{unit.title}</h2>
                            <p className="unit-subtitle">{unit.subtitle}</p>
                        </div>

                        <div className="lessons-grid">
                            {unit.lessons.map((l, idx) => {
                                const tile = (
                                    <div className={`tile tile-mini ${l.locked ? 'locked' : ''}`}>
                                        <div className="tile-num">{idx + 1}</div>
                                        {l.locked && <div className="tile-lock">🔒</div>}
                                        <div className="tile-body">
                                            <div className="tile-name">{l.label}</div>
                                            <div className="tile-focus">Mini lesson</div>
                                        </div>
                                        <div className="tile-footer">
                                            <div className="tile-muted">{l.locked ? 'Locked' : 'Click to begin'}</div>
                                        </div>
                                    </div>
                                )
                                if (l.locked) return <div key={l.stepId}>{tile}</div>
                                return (
                                    <Link
                                        key={l.stepId}
                                        to={`/practice/${unit.id}/${l.stepId}`}
                                        className="tile-link"
                                    >
                                        {tile}
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    )
}

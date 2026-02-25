import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/lessonsGrid.css'

import { UNITS } from '../data/units'
import { loadProgress, computeLocks, isCompleted } from '../utils/progress'

export default function LessonsPage() {
  const progress = loadProgress()
  const locks = computeLocks(UNITS, progress)

  return (
    <div className="app-shell">
      <NavBar />

      <main className="lessons-shell">
        <div className="lessons-topline">
          <div className="lessons-metrics">
            <span>Progress (local)</span>
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
                const locked = locks?.[unit.id]?.[l.stepId] ?? false
                const done = isCompleted(progress, unit.id, l.stepId)

                const tile = (
                  <div className={`tile tile-mini ${locked ? 'locked' : ''}`}>
                    <div className="tile-num">{idx + 1}</div>
                    {locked && <div className="tile-lock">🔒</div>}
                    {done && <div className="tile-lock">✅</div>}
                    <div className="tile-body">
                      <div className="tile-name">{l.label}</div>
                      <div className="tile-focus">{done ? 'Completed' : 'Mini lesson'}</div>
                    </div>
                    <div className="tile-footer">
                      <div className="tile-muted">{locked ? 'Locked' : 'Click to begin'}</div>
                    </div>
                  </div>
                )

                if (locked) return <div key={l.stepId}>{tile}</div>

                return (
                  <Link key={l.stepId} to={`/practice/${unit.id}/${l.stepId}`} className="tile-link">
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
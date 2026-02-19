import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/dashboard.css'

export default function DashboardPage() {
    return (
        <div className="app-shell">
            <NavBar />
            <main className="page">
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">
                        Place holder text: Pick where you want to go next.
                    </p>
                </div>

                <div className="dashboard-grid">
                    {/* Rustic's section */}
                    <section className="card card-accent-orange">
                        <h2 className="card-title">Lessons</h2>
                        <p className="card-text">
                            Place holder text: Browse lessons and choose what you want to practice.
                        </p>
                        <div className="card-actions">
                            <Link className="btn-primary btn-inline" to="/lessons">
                                Place holder text: View lessons
                            </Link>
                        </div>
                    </section>

                    {/* This is Jackson's section */}
                    <section className="card card-accent-red">
                        <h2 className="card-title">Practice</h2>
                        <p className="card-text">
                            Place holder text: Start practice session to start typing.
                        </p>
                        <div className="card-actions">
                            <Link className="btn-primary btn-inline" to="/practice/1">
                                Place holder text: Start practice
                            </Link>
                            <span className="card-hint">Starts Lesson 1 (placeholder)</span>
                        </div>
                    </section>

                    {/* This is a placeholder to make the layout look/feel balanced,*/}
                    <section className="card">
                        <h2 className="card-title">Progress</h2>
                        <p className="card-text">
                            Place holder text: This is where you can show completed lessons, streaks, or scores later.
                        </p>
                        <div className="card-actions">
                            <button className="btn-secondary btn-inline" disabled>
                                Place holder text: Coming soon
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

import NavBar from '../components/NavBar'

export default function GamePage() {
    return (
        <div className="app-shell">
            <NavBar />
            <main className="page" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Games</h1>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Coming soon.
                </p>

                <div style={{ marginTop: '1.25rem', border: '1px solid var(--color-border)', padding: '1.25rem' }}>
                    Mini-game placeholder.
                </div>
            </main>
        </div>
    )
}

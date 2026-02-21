import { useMemo, useRef, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/practice.css'

const UNITS = [
    {
        id: 1,
        title: 'Functions',
        showKeyboard: true,
        lessons: [
            { stepId: 1, chunk: 'function', repeats: 18 },
            { stepId: 2, chunk: 'hello()', repeats: 18 },
            { stepId: 3, chunk: '{ }', repeats: 18 },
            { stepId: 4, chunk: 'return', repeats: 14 },
            { stepId: 5, chunk: '"Hello";', repeats: 14 },
            { stepId: 6, chunk: 'function hello() { return "Hello"; }', repeats: 8 },
        ],
    },
    {
        id: 2,
        title: 'Variables',
        showKeyboard: true,
        lessons: [
            { stepId: 1, chunk: 'let', repeats: 22 },
            { stepId: 2, chunk: 'const', repeats: 22 },
            { stepId: 3, chunk: '=', repeats: 28 },
            { stepId: 4, chunk: 'name', repeats: 16 },
            { stepId: 5, chunk: '"Rustic"', repeats: 12 },
            { stepId: 6, chunk: 'let name = "Rustic";', repeats: 10 },
        ],
    },
]

function getPerRow() {
    const w = window.innerWidth
    if (w < 600) return 3
    if (w < 900) return 4
    if (w < 1200) return 5
    return 6
}

function buildGrid(chunk, repeats, perRow) {
    const items = Array.from({ length: repeats }, () => chunk)
    const rows = []
    for (let i = 0; i < items.length; i += perRow) {
        rows.push(items.slice(i, i + perRow).join('  '))
    }
    return rows.join('\n')
}

export default function PracticePage() {
    const { unitId, stepId } = useParams()
    const navigate = useNavigate()
    const inputRef = useRef(null)

    const unit = useMemo(() => UNITS.find(u => u.id === Number(unitId)) || UNITS[0], [unitId])
    const lesson = useMemo(
        () => unit.lessons.find(l => l.stepId === Number(stepId)) || unit.lessons[0],
        [unit, stepId]
    )

    const [typed, setTyped] = useState('')
    const [wrongCount, setWrongCount] = useState(0)
    const [fixedCount, setFixedCount] = useState(0)
    const [done, setDone] = useState(false)
    const [perRow, setPerRow] = useState(getPerRow())

    useEffect(() => {
        const onResize = () => setPerRow(getPerRow())
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        setTyped('')
        setWrongCount(0)
        setFixedCount(0)
        setDone(false)
        inputRef.current?.focus()
    }, [unitId, stepId])

    const target = useMemo(() => buildGrid(lesson.chunk, lesson.repeats, perRow), [lesson, perRow])
    const expectedChar = typed.length < target.length ? target[typed.length] : null

    function goNext() {
        const currentIndex = unit.lessons.findIndex(l => l.stepId === Number(stepId))
        const next = unit.lessons[currentIndex + 1]
        if (next) navigate(`/practice/${unit.id}/${next.stepId}`)
        else navigate('/lessons')
    }

    function onKeyDown(e) {
        // if finished: allow quick-next to next lesson with Space or ArrowRight
        if (done) {
            if (e.key === ' ' || e.key === 'ArrowRight') {
                e.preventDefault()
                goNext()
            }
            return
        }

        if (e.key === 'Backspace') {
            if (typed.length > 0) {
                setTyped(t => t.slice(0, -1))
                setFixedCount(n => n + 1)
            }
            e.preventDefault()
            return
        }

        if (e.key === 'Tab') {
            e.preventDefault()
            return
        }

        if (e.key === 'Enter') {
            const expected = expectedChar
            if (expected !== '\n') setWrongCount(n => n + 1)
            setTyped(t => t + '\n')
            e.preventDefault()
            return
        }

        if (e.key.length !== 1) return

        const nextChar = e.key
        if (expectedChar !== nextChar) setWrongCount(n => n + 1)
        setTyped(t => t + nextChar)
        e.preventDefault()
    }

    useEffect(() => {
        if (!done && typed.length === target.length) {
            setDone(true)
        }
    }, [typed, target.length, done])

    return (
        <div className="app-shell">
            <NavBar />

            <main className="practice-shell" onMouseDown={() => inputRef.current?.focus()}>
                <div className="practice-top">
                    <div>
                        <h1 className="practice-h1">{unit.title}</h1>
                        <div className="practice-sub">
                            Mini-lesson: <b>{lesson.chunk}</b>
                        </div>
                    </div>

                    <div className="practice-nav">
                        <Link to="/lessons" className="practice-back">← Back</Link>
                    </div>
                </div>

                <div className="type-area">
                    <div className="type-box">
                        <ChunkGrid target={target} typed={typed} />
                    </div>

                    <input
                        ref={inputRef}
                        className="hidden-capture"
                        value=""
                        onChange={() => { }}
                        onKeyDown={onKeyDown}
                        autoFocus
                    />
                </div>

                <div className="practice-hud">
                    <span>Wrong: <b>{wrongCount}</b></span>
                    <span>Fixed: <b className="fixed">{fixedCount}</b></span>
                    {done && (
                        <span className="done-hint">
                            Done — press <b>Space</b> or <b>→</b> for next
                        </span>
                    )}
                </div>

                {/* keyboard stays visible always, can be changed by user later */}
                {unit.showKeyboard && (
                    <div className="keyboard-wrap">
                        <Keyboard expected={expectedChar} />
                    </div>
                )}

                {done && (
                    <div className="next-row">
                        <button className="btn-primary" onClick={goNext}>
                            Next (Space / →)
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

function ChunkGrid({ target, typed }) {
    const lines = target.split('\n')
    let globalIndex = 0

    return (
        <div className="type-grid">
            {lines.map((line, lineIdx) => {
                const chars = line.split('')
                const startIndex = globalIndex
                globalIndex += chars.length + 1 

                return (
                    <div key={lineIdx} className="type-line">
                        {chars.map((ch, i) => {
                            const idx = startIndex + i
                            const typedChar = typed[idx]
                            let cls = 'char'

                            if (typedChar != null) cls += typedChar === ch ? ' correct' : ' wrong'
                            else if (idx === typed.length) cls += ' cursor'

                            return (
                                <span key={i} className={cls}>
                                    {ch === ' ' ? '\u00A0' : ch}
                                </span>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

const KEY_ROWS = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Space'],
]

function Keyboard({ expected }) {
    const keyToHighlight = expected === ' ' ? 'Space' : expected === '\n' ? 'Enter' : expected
    return (
        <div className="keyboard">
            {KEY_ROWS.map((row, idx) => (
                <div className="key-row" key={idx}>
                    {row.map((k) => {
                        const isBig = ['Backspace', 'Tab', 'Caps', 'Enter', 'Shift'].includes(k)
                        const isSpace = k === 'Space'
                        const active =
                            keyToHighlight &&
                            (k.toLowerCase() === String(keyToHighlight).toLowerCase() ||
                                (k === 'Space' && keyToHighlight === 'Space'))

                        return (
                            <div key={k} className={`key ${isBig ? 'big' : ''} ${isSpace ? 'space' : ''} ${active ? 'active' : ''}`}>
                                {k}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

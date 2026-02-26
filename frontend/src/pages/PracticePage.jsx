import { useMemo, useRef, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import '../styles/practice.css'

import { UNITS } from '../data/units'
import { loadProgress, saveProgress, markCompleted } from '../utils/progress'

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

  const unit = useMemo(
    () => UNITS.find((u) => u.id === Number(unitId)) || UNITS[0],
    [unitId]
  )

  const lesson = useMemo(
    () =>
      unit.lessons.find((l) => l.stepId === Number(stepId)) ||
      unit.lessons[0],
    [unit, stepId]
  )

  const [typed, setTyped] = useState('')
  const [wrongCount, setWrongCount] = useState(0)
  const [fixedCount, setFixedCount] = useState(0)
  const [perRow, setPerRow] = useState(getPerRow())

  const [hasStarted, setHasStarted] = useState(false)

  function focusInput() {
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  useEffect(() => {
    const onResize = () => setPerRow(getPerRow())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    focusInput()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, stepId])

  const target = useMemo(
    () => buildGrid(lesson.chunk, lesson.repeats, perRow),
    [lesson, perRow]
  )

  const done = typed.length === target.length
  const expectedChar = typed.length < target.length ? target[typed.length] : null

  function completeAndNext() {
    const current = loadProgress()
    const nextProgress = markCompleted(current, Number(unitId), Number(stepId))
    saveProgress(nextProgress)

    setTyped('')
    setWrongCount(0)
    setFixedCount(0)
    setHasStarted(false)

    const idx = unit.lessons.findIndex((l) => l.stepId === Number(stepId))
    const next = unit.lessons[idx + 1]
    if (next) navigate(`/practice/${unit.id}/${next.stepId}`)
    else navigate('/lessons')
  }

  function onKeyDown(e) {
    if (
      !hasStarted &&
      (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace')
    ) {
      setHasStarted(true)
    }

    if (done) {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        completeAndNext()
      }
      return
    }

    if (e.key === 'Backspace') {
      if (typed.length > 0) {
        setTyped((t) => t.slice(0, -1))
        setFixedCount((n) => n + 1)
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
      if (expected !== '\n') setWrongCount((n) => n + 1)
      setTyped((t) => t + '\n')
      e.preventDefault()
      return
    }

    if (e.key.length !== 1) return

    const nextChar = e.key
    if (expectedChar !== nextChar) setWrongCount((n) => n + 1)
    setTyped((t) => t + nextChar)
    e.preventDefault()
  }

  return (
    <div className="app-shell">
      <NavBar />

      <main
        className="practice-shell"
        onMouseDown={focusInput}
        onClick={focusInput}
        onPointerDown={focusInput}
      >
        <div className="practice-top">
          <div>
            <h1 className="practice-h1">{unit.title}</h1>

            <div className="practice-sub">
              Mini-lesson: <b>{lesson.label ?? lesson.chunk}</b>
            </div>

            <div className="practice-rules">
              Click the box and type <b>exactly</b> what you see (spaces count).
              Use <b>Backspace</b> to fix.
            </div>

            {lesson.learnText && (
              <div className="practice-learn">{lesson.learnText}</div>
            )}
          </div>

          <div className="practice-nav">
            <Link to="/lessons" className="practice-back">
              ← Back
            </Link>
          </div>
        </div>

        <div className="type-area">
          <div className="type-box">
            {!hasStarted && typed.length === 0 && (
              <div
                className="start-overlay"
                onMouseDown={() => {
                  setHasStarted(true)
                  focusInput()
                }}
                onClick={() => {
                  setHasStarted(true)
                  focusInput()
                }}
                role="presentation"
                aria-hidden="true"
              >
                <div className="start-overlay-card">
                  <div className="start-title">Click here to start typing</div>
                  <div className="start-sub">
                    Then type the <b>highlighted</b> character (spaces count)
                  </div>
                </div>
              </div>
            )}

            <ChunkGrid target={target} typed={typed} />
          </div>

          <input
            ref={inputRef}
            className="hidden-capture"
            value=""
            onChange={() => {}}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </div>

        <div className="practice-hud">
          <span>
            Wrong: <b>{wrongCount}</b>
          </span>
          <span>
            Fixed: <b className="fixed">{fixedCount}</b>
          </span>

          {done && (
            <span className="done-hint">
              Done — press <b>Space</b> or <b>→</b> for next
            </span>
          )}
        </div>

        {unit.showKeyboard && (
          <div className="keyboard-wrap">
            <Keyboard expected={expectedChar} />
          </div>
        )}

        {done && (
          <div className="next-row">
            <button className="btn-primary" onClick={completeAndNext}>
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
  const lineStarts = lines.reduce((acc, line, i) => {
    if (i === 0) acc.push(0)
    else acc.push(acc[i - 1] + lines[i - 1].length + 1)
    return acc
  }, [])

  return (
    <div className="type-grid">
      {lines.map((line, lineIdx) => {
        const chars = line.split('')
        const startIndex = lineStarts[lineIdx]

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
  const keyToHighlight =
    expected === ' ' ? 'Space' : expected === '\n' ? 'Enter' : expected

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
              <div
                key={k}
                className={`key ${isBig ? 'big' : ''} ${isSpace ? 'space' : ''} ${active ? 'active' : ''}`}
              >
                {k}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
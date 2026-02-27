// frontend/src/pages/PracticePage.jsx
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
      unit.lessons.find((l) => l.stepId === Number(stepId)) || unit.lessons[0],
    [unit, stepId]
  )

  const [typed, setTyped] = useState('')
  const [wrongCount, setWrongCount] = useState(0)
  const [fixedCount, setFixedCount] = useState(0)
  const [perRow, setPerRow] = useState(getPerRow())

  const [hasStarted, setHasStarted] = useState(false)
  const [targetIndex, setTargetIndex] = useState(0)
  const [overlayDismissed, setOverlayDismissed] = useState(false)

  // Adaptive tier system (persisted per step)
  const [tier, setTier] = useState(1)
  const startTimeRef = useRef(null)

  // --------- localStorage helpers ----------
  function tierKey() {
    return `type2code:tier:${unitId}:${stepId}`
  }

  function loadTier() {
    const raw = localStorage.getItem(tierKey())
    const n = Number(raw)
    return Number.isFinite(n) && n > 0 ? n : 1
  }

  function saveTier(nextTier) {
    localStorage.setItem(tierKey(), String(nextTier))
  }

  // streak persists per step
  const streakKey = useMemo(
    () => `type2code:streak:${unitId}:${stepId}`,
    [unitId, stepId]
  )

  function loadStreak() {
    const raw = localStorage.getItem(streakKey)
    try {
      const s = raw ? JSON.parse(raw) : null
      return {
        promote: Number(s?.promote) || 0,
        demote: Number(s?.demote) || 0,
      }
    } catch {
      return { promote: 0, demote: 0 }
    }
  }

  function saveStreak(s) {
    localStorage.setItem(streakKey, JSON.stringify(s))
  }

  function clearTierAndStreak() {
    localStorage.removeItem(streakKey)
    localStorage.removeItem(tierKey())
    setTier(1)
    setTargetIndex(0)
    resetTypingForNextTarget()
  }

  // Simple rules (can be overridden per-lesson via lesson.tierRules)
  const rules = useMemo(() => {
    const defaults = {
      minTier: 1,
      maxTier: 3,
      promoteIf: { wpm: 28, accuracy: 0.95, streak: 2 },
      demoteIf: { wpm: 14, accuracy: 0.85, streak: 2 },
    }
    return { ...defaults, ...(lesson.tierRules || {}) }
  }, [lesson])
  // ----------------------------------------

  function focusInput() {
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  useEffect(() => {
    const onResize = () => setPerRow(getPerRow())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Reset local state when changing lesson (DO NOT clear streak here; it should persist per step)
  useEffect(() => {
    setTyped('')
    setWrongCount(0)
    setFixedCount(0)
    setHasStarted(false)
    setTargetIndex(0)
    setOverlayDismissed(false)
    startTimeRef.current = null

    const t = loadTier()
    setTier(t)

    focusInput()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, stepId])

  const tierKeyStr = String(tier)

  const hasTierTargets =
    lesson.targetsByTier &&
    typeof lesson.targetsByTier === 'object' &&
    Array.isArray(lesson.targetsByTier[tierKeyStr]) &&
    lesson.targetsByTier[tierKeyStr].length > 0

  const useTargets = Array.isArray(lesson.targets) && lesson.targets.length > 0

  const targets = useMemo(() => {
    if (hasTierTargets) return lesson.targetsByTier[tierKeyStr]
    if (useTargets) return lesson.targets
    return [buildGrid(lesson.chunk, lesson.repeats, perRow)]
  }, [lesson, perRow, useTargets, hasTierTargets, tierKeyStr])

  const target = targets[Math.min(targetIndex, targets.length - 1)] ?? ''

  const doneExact = typed === target
  const expectedChar = typed.length < target.length ? target[typed.length] : null

  function resetTypingForNextTarget() {
    setTyped('')
    setWrongCount(0)
    setFixedCount(0)
    startTimeRef.current = null
    focusInput()
  }

  // returns true if tier changed (caller should stop advancing)
  function updateTierAfterTargetComplete() {
    const start = startTimeRef.current
    if (!start) return false

    const durationMs = Math.max(1, Date.now() - start)
    const minutes = durationMs / 60000

    const chars = target.length
    const wpm = (chars / 5) / minutes

    const totalTypedEvents = chars + wrongCount + fixedCount
    const accuracy = totalTypedEvents > 0 ? chars / totalTypedEvents : 1

    const s = loadStreak()

    const promoteHit = wpm >= rules.promoteIf.wpm && accuracy >= rules.promoteIf.accuracy
    const demoteHit = wpm <= rules.demoteIf.wpm || accuracy <= rules.demoteIf.accuracy

    let nextStreak = { ...s }

    if (promoteHit) {
      nextStreak.promote += 1
      nextStreak.demote = 0
    } else if (demoteHit) {
      nextStreak.demote += 1
      nextStreak.promote = 0
    } else {
      nextStreak.promote = 0
      nextStreak.demote = 0
    }

    let nextTier = tier

    if (nextStreak.promote >= rules.promoteIf.streak) {
      nextTier = Math.min(rules.maxTier, tier + 1)
      nextStreak = { promote: 0, demote: 0 }
    } else if (nextStreak.demote >= rules.demoteIf.streak) {
      nextTier = Math.max(rules.minTier, tier - 1)
      nextStreak = { promote: 0, demote: 0 }
    }

    saveStreak(nextStreak)

    if (nextTier !== tier) {
      setTier(nextTier)
      saveTier(nextTier)
      setTargetIndex(0)
      resetTypingForNextTarget()
      return true
    }

    return false
  }

  function completeAndNextLesson() {
    const current = loadProgress()
    const nextProgress = markCompleted(current, Number(unitId), Number(stepId))
    saveProgress(nextProgress)

    // clear tier streaks for this step when completed (so next time they start fresh)
    localStorage.removeItem(streakKey)
    localStorage.removeItem(tierKey())

    setTyped('')
    setWrongCount(0)
    setFixedCount(0)
    setHasStarted(false)
    setTargetIndex(0)
    setOverlayDismissed(false)

    const idx = unit.lessons.findIndex((l) => l.stepId === Number(stepId))
    const next = unit.lessons[idx + 1]
    if (next) navigate(`/practice/${unit.id}/${next.stepId}`)
    else navigate('/lessons')
  }

  function advance() {
    const tierChanged = updateTierAfterTargetComplete()
    if (tierChanged) return

    if (targetIndex < targets.length - 1) {
      setTargetIndex((i) => i + 1)
      resetTypingForNextTarget()
      return
    }

    completeAndNextLesson()
  }

  function onKeyDown(e) {
    if (
      !hasStarted &&
      (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace')
    ) {
      setHasStarted(true)
      setOverlayDismissed(true)
      if (!startTimeRef.current) startTimeRef.current = Date.now()
    }

    if (doneExact) {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        advance()
      }
      return
    }

    if (typed.length >= target.length && e.key !== 'Backspace') {
      e.preventDefault()
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
      if (expectedChar !== '\n') setWrongCount((n) => n + 1)
      setTyped((t) => t + '\n')
      e.preventDefault()
      return
    }

    if (e.key.length !== 1) return

    if (expectedChar !== e.key) setWrongCount((n) => n + 1)

    setTyped((t) => t + e.key)
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
              Mini-lesson: <b>{lesson.label ?? lesson.chunk}</b>{' '}
              <span style={{ opacity: 0.7 }}>
                (Step {targetIndex + 1}/{targets.length})
              </span>
              {lesson.targetsByTier && (
                <span style={{ opacity: 0.7 }}> — Tier {tier}</span>
              )}
            </div>

            <div className="practice-rules">
              Click the box and type <b>exactly</b> what you see (spaces count). Use{' '}
              <b>Backspace</b> to fix.
            </div>

            {lesson.learnText && (
              <div className="practice-learn">{lesson.learnText}</div>
            )}
          </div>

          <div className="practice-nav">
            <Link to="/lessons" className="practice-back">
              ← Back
            </Link>

            {/* Debug / UX helper: reset tier+streak for current step */}
            <button
              type="button"
              className="practice-reset"
              onClick={() => clearTierAndStreak()}
              title="Reset tier and streak for this step"
              style={{
                marginLeft: 12,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.15)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Reset Tier
            </button>
          </div>
        </div>

        <div className="type-area">
          <div className="type-box">
            {!overlayDismissed && typed.length === 0 && (
              <div
                className="start-overlay"
                onMouseDown={() => {
                  setHasStarted(true)
                  setOverlayDismissed(true)
                  if (!startTimeRef.current) startTimeRef.current = Date.now()
                  focusInput()
                }}
                onClick={() => {
                  setHasStarted(true)
                  setOverlayDismissed(true)
                  if (!startTimeRef.current) startTimeRef.current = Date.now()
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

          {doneExact && (
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

        {doneExact && (
          <div className="next-row">
            <button className="btn-primary" onClick={advance}>
              Next (Space / →)
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

// ------- Below here: keep your existing components unchanged -------
// If your file already has ChunkGrid/Keyboard definitions, keep them as-is.
// Included here for completeness if you need a single-file paste.

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
import { useEffect, useRef, useState } from "react"
import "../styles/syntaxDefense.css"
import { UNITS } from "../data/units"

const WIDTH = 900
const HEIGHT = 520
const HIT_ZONE = HEIGHT - 40

export default function SyntaxDefenseGame() {

    const canvasRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [typed, setTyped] = useState("")
    const [time, setTime] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [shield, setShield] = useState(false)

    const words = useRef([])
    const particles = useRef([])

    const startTime = useRef(0)
    const lastSpawn = useRef(0)
    const freezeUntil = useRef(0)

    const fallSpeed = useRef(0.28)
    const spawnRate = useRef(4200)

    const animationRef = useRef(null)

    function extractLessonSyntax() {

        const pool = []

        UNITS.forEach(unit => {
            unit.lessons.forEach(lesson => {
                lesson.targetsByTier[1].forEach(line => {

                    const cleaned = line.trim()

                    if (cleaned.length < 40) pool.push(cleaned)

                })
            })
        })

        return pool

    }

    const syntaxPool = extractLessonSyntax()

    function randomSyntax() {
        return syntaxPool[Math.floor(Math.random() * syntaxPool.length)]
    }

    function maybePower() {

        const r = Math.random()

        if (r < 0.04) return "freeze"
        if (r < 0.06) return "bomb"
        if (r < 0.08) return "heal"
        if (r < 0.10) return "shield"

        return null

    }

    function spawnWord() {

        if (words.current.length >= 5) return

        const x = Math.random() * (WIDTH - 300) + 80

        if (words.current.some(w => Math.abs(w.x - x) < 160)) {
            return
        }

        words.current.push({

            text: randomSyntax(),
            x,
            y: -20,
            speed: fallSpeed.current,
            power: maybePower()

        })

    }

    function updateDifficulty() {

        const elapsed = (Date.now() - startTime.current) / 1000
        const level = Math.floor(elapsed / 15)

        fallSpeed.current = 0.28 + level * 0.05
        spawnRate.current = Math.max(1800, 4200 - level * 250)

    }

    function applyPower(type) {

        if (type === "freeze") {
            freezeUntil.current = Date.now() + 3000
        }

        if (type === "bomb") {
            words.current = []
        }

        if (type === "heal") {
            setLives(l => Math.min(3, l + 1))
        }

        if (type === "shield") {
            setShield(true)
        }

    }

    function loseLife() {

        if (shield) {
            setShield(false)
            return
        }

        setLives(l => {

            const next = l - 1

            if (next <= 0) {

                setGameOver(true)

                return 0
            }

            return next

        })

    }

    useEffect(() => {

        if (!started) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (!startTime.current) {
            startTime.current = Date.now()
        }

        function update() {

            if (gameOver) return

            const now = Date.now()

            setTime(Math.floor((now - startTime.current) / 1000))

            updateDifficulty()

            if (now - lastSpawn.current > spawnRate.current) {

                spawnWord()
                lastSpawn.current = now

            }

            const frozen = now < freezeUntil.current

            if (!frozen) {

                words.current.forEach(w => {
                    w.y += w.speed
                })

            }

            particles.current.forEach(p => {
                p.y -= 1
                p.life -= 1
            })

            particles.current = particles.current.filter(p => p.life > 0)

            words.current = words.current.filter(w => {

                if (w.y > HIT_ZONE) {

                    loseLife()
                    return false

                }

                return true

            })

        }

        function draw() {

            ctx.clearRect(0, 0, WIDTH, HEIGHT)

            ctx.fillStyle = "#020617"
            ctx.fillRect(0, 0, WIDTH, HEIGHT)

            ctx.strokeStyle = "#0f172a"
            ctx.lineWidth = 1

            for (let x = 0; x < WIDTH; x += 40) {

                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, HEIGHT)
                ctx.stroke()

            }

            for (let y = 0; y < HEIGHT; y += 40) {

                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(WIDTH, y)
                ctx.stroke()

            }

            ctx.font = "24px monospace"

            words.current.forEach(w => {

                const textWidth = ctx.measureText(w.text).width

                if (w.x + textWidth > WIDTH - 10) {
                    w.x = WIDTH - textWidth - 10
                }

                if (w.x < 10) {
                    w.x = 10
                }

                ctx.shadowColor = "#60a5fa"
                ctx.shadowBlur = 10

                ctx.fillStyle = "#e5e7eb"
                ctx.fillText(w.text, w.x, w.y)

                ctx.shadowBlur = 0

                if (w.power) {

                    let emoji = ""

                    if (w.power === "freeze") emoji = "❄️"
                    if (w.power === "bomb") emoji = "💣"
                    if (w.power === "heal") emoji = "❤️"
                    if (w.power === "shield") emoji = "🛡️"

                    ctx.font = "18px monospace"
                    ctx.fillText(emoji, w.x + 10, w.y - 20)

                }

            })

            particles.current.forEach(p => {

                ctx.fillStyle = "#22c55e"
                ctx.font = "18px monospace"
                ctx.fillText("+10", p.x, p.y)

            })

            ctx.strokeStyle = "#ef4444"
            ctx.lineWidth = 2

            ctx.beginPath()
            ctx.moveTo(0, HIT_ZONE)
            ctx.lineTo(WIDTH, HIT_ZONE)
            ctx.stroke()

            ctx.font = "12px monospace"
            ctx.fillStyle = "#ef4444"
            ctx.fillText("SYNTAX HIT ZONE", WIDTH / 2 - 60, HIT_ZONE - 5)

        }

        function loop() {

            if (gameOver) return

            update()
            draw()

            animationRef.current = requestAnimationFrame(loop)

        }

        loop()

        return () => {

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }

        }

    }, [started, gameOver])

    function handleType(e) {

        setTyped(e.target.value)

        const match = words.current.find(w => w.text === e.target.value)

        if (match) {

            if (match.power) applyPower(match.power)

            particles.current.push({
                x: match.x,
                y: match.y,
                life: 30
            })

            setScore(s => s + 10)

            words.current = words.current.filter(w => w !== match)

            setTyped("")

        }

    }

    function startGame() {

        words.current = []
        particles.current = []

        setScore(0)
        setLives(3)
        setTime(0)
        setGameOver(false)
        setShield(false)

        startTime.current = Date.now()
        lastSpawn.current = Date.now()

        setStarted(true)

    }

    return (

        <div className="syntax-game-wrapper">

            <div className="syntax-game">

                <div className="game-hud">

                    <div className="hud-panel">
                        <div className="hud-label">Score</div>
                        <div className="hud-value">{score}</div>
                    </div>

                    <div className="hud-panel">
                        <div className="hud-label">Lives</div>
                        <div className="hud-value">
                            {'❤️'.repeat(lives)}
                            {shield && " 🛡️"}
                        </div>
                    </div>

                    <div className="hud-panel">
                        <div className="hud-label">Time</div>
                        <div className="hud-value">{time}s</div>
                    </div>

                </div>

                <div className="game-area">

                    <canvas
                        ref={canvasRef}
                        width={WIDTH}
                        height={HEIGHT}
                        className="game-canvas"
                    />

                    {!started && (

                        <div className="play-overlay">

                            <button
                                className="play-button"
                                onClick={startGame}
                            >
                                ▶ PLAY
                            </button>

                        </div>

                    )}

                    {gameOver && (

                        <div className="play-overlay">

                            <div className="gameover-box">

                                <h2>Game Over</h2>

                                <p className="gameover-score">
                                    Score: {score}
                                </p>

                                <button
                                    className="play-button"
                                    onClick={startGame}
                                >
                                    Play Again
                                </button>

                            </div>

                        </div>

                    )}

                </div>

                <div className="console-bar">

                    <span className="console-prefix">&gt;</span>

                    <input
                        value={typed}
                        onChange={handleType}
                        placeholder="type syntax..."
                        className="game-console"
                        disabled={!started || gameOver}
                    />

                </div>

            </div>

        </div>

    )

}
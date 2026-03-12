import NavBar from "../components/NavBar"
import SyntaxDefenseGame from "../components/SyntaxDefenseGame"

export default function GamePage() {
    return (
        <div className="games-page">
            <NavBar />
            <h4 className="game-page-title">Type2Code Defense</h4>

            <div className="games-center">
                <SyntaxDefenseGame />
            </div>
        </div>
    )
}
import { useEffect, useState } from "react";
import { GameState } from "../Interfaces";
import { initialPositions } from "./PositionConstants";

import Board from "./Board";

const Game = () => {
    const [gameState, setGameState] = useState<GameState>({
        activePlayer: "",
        boardPositions: {},
    });

    useEffect(() => {
        if (gameState?.activePlayer && gameState?.boardPositions) {
            console.log("findCheckingThreats");
        } else {
            setGameState({
                activePlayer: "white",
                boardPositions: { ...initialPositions },
            });
        }
    }, [gameState]);

    return (
        <div>
            <Board positions={gameState.boardPositions} />
        </div>
    );
};

export default Game;

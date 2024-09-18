import { useEffect, useState } from "react";
import { CapturedPieces, GameState, MoveRecord, Piece } from "../Interfaces";
import { initialPositions } from "./PositionConstants";
import Board from "./Board";
import SidePanel from "./SidePanel";
import RecordedMoves from "./RecordedMoves";
import {
    getAnnotatedMove,
    getSourceNotation,
} from "../services/MoveServices";

// notation regular expression
// ^(\w)?(\w)?(x)?([a-z])([1-8])([+=?!]{0,2})$

const Game = () => {
    const [gameState, setGameState] = useState<GameState>({
        activePlayer: "",
        boardPositions: {},
    });
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
    const [moveRecords, setMoveRecords] = useState<MoveRecord[]>([]);
    const [loadedGameMoves, setLoadedGameMoves] = useState<string[]>([]);
    const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({
        white: [],
        black: [],
    });

    useEffect(() => {
        loadGame();
    }, []);

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

    const loadGame = (): void => {
        let tmpLoadedGameMoves: string[] = [];
        const gameString =
            "1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7 Qxd7 5. c4 Nc6 6. Nc3 Nf6 7. 0-0 g6 8. d4 cxd4 9. Nxd4 Bg7 10. Nde2 Qe6!? 11. Nd5 Qxe4 12. Nc7+ Kd7 13. Nxa8 Qxc4 14. Nb6+ axb6 15. Nc3! Ra8";
        const savedGame = gameString
            .split(/\s*\d+\s*\.\s*/)
            .filter((item) => item !== "");

        savedGame.forEach((gameStep) => {
            const tmpArr = gameStep.split(" ");
            tmpLoadedGameMoves = [...tmpLoadedGameMoves, ...tmpArr];
        });

        setLoadedGameMoves(tmpLoadedGameMoves);
    };

    const isUpperCase = (str: string): boolean => {
        return str.toUpperCase() == str;
    };

    const getNextPlayer = (): string =>
        gameState!.activePlayer === "white" ? "black" : "white";

    const nextMove = (): void => {
        const rawMove = loadedGameMoves[currentMoveIndex];

        if (!rawMove) {
            console.log("end of game");
        } else {
            const annotatedMove = getAnnotatedMove(rawMove);
            let nextMove = annotatedMove.base;
            const isCapture = /x/.test(nextMove);
            const tmpPositions = { ...gameState.boardPositions };
            let targetNotation: string = "";
            let sourceHint: string = "";

            if (isCapture) {
                const matches = /^(\w{1,2})x(\w{2,})$/.exec(nextMove);
                if (matches) {
                    if (isUpperCase(matches[1])) {
                        nextMove = `${matches[1]}${matches[2]}`;
                    } else {
                        sourceHint = matches[1];
                        nextMove = matches[2];
                    }
                    const capturedPiece = tmpPositions[matches[2]]!;
                    const tmpCapturedPieces = { ...capturedPieces };
                    tmpCapturedPieces[capturedPiece.color].push(capturedPiece!);
                    setCapturedPieces(tmpCapturedPieces);
                }
            }

            if (nextMove === "0-0") {
                // Castle King-side
                const kingPiece: Piece = tmpPositions["e1"]!;
                const rookPiece: Piece = tmpPositions["h1"]!;
                tmpPositions["g1"] = kingPiece;
                tmpPositions["f1"] = rookPiece;
                tmpPositions["e1"] = null;
                tmpPositions["h1"] = null;
            } else if (nextMove === "0-0-0") {
                // Castle Queen-side
                const kingPiece: Piece = tmpPositions["e1"]!;
                const rookPiece: Piece = tmpPositions["a1"]!;
                tmpPositions["c1"] = kingPiece;
                tmpPositions["d1"] = rookPiece;
                tmpPositions["e1"] = null;
                tmpPositions["a1"] = null;
            } else {
                targetNotation = nextMove.slice(-2);

                const sourceNotation: string = getSourceNotation({
                    gameState,
                    nextMove,
                    isCapture,
                    sourceHint,
                });
                const movingPiece: Piece =
                    gameState.boardPositions[sourceNotation]!;
                tmpPositions[sourceNotation!] = null;
                tmpPositions[targetNotation] = movingPiece!;
            }

            const tmpMoveRecords = [...moveRecords];
            if (gameState.activePlayer === "white") {
                const whiteMove: MoveRecord = { white: rawMove, black: "" };
                tmpMoveRecords.push(whiteMove);
            } else {
                const blackMove: MoveRecord = tmpMoveRecords.at(-1)!;
                blackMove.black = rawMove;
            }

            setMoveRecords(tmpMoveRecords);
            setCurrentMoveIndex((previous) => ++previous);
            setGameState({
                activePlayer: getNextPlayer(),
                boardPositions: tmpPositions,
            });
        }
    };

    return (
        // <div className="grid grid-cols-[_minmax(0,_1fr)_minmax(0,_200px)_minmax(900px,_1fr)_200px_minmax(0,_200px)]">
        <div className="flex justify-center my-2">
            <div>
                <SidePanel capturedPieces={capturedPieces["white"]} />
            </div>
            <Board positions={gameState.boardPositions} />
            <div>
                <SidePanel capturedPieces={capturedPieces["black"]} />
                <RecordedMoves moves={moveRecords} onNextMove={nextMove} />
            </div>
        </div>
    );
};

export default Game;

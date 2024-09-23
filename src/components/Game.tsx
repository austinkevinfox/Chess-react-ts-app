import { ChangeEvent, useEffect, useState } from "react";
import { CapturedPieces, GameState, MoveRecord, Piece } from "../Interfaces";
import { initialPositions } from "./PositionConstants";
import { games as gameLibrary } from "../../public/game-library";
import Board from "./Board";
import SidePanel from "./SidePanel";
import RecordedMoves from "./RecordedMoves";
import { getAnnotatedMove, getSourceNotation } from "../services/MoveServices";
import ControlBar from "./RecordedGames/ControlBar";
declare type GameType = keyof typeof gameLibrary;

const Game = () => {
    const [gameState, setGameState] = useState<GameState>({
        activePlayer: "",
        boardPositions: {},
    });
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<string>("");
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
    const [moveRecords, setMoveRecords] = useState<MoveRecord[]>([]);
    const [loadedGameMoves, setLoadedGameMoves] = useState<string[]>([]);
    const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({
        white: [],
        black: [],
    });
    const [lastSource, setLastSource] = useState<string>("");
    const [lastTarget, setLastTarget] = useState<string>("");

    useEffect(() => {
        loadGame(null);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        let timer = 0;
        if (isPlaying) {
            if (!isGameOver) {
                timer = setTimeout(() => {
                    nextMove();
                }, 3000);
            } else {
                setIsPlaying(false);
            }
        }
        return () => clearTimeout(timer);
    });

    const initGame = (e: ChangeEvent): void => {
        const gameTitle: string = (e.target as HTMLTextAreaElement).value;
        setSelectedGame(gameTitle);
        loadGame(gameLibrary[gameTitle as GameType]);
        resetGame();
    };

    const resetGame = (): void => {
        setIsPlaying(false);
        setIsGameOver(false);
        setMoveRecords([]);
        setCurrentMoveIndex(0);
        setCapturedPieces({
            white: [],
            black: [],
        });
        setGameState({
            activePlayer: "white",
            boardPositions: { ...initialPositions },
        });
    };

    const loadGame = (gameString: string | null): void => {
        const loadedGame = gameString || "1. e4 c5";
        let tmpLoadedGameMoves: string[] = [];
        // const gameString =
        //     "1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7 Qxd7 5. c4 Nc6 6. Nc3 Nf6 7. 0-0 g6 8. d4 cxd4 9. Nxd4 Bg7 10. Nde2 Qe6!? 11. Nd5 Qxe4 12. Nc7+ Kd7 13. Nxa8 Qxc4 14. Nb6+ axb6 15. Nc3! Ra8";
        const savedGame = loadedGame
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

    const play = (): void => {
        setIsPlaying(true);
        nextMove();
    };

    const pause = (): void => {
        setIsPlaying(false);
    };

    const nextMove = (): void => {
        const rawMove = loadedGameMoves[currentMoveIndex];

        if (!rawMove) {
            setIsGameOver(true);
        } else {
            const annotatedMove = getAnnotatedMove(rawMove);
            let nextMove = annotatedMove.base;
            const isCapture = /x/.test(nextMove);
            const tmpPositions = { ...gameState.boardPositions };
            let sourceNotation = "";
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

            if (/^[O0]-[O0]$/.test(nextMove)) {
                // Castle King-side
                if (gameState.activePlayer === "white") {
                    const kingPiece: Piece = tmpPositions["e1"]!;
                    const rookPiece: Piece = tmpPositions["h1"]!;
                    tmpPositions["g1"] = kingPiece;
                    tmpPositions["f1"] = rookPiece;
                    tmpPositions["e1"] = null;
                    tmpPositions["h1"] = null;
                } else {
                    const kingPiece: Piece = tmpPositions["e8"]!;
                    const rookPiece: Piece = tmpPositions["h8"]!;
                    tmpPositions["g8"] = kingPiece;
                    tmpPositions["f8"] = rookPiece;
                    tmpPositions["e8"] = null;
                    tmpPositions["h8"] = null;
                }
            } else if (/^[O0]-[O0]-[O0]$/.test(nextMove)) {
                // Castle Queen-side
                const kingPiece: Piece = tmpPositions["e1"]!;
                const rookPiece: Piece = tmpPositions["a1"]!;
                tmpPositions["c1"] = kingPiece;
                tmpPositions["d1"] = rookPiece;
                tmpPositions["e1"] = null;
                tmpPositions["a1"] = null;
            } else {
                targetNotation = nextMove.slice(-2);

                sourceNotation = getSourceNotation({
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

            setLastSource(sourceNotation);
            setLastTarget(targetNotation);
            setMoveRecords(tmpMoveRecords);
            setCurrentMoveIndex((previous) => ++previous);
            setGameState({
                activePlayer: getNextPlayer(),
                boardPositions: tmpPositions,
            });
        }
    };

    return (
        <div className="grid grid-cols-[200px_minmax(400px,_1fr)] items-start">
            <RecordedMoves moves={moveRecords} />
            <div>
                <ControlBar
                    selectedGameTitle={selectedGame}
                    gameTitleList={Object.keys(gameLibrary)}
                    onChangeGame={initGame}
                    onRewind={resetGame}
                    onNextMove={nextMove}
                    onPlay={play}
                    onPause={pause}
                    isPlaying={isPlaying}
                    isGameOver={isGameOver}
                />

                <div className="flex justify-center my-2 h-4/5">
                    <div>
                        <SidePanel
                            color="black"
                            capturedWhite={capturedPieces["white"]}
                            capturedBlack={capturedPieces["black"]}
                        />
                    </div>
                    <Board
                        positions={gameState.boardPositions}
                        lastSource={lastSource}
                        lastTarget={lastTarget}
                    />
                    <div>
                        <SidePanel
                            color="white"
                            capturedWhite={capturedPieces["white"]}
                            capturedBlack={capturedPieces["black"]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;

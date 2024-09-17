import { Files } from "../components/PositionConstants";
import { GameState, Piece } from "../Interfaces";

declare type FileType = keyof typeof Files;

export const getSourceNotation = ({
    gameState,
    nextMove,
    isCapture,
    sourceHint,
}: {
    gameState: GameState;
    nextMove: string;
    isCapture: boolean;
    sourceHint: string;
}): string => {
    let sourceNotation = "";
    const code = nextMove.substring(0, 1);
    const targetNotation = nextMove.slice(-2);

    if (targetNotation.length === 2) {
        // Pawn move
        const [file, rank] = targetNotation.split("");
        const sourceFile =
            isCapture && sourceHint.length === 1 ? sourceHint : file;
        const sourceRankIncrement = gameState.activePlayer === "white" ? -1 : 1;
        let sourceRank: number = parseInt(rank) + sourceRankIncrement;
        sourceNotation = `${sourceFile}${sourceRank}`;

        // Handle 2 square openings
        if (
            (gameState.activePlayer === "white" && rank === "4") ||
            (gameState.activePlayer === "black" && rank === "5")
        ) {
            let sourcePiece: Piece | null =
                gameState.boardPositions[sourceNotation];

            while (sourcePiece === null) {
                sourceRank += sourceRankIncrement;
                sourceNotation = `${file}${sourceRank}`;
                sourcePiece = gameState.boardPositions[sourceNotation];
            }
        }
    }

    if (code === "N") {
        // Knight move
        const [fileStr, rankStr] = targetNotation.split("");
        const sourceHint: string =
            nextMove.length === 4 ? nextMove.substring(2, 1) : "";

        const possibleKnightSources = getKnightSources({
            file: fileStr,
            rank: rankStr,
            gameState,
        });

        if (sourceHint.length > 0 && possibleKnightSources.length > 1) {
            const negativeIndex = isNaN(Number(sourceHint)) ? -2 : -1;
            sourceNotation = possibleKnightSources.filter(
                (notation) => notation.slice(negativeIndex) === sourceHint
            )[0];
        } else {
            sourceNotation = possibleKnightSources[0];
        }
    }

    if (code === "B") {
        // Bishop move
        const [fileStr, rankStr] = targetNotation.split("");
        sourceNotation = getBishopSource({
            file: fileStr,
            rank: rankStr,
            gameState,
        });
    }

    return sourceNotation;
};

const getKnightSources = ({
    file,
    rank,
    gameState,
}: {
    file: string;
    rank: string;
    gameState: GameState;
}): string[] => {
    const knightMoves: string[] = [];
    const fileIndex = Files[file as FileType];
    const rankNumber = parseInt(rank);

    [-2, -1, 1, 2].forEach((i) => {
        const fileString: string | undefined = Files[fileIndex + i];

        if (fileString) {
            if (i === -2 || i === 2) {
                [-1, 1].forEach((step) => {
                    const notation = `${fileString}${rankNumber + step}`;
                    if (
                        isKnightPosition(
                            rankNumber,
                            gameState.boardPositions[notation]
                        )
                    ) {
                        knightMoves.push(notation);
                    }
                });
            } else {
                [-2, 2].forEach((step) => {
                    const notation = `${fileString}${rankNumber + step}`;
                    if (
                        isKnightPosition(
                            rankNumber,
                            gameState.boardPositions[notation]
                        )
                    ) {
                        knightMoves.push(notation);
                    }
                });
            }
        }
    });

    return knightMoves;
};

const getBishopSource = ({
    file,
    rank,
    gameState,
}: {
    file: string;
    rank: string;
    gameState: GameState;
}): string => {
    let bishopSource: string | null = null;
    const fileIndex = Files[file as FileType];
    const rankNumber = parseInt(rank);

    for (const direction of [
        "northeast",
        "southeast",
        "southwest",
        "northwest",
    ]) {
        bishopSource = getBishopSourceByDirection({
            direction,
            fileIndex,
            rankNumber,
            gameState,
        });
        if (bishopSource) break;
    }

    return bishopSource!;
};

const getBishopSourceByDirection = ({
    direction,
    fileIndex,
    rankNumber,
    gameState,
}: {
    direction: string;
    fileIndex: number;
    rankNumber: number;
    gameState: GameState;
}): string => {
    let source: string = "";
    let piece: Piece | null;
    let fileIncrement = 0;
    let rankIncrement = 0;

    switch (direction) {
        case "northeast":
            fileIncrement = 1;
            rankIncrement = 1;
            break;

        case "southeast":
            fileIncrement = 1;
            rankIncrement = -1;
            break;

        case "southwest":
            fileIncrement = -1;
            rankIncrement = -1;
            break;

        case "northwest":
            fileIncrement = -1;
            rankIncrement = 1;
            break;

        default:
            fileIncrement = 0;
            rankIncrement = 0;
    }

    let nextFileIndex = fileIndex + fileIncrement;
    let nextRank = rankNumber + rankIncrement;

    while (
        nextFileIndex >= 0 &&
        nextFileIndex < 8 &&
        nextRank > 0 &&
        nextRank <= 8 &&
        source === ""
    ) {
        const notation = `${Files[nextFileIndex]}${nextRank}`;
        piece = gameState.boardPositions[notation];

        if (piece?.code === "B" && piece?.color === gameState.activePlayer) {
            source = notation;
        } else {
            nextFileIndex += fileIncrement;
            nextRank += rankIncrement;
        }
    }

    return source;
};

const isKnightPosition = (rank: number, piece: Piece | null): boolean =>
    rank >= 1 && rank <= 8 && piece?.code === "N";

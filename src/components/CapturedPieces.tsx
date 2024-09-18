// import React from "react";
import { Piece } from "../Interfaces";
import { getImageSource } from "../services/PieceServices";

const CapturedPieces = ({
    pieces,
    type,
}: {
    pieces: Piece[];
    type: string;
}) => {
    return (
        <div data-test={`captured-${type}`} className="flex my-1">
            {pieces.map((piece, idx) => (
                <img
                    key={`capturedPiece_${idx}`}
                    className={`${piece.code === "P" ? "w-5" : "w-8"} mx-1`}
                    src={getImageSource(piece)}
                />
            ))}
        </div>
    );
};

export default CapturedPieces;

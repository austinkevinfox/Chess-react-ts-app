// import React from 'react'
import { ReactElement } from "react";
import { Piece } from "../Interfaces";
import CapturedPieces from "./CapturedPieces";

interface SidePanelProps {
    capturedPieces: Piece[];
}

const SidePanel = ({ capturedPieces }: SidePanelProps) => {
    const getPiecesByCode = (code: string): ReactElement | undefined => {
        const filteredPieces = capturedPieces.filter(
            (piece) => piece.code === code
        );
        if (filteredPieces?.length > 0) {
            return <CapturedPieces type="pawns" pieces={filteredPieces} />;
        }
        return;
    };

    return (
        <div className="mx-2 bg-orange-100 min-w-60 max-w-96 h-1/3">
            <div>SidePanel</div>

            {getPiecesByCode("P")}
            {getPiecesByCode("N")}
            {getPiecesByCode("B")}
            {getPiecesByCode("R")}
            {getPiecesByCode("Q")}
        </div>
    );
};

export default SidePanel;

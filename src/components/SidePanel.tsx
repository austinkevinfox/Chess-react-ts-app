import { ReactElement } from "react";
import { Piece } from "../Interfaces";
import CapturedPieces from "./CapturedPieces";
import Score from "./Score";

interface SidePanelProps {
    color: string;
    capturedWhite: Piece[];
    capturedBlack: Piece[];
}

const SidePanel = ({ color, capturedWhite, capturedBlack }: SidePanelProps) => {
    const children = color === "white" ? capturedBlack : capturedWhite;

    const getPiecesByCode = (code: string): ReactElement | undefined => {
        const filteredPieces = children.filter((piece) => piece.code === code);
        if (filteredPieces?.length > 0) {
            return <CapturedPieces type={code} pieces={filteredPieces} />;
        }
        return;
    };

    return (
        <div className="mx-2 p-1 bg-orange-100 min-w-60 h-1/3">
            <Score
                color={color}
                capturedWhite={capturedWhite}
                capturedBlack={capturedBlack}
            />

            {getPiecesByCode("P")}
            {getPiecesByCode("N")}
            {getPiecesByCode("B")}
            {getPiecesByCode("R")}
            {getPiecesByCode("Q")}
        </div>
    );
};

export default SidePanel;

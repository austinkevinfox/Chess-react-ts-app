import { useState, useEffect } from "react";
import { Piece } from "../Interfaces";
import { getImageSource } from "../services/PieceServices";

interface SquareProps {
    bgUtilityClass: string;
    file: string;
    rank: number;
    piece: Piece | null;
}

const Square = ({ bgUtilityClass, file, rank, piece }: SquareProps) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const [borderUtilityClass, setBorderUtilityClass] =
        useState<string>("ring-0");

    const getLabel = (id: string): string => {
        if (id === "file" && rank === 1) {
            return file;
        }
        if (id === "rank" && file === "a") {
            return rank.toString();
        }
        return "";
    };

    useEffect(() => {
        const tmpImageSrc: string = getImageSource(piece);
        setImageSrc(tmpImageSrc);
    }, [piece]);

    const toggleSelection = (): void => {
        if (borderUtilityClass === "ring-0") {
            setBorderUtilityClass("ring-8");
        } else {
            setBorderUtilityClass("ring-0");
        }
    };

    return (
        <div
            className={`relative w-1/8 aspect-square ring-inset ring-amber-400/50 ${bgUtilityClass} ${borderUtilityClass}`}
            onClick={toggleSelection}
        >
            <div className="absolute top-1 left-1">{getLabel("rank")}</div>
            <div className={"absolute top-6 flex justify-center items-center"}>
                {imageSrc.length > 0 ? (
                    <img className="w-1/2" src={imageSrc} />
                ) : (
                    ""
                )}
            </div>
            <div className="absolute bottom-1 right-1">{getLabel("file")}</div>
        </div>
    );
};

export default Square;

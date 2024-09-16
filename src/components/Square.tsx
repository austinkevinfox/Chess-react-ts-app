import { useState, useEffect } from "react";

import { Piece } from "../Interfaces";

interface SquareProps {
    bgUtilityClass: string;
    notation: string;
    piece: Piece | null;
}

const Square = ({ bgUtilityClass, notation, piece }: SquareProps) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const [borderUtilityClass, setBorderUtilityClass] =
        useState<string>("ring-0");

    useEffect(() => {
        let tmpImageSrc: string;
        if (piece) {
            const colorInitial: string = piece.color.substring(0, 1);
            tmpImageSrc = `/svg-no-shadow/${colorInitial}_${piece.name}_svg_NoShadow.svg`;
            setImageSrc(tmpImageSrc);
        }
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
            className={`w-1/8 aspect-square ring-inset ring-amber-400/50 ${bgUtilityClass} ${borderUtilityClass}`}
            onClick={toggleSelection}
        >
            <div className="ml-2">{notation}</div>
            <div className={"flex justify-center items-center mt-4"}>
                {imageSrc.length > 0 ? (
                    <img className="w-1/3" src={imageSrc} />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default Square;

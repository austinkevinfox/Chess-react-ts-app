// import React from "react";

interface BoardProps {
    // colors: string[];
    positions: BoardPositionHash;
}

import { ReactNode } from "react";
import { Files } from "./PositionConstants";
import Square from "./Square";
import { BoardPositionHash } from "../Interfaces";

const Board = ({ positions }: BoardProps) => {
    // const colors = ["bg-slate-100", "bg-slate-500"];
    // const bgColors = [...colors];
    const bgStrings = [
        "even:bg-slate-100 odd:bg-slate-500",
        "even:bg-slate-500 odd:bg-slate-100",
    ];

    return (
        <div className="grid h-screen place-items-center">
            <div className="grid grid-cols-8 w-1/2 aspect-square">
                {[8, 7, 6, 5, 4, 3, 2, 1].map((rank): ReactNode => {
                    const bgClassUtil = bgStrings.reverse()[0];
                    return [0, 1, 2, 3, 4, 5, 6, 7].map((index): ReactNode => {
                        const file = Files[index];
                        const notation = `${file}${rank}`;

                        return (
                            <Square
                                bgUtilityClass={bgClassUtil}
                                notation={notation}
                                piece={positions[notation]}
                            />
                        );
                    });
                })}
            </div>
        </div>
    );
};

export default Board;
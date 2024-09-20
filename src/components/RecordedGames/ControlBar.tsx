import { ChangeEvent } from "react";
import Icon from "@mdi/react";
import {
    mdiPlay,
    mdiPause,
    mdiStepBackward,
    mdiStepForward,
    mdiRewind,
} from "@mdi/js";

interface ControlBarProps {
    selectedGameTitle: string;
    gameTitleList: string[];
    onChangeGame: (e: ChangeEvent) => void;
    onRewind: () => void;
    onNextMove: () => void;
    onPlay: () => void;
    isPlaying: boolean;
    isGameOver: boolean;
}

const ControlBar = ({
    selectedGameTitle,
    gameTitleList,
    onChangeGame,
    onRewind,
    onNextMove,
    onPlay,
    isPlaying,
    isGameOver,
}: ControlBarProps) => {
    // const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const onPlayPauseClick = (): void => {
        if (!isPlaying) {
            onPlay();
        }
    };

    return (
        <div data-test="control-bar" className="flex justify-center py-2 h-1/5">
            <select
                className="select select-bordered select-sm w-full max-w-xs"
                value={selectedGameTitle}
                onChange={onChangeGame}
            >
                <option disabled value="">
                    Select a game
                </option>
                {gameTitleList.map((title) => (
                    <option key={title} value={title}>
                        {title}
                    </option>
                ))}
            </select>
            <div
                className={`flex px-4 items-center ${
                    selectedGameTitle.length === 0 && "invisible"
                }`}
            >
                <button className="btn btn-square btn-outline mx-2">
                    <Icon path={mdiStepBackward} size={1} />
                </button>

                {isGameOver && (
                    <button
                        className="btn btn-square btn-outline mx-2"
                        onClick={onRewind}
                    >
                        <Icon path={mdiRewind} size={1} />
                    </button>
                )}

                {!isGameOver && (
                    <button
                        className="btn btn-square btn-outline mx-2"
                        onClick={onPlayPauseClick}
                    >
                        {isPlaying ? (
                            <Icon path={mdiPause} size={1} />
                        ) : (
                            <Icon
                                path={mdiPlay}
                                title="Play"
                                size={1}
                                horizontal
                                vertical
                                rotate={180}
                            />
                        )}
                    </button>
                )}

                <button
                    className={`btn btn-square btn-outline mx-2 ${
                        isGameOver && "btn-disabled"
                    }`}
                    onClick={onNextMove}
                >
                    <Icon path={mdiStepForward} size={1} />
                </button>
            </div>
        </div>
    );
};

export default ControlBar;

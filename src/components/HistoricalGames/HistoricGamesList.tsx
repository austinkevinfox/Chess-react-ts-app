import useHistoricGames from "../../hooks/useHistoricGames";
import Icon from "@mdi/react";
import { mdiEye, mdiChessKnight } from "@mdi/js";

const HistoricGamesList = () => {
    const { data, error, isLoading } = useHistoricGames();

    const launchGamePlay = (id: number): void => {
        console.log(
            "launch game",
            data.find((game) => game.id === id)
        );
    };

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col justify-center items-center overflow-x-auto">
            <h1 className="text-2xl my-8">Historic Games</h1>
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>White</th>
                        <th>Black</th>
                        <th>Winner</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((game, idx) => (
                        <tr key={game.id}>
                            <th>{idx + 1}</th>
                            <td>{game.title}</td>
                            <td>{game.date}</td>
                            <td>{game.white}</td>
                            <td>{game.black}</td>
                            <td>
                                {game.result === "1-0"
                                    ? "White"
                                    : game.result === "0-1"
                                    ? "Black"
                                    : "Draw"}
                            </td>
                            <td>
                                <button
                                    className="btn btn-outline mx-2"
                                    onClick={() => launchGamePlay(game.id)}
                                >
                                    <Icon path={mdiChessKnight} size={1} />
                                    Play
                                </button>
                                <button
                                    className="btn btn-outline mx-2"
                                    onClick={() => launchGamePlay(game.id)}
                                >
                                    <Icon path={mdiEye} size={1} />
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoricGamesList;

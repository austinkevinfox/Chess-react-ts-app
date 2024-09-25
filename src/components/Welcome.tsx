import Icon from "@mdi/react";
import { mdiChessKnight } from "@mdi/js";

const Welcome = () => {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Icon path={mdiChessKnight} size="60px" rotate={45} />
            <h1>CryptoChess</h1>
        </div>
    );
};

export default Welcome;

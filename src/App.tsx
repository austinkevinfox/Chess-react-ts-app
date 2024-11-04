import { ReactElement, useState } from "react";
import Game from "./components/Game";
import NavDrawer from "./NavDrawer";
import Welcome from "./components/Welcome";
import LiveGame from "./components/LiveGame";
import MainContent from "./components/MainContent";
import HistoricGamesList from "./components/HistoricalGames/HistoricGamesList";

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [mainContent, setMainContent] = useState<ReactElement>(<Welcome />);

    const onDrawerButtonClick = (): void =>
        setIsDrawerOpen((previous) => !previous);

    const onNavItemClick = (e: React.MouseEvent): void => {
        const navOption: string = (e.target as HTMLAnchorElement).id;
        onDrawerButtonClick();

        switch (navOption) {
            case "historic":
                setMainContent(<Game />);
                break;

            case "historic-list":
                setMainContent(<HistoricGamesList />);
                break;

            case "live":
                setMainContent(<LiveGame />);
                break;

            default:
                setMainContent(<Welcome />);
        }
    };

    return (
        <div className="drawer">
            <input
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={isDrawerOpen}
            />
            <MainContent content={mainContent} onDrawerButtonClick={onDrawerButtonClick} />
            <NavDrawer onNavItemClick={onNavItemClick} />
        </div>
    );
}

export default App;

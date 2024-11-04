// import { useState } from 'react'
interface NavDrawerProps {
    onNavItemClick: (e: React.MouseEvent) => void;
}

const NavDrawer = ({ onNavItemClick }: NavDrawerProps) => {
    return (
        <div className="drawer-side">
            <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <li>
                    <a id="historic" onClick={onNavItemClick}>
                        Historic Games
                    </a>
                </li>
                <li>
                    <a id="historic-list" onClick={onNavItemClick}>
                        Historic Games List
                    </a>
                </li>
                <li>
                    <a id="live" onClick={onNavItemClick}>
                        Live Game
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default NavDrawer
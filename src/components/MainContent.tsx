// import React from 'react'

import { ReactNode } from "react";

interface MainContentProps {
    content: ReactNode;
    onDrawerButtonClick: () => void;
}

const MainContent = ({
    content,
    onDrawerButtonClick,
}: MainContentProps) => {
    return (
        <div className="drawer-content relative">
            {content}
            <label
                htmlFor="my-drawer"
                className="btn btn-neutral btn-sm drawer-button absolute top-3 -left-2"
                onClick={onDrawerButtonClick}
            >
                ||
            </label>
        </div>
    );
};

export default MainContent;

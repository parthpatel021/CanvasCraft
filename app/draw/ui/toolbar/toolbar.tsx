"use client";

import { toolBarBtns } from "@/app/lib/constants";
import ToolBarBtn from "./toolButton";
import { ToolHook } from "../../hooks/useTools";

export default function ToolBar({selectedTool, setTool}: ToolHook) {
    const handleBtnClick = (toolName: string) => {
        setTool(toolName);
    };
    return (
        <div className="bg-neutral-800 absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md z-2">
            <div className="flex justify-between items-center divide-x divide divide-neutral-700">
                <div className="flex justify-center items-center gap-1 pl-1">
                    {toolBarBtns.map((btnData) => (
                        <ToolBarBtn
                            {...btnData}
                            key={btnData.slug}
                            active={btnData.slug === selectedTool}
                            clickCB={handleBtnClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

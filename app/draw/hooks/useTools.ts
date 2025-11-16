"use client";

import { useState } from "react";

export type ToolHook = {
    selectedTool: string,
    setTool: (toolName: string) => void,
    lock: boolean,
    toggleToolLock: () => void,
    resetTool: () => void,
}

export default function useTools() {
    const [selectedTool, setSelectedTool] = useState("selection");
    const [lock, setLock] = useState(false);

    const setTool = (toolName: string) => {
        setSelectedTool(toolName);
    }
    const toggleToolLock = () => setLock((prev: boolean) => !prev);

    const resetTool = () => {
        if (lock) return;
        setSelectedTool("selection");
        setLock(false);
    }

    return {
        selectedTool,
        setTool,
        lock,
        toggleToolLock,
        resetTool,
    }
}

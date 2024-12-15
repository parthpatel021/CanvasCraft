import { useState } from "react";

export default function useTool() {
    const [tool, setTool] = useState({
        selectedTool: "rectangle",
        toolLock: false,
        cursor: "crosshair",
    });

    return {tool, setTool};
}
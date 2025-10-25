"use client";

import { Metadata } from "next";
import ToolBar from "./ui/toolbar/toolbar";
import useTools from "./hooks/useTools";
import useCanvas from "./hooks/useCanvas";

export default function Canvas() {
    const tools = useTools();

    const {
        mouseDown,
        mouseMove,
        mouseUp
    } = useCanvas();

    return (
        <div className="h-screen w-full">
            <ToolBar {...tools} />
            <canvas
                onMouseMove={mouseMove}
                onMouseDown={(ev) => mouseDown(ev, tools.selectedTool)}
                onMouseUp={mouseUp}
                width={window.innerWidth}
                height={window.innerHeight}
                id='canvas'
            >Drawing Canvas</canvas>
        </div>
    );
}

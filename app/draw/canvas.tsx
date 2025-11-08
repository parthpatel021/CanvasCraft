"use client";

import { Metadata } from "next";
import ToolBar from "./ui/toolbar/toolbar";
import useTools from "./hooks/useTools";
import useCanvas from "./hooks/useCanvas";
import { useEffect, useState } from "react";

export default function Canvas() {
    const tools = useTools();
    const {
        mouseDown,
        mouseMove,
        mouseUp
    } = useCanvas();

    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <div className="h-screen w-full">
            <ToolBar {...tools} />
            <canvas
                onMouseMove={mouseMove}
                onMouseDown={(ev) => mouseDown(ev, tools.selectedTool)}
                onMouseUp={mouseUp}
                width={size.width}
                height={size.height}
                id='canvas'
            >Drawing Canvas</canvas>
        </div>
    );
}

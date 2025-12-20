"use client";

import useTools from "../hooks/useTools";
import useCanvas from "../hooks/useCanvas";
import { useEffect, useState } from "react";

import { ShapeAction, TextAreaInput, ToolBar } from "./ui"

export default function Canvas() {
    const tools = useTools();
    const {
        state,
        getActiveElement,
        mouseDown,
        mouseMove,
        mouseUp,
        handleClick,
        handleBlur,
        draw,
    } = useCanvas(tools);

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
                onMouseDown={(ev) => mouseDown(ev)}
                onMouseUp={(ev) => mouseUp(ev)}
                onClick={(ev) => handleClick(ev)}
                width={size.width}
                height={size.height}
                id='canvas'
            >Drawing Canvas</canvas>
            {state.action === "write" &&
                <TextAreaInput
                    getElement={getActiveElement}
                    onBlur={handleBlur}
                />
            }
            <ShapeAction getElement={getActiveElement} draw={draw} />
        </div>
    );
}

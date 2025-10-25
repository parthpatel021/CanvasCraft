"use client";

import React, { useEffect, useState } from "react";
import rough from "roughjs";

export type CanvasHook = {
    selectedTool: string;
    setTool: (toolName: string) => void;
    lock: boolean;
    toggleToolLock: () => void;
};

export default function useCanvas() {
    const [roughCanvas, setRoughCanvas] = useState<ReturnType<typeof rough['canvas']> | null>(null);

    const initCanvas = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const rc = rough.canvas(canvas);
        setRoughCanvas(rc);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        if (!roughCanvas) {
            initCanvas();
            return;
        }

        roughCanvas.rectangle(100, 100, 200, 200, {stroke: 'white', strokeWidth: 2, bowing: 2, roughness: 2.8, fill: 'blue' });
        roughCanvas.rectangle(350, 100, 200, 200, {stroke: 'white', strokeWidth: 2, fill: 'green', fillStyle: 'solid'  });
    }, [roughCanvas]);

    const mouseDown = (ev: React.MouseEvent<HTMLCanvasElement>, selectedTool:string) => {
    };
    const mouseMove = () => console.log("mouseMove");
    const mouseUp = () => console.log("mouseUp");

    return {
        mouseDown,
        mouseMove,
        mouseUp,
    };
}

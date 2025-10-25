"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

export type CanvasHook = {
    selectedTool: string;
    setTool: (toolName: string) => void;
    lock: boolean;
    toggleToolLock: () => void;
};

export default function useCanvas() {
    const [roughCanvas, setRoughCanvas] = useState<ReturnType<typeof rough['canvas']> | null>(null);
    const [elements, setElements] = useState<any[]>([]);

    const draw = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas || !roughCanvas) {
            return;
        }
        const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
        const generator = roughCanvas.generator;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const opts =  { stroke: 'white', strokeWidth: 2, bowing: 2, roughness: 2.8, fill: 'blue' };
        const elementsWithShape = elements.map(ele => {
            if (!ele.shape) {
                ele.shape = generator.rectangle(ele.x, ele.y, 200, 200, opts);
            }
            return ele;
        });
        setElements(elementsWithShape);

        elementsWithShape.forEach((ele) => {
            roughCanvas.draw(ele.shape);
        });
        
    }

    // Effects
    useEffect(() => {
        // Initalize canvas and rendering context
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const rc = rough.canvas(canvas);
        setRoughCanvas(rc);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        if (!roughCanvas) {
            return;
        }
        draw();
    }, [roughCanvas, elements.length]);

    // Element Handlers
    const addElement = (elementType: string, x: number, y: number) => {
        setElements((prev: any) => [...prev, { type: elementType, x, y }]);
    }

    // Mouse Event Handlers
    const getViewCoords = (event: React.MouseEvent<HTMLCanvasElement>) => {
        // Calculate mouse coordinates after applying viewport transformations (pan/zoom)
        const clientX = event.clientX;
        const clientY = event.clientY;
        return { clientX, clientY }
    }

    const mouseDown = (ev: React.MouseEvent<HTMLCanvasElement>, selectedTool: string) => {
        const { clientX, clientY } = getViewCoords(ev);
        addElement(selectedTool, clientX, clientY);
    };
    const mouseMove = () => {};
    const mouseUp = () => {};

    return {
        mouseDown,
        mouseMove,
        mouseUp,
    };
}

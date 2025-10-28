"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";
import { Shape } from "../models/shape";
import { drawableCanvasType } from "@/app/lib/constants";
import { SUPPORTED_TYPE_ARR, SUPPOTED_TYPE } from "@/app/lib/definations";

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

        elements.forEach((ele) => {
            const roughEleShape = ele.getRoughShape(generator);
            if (roughEleShape) {
                roughCanvas.draw(ele.getRoughShape(generator));
            } else {
                console.warn("Unable to draw shape for element : ", ele);
            }
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
    const addElement = (elementType: SUPPOTED_TYPE, x: number, y: number) => {
        const elementShape = new Shape(elementType, x, y);
        setElements((prev: any) => [...prev, elementShape]);
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
        if (SUPPORTED_TYPE_ARR.includes(selectedTool)) {
            addElement(selectedTool as SUPPOTED_TYPE, clientX, clientY);
        }
    };
    const mouseMove = () => { };
    const mouseUp = () => { };

    return {
        mouseDown,
        mouseMove,
        mouseUp,
    };
}

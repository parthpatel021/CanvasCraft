"use client";

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";
import { Shape } from "../models/shape";
import { drawableCanvasType } from "@/app/lib/constants";
import { SUPPORTED_TYPE_ARR, SUPPOTED_TYPE } from "@/app/lib/definations";
import { RoughCanvas } from "roughjs/bin/canvas";

export type CanvasHook = {
    selectedTool: string;
    setTool: (toolName: string) => void;
    lock: boolean;
    toggleToolLock: () => void;
};

export default function useCanvas() {
    const getRoughCanvas = useCallback(() => {
        const rc = (globalThis as any).roughCanvas;
        if (!rc) {
            initCanvas();
        }
        return (globalThis as any).roughCanvas;
    }, [(globalThis as any).roughCanvas]);

    const elements = React.useRef<Record<string, Shape>>({}); // uuid to element mapping
    const elementList = React.useRef<string[]>([]); // element list uuid
    const [activeElementUuid, setActiveElementUuid] = useState("");

    const getActiveElement = useCallback(() => elements.current[activeElementUuid], [activeElementUuid]);

    const setActiveElement = (ele: Shape) => setActiveElementUuid(ele?.uuid);
    const resetActiveElement = () => setActiveElementUuid("");

    const draw = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        const roughCanvas = getRoughCanvas();
        if (!canvas) {
            return;
        }
        const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elementList.current.forEach((uuid) => {
            const ele = elements.current[uuid];
            const roughEleShape = ele.getRoughShape();
            if (roughEleShape) {
                roughCanvas.draw(roughEleShape);
            } else {
                console.warn("Unable to draw shape for element : ", ele);
            }
        });

        // Add border to active element
        const activeElement = getActiveElement();
        if (activeElement) {
            const activeBox = new Shape("rectangle", activeElement.x1 - 10, activeElement.y1 - 10);
            activeBox.update(
                { x2: activeElement.x2 + 10, y2: activeElement.y2 + 10 },
                { stroke: "blue", strokeWidth: 1, roughness: 0, bowing: 0, fill: null }
            );
            const roughActiveBox = activeBox.getRoughShape();
            roughCanvas.draw(roughActiveBox);
        }
    }

    const initCanvas = () => {
        // Initalize canvas and rendering context
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const rc = rough.canvas(canvas);
        (globalThis as any).roughCanvas = rc;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (elementList.current.length) {
            draw();
        }
    }

    const addElement = (elementType: SUPPOTED_TYPE, x: number, y: number) => {
        const elementShape = new Shape(elementType, x, y);
        // store in map and list
        elements.current[elementShape.uuid] = elementShape;
        elementList.current.push(elementShape.uuid);
        setActiveElement(elementShape);
        draw();
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

    const mouseMove = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);
        const element = getActiveElement();
        if (element) {
            element.update({
                x2: clientX,
                y2: clientY,
            });
            draw();
        }

    };
    const mouseUp = () => {
        const element = getActiveElement();
        if (element) {
            resetActiveElement();
            draw();
        }
    };

    return {
        mouseDown,
        mouseMove,
        mouseUp,
    };
}

"use client";

import React, { useCallback, useEffect, useState } from "react";
import rough from "roughjs";
import { Shape } from "../models/shape";
import { SUPPORTED_TYPE_ARR, SUPPORTED_TYPE } from "@/app/lib/definations";
import { ToolHook } from "./useTools";
import { Data } from "../models";

const SELECTED_TOOL_PADDING = 6;

export type CanvasHook = {
    selectedTool: string;
    setTool: (toolName: string) => void;
    lock: boolean;
    toggleToolLock: () => void;
};

export default function useCanvas(tools: ToolHook) {
    const { selectedTool, resetTool } = tools;

    const elements = React.useRef<Record<string, Shape>>({});
    const elementList = React.useRef<string[]>([]);
    const data = React.useRef<Data | null>(null);

    const [state, setState] = useState({
        activeElementUuid: "",
        drawing: false,
    });

    const getActiveElement = useCallback(
        () => elements.current[state.activeElementUuid],
        [state.activeElementUuid]
    );

    const getRoughCanvas = useCallback(() => {
        let rc = (globalThis as any).roughCanvas;
        if (!rc) {
            initCanvas();
            rc = (globalThis as any).roughCanvas;
        }
        return rc;
    }, []);

    const getCursorType = () => {
        return SUPPORTED_TYPE_ARR.includes(selectedTool) ? "crosshair" : "default";
    };

    useEffect(() => {
        draw();
    }, [state, selectedTool]);

    useEffect(() => {
        data.current = new Data("Demo Project");
    }, []);

    const setActiveElement = (ele?: Shape) =>
        setState(prev => ({ ...prev, activeElementUuid: ele?.uuid ?? "" }));

    const startDrawing = () =>
        setState(prev => ({ ...prev, drawing: true }));

    const stopDrawing = () =>
        setState(prev => ({ ...prev, drawing: false }));

    const initCanvas = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const rc = rough.canvas(canvas);
        (globalThis as any).roughCanvas = rc;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (elementList.current.length) draw();
    };

    const highlightElement = (
        element: Shape,
        extraOpts: Record<string, any> = {},
        padding = SELECTED_TOOL_PADDING
    ) => {
        const roughCanvas = getRoughCanvas();
        const { x1, y1, x2, y2 } = element.getAbsoluteCoords();

        const highlightBox = new Shape("rectangle", x1 - padding, y1 - padding);
        highlightBox.update(
            { x2: x2 + padding, y2: y2 + padding },
            { stroke: "blue", strokeWidth: 2, roughness: 0, bowing: 0, fill: null, ...extraOpts }
        );

        const roughShape = highlightBox.getRoughShape();
        roughCanvas.draw(roughShape);
    };

    const drawActiveElement = useCallback(() => {
        if (selectedTool !== "selection") return;

        const active = getActiveElement();
        if (!active) return;

        highlightElement(active);
    }, [getActiveElement, selectedTool]);

    const draw = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const roughCanvas = getRoughCanvas();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elementList.current.forEach(uuid => {
            const ele = elements.current[uuid];
            const roughShape = ele.getRoughShape();

            if (roughShape) roughCanvas.draw(roughShape);
            else console.warn("Unable to draw shape:", ele);
        });

        drawActiveElement();
    };

    const addElement = (type: SUPPORTED_TYPE, x: number, y: number) => {
        const element = new Shape(type, x, y);

        elements.current[element.uuid] = element;
        elementList.current.push(element.uuid);

        setActiveElement(element);
        draw();
    };

    // Convert viewport → canvas coordinates (placeholder for pan/zoom logic)
    const getViewCoords = (event: React.MouseEvent<HTMLCanvasElement>) => ({
        clientX: event.clientX,
        clientY: event.clientY
    });

    const mouseDown = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);

        if (SUPPORTED_TYPE_ARR.includes(selectedTool)) {
            startDrawing();
            addElement(selectedTool as SUPPORTED_TYPE, clientX, clientY);
        }
    };

    const mouseMove = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);

        const element = getActiveElement();
        if (element && state.drawing) {
            element.update({ x2: clientX, y2: clientY });
            draw();
        }

        ev.currentTarget.style.cursor = getCursorType();
    };

    const mouseUp = () => {
        stopDrawing();
        resetTool();
        draw();
    };

    const handleClick = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);

        if (selectedTool !== "selection") return;

        const clickedElement = elementList.current
            .map(uuid => elements.current[uuid])
            .find(ele => ele.isPointNear(clientX, clientY));

        setActiveElement(clickedElement ?? undefined);
        draw();
    };

    return {
        mouseDown,
        mouseMove,
        mouseUp,
        handleClick,
    };
}

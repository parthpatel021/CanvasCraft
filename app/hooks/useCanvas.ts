"use client";

import React, {
    useCallback,
    useEffect,
    useState
} from "react";
import rough from "roughjs";

import {
    SUPPORTED_TYPE_ARR,
    SUPPORTED_TYPE,
    ELEMENT_ACTIONS,
    POSITION_TYPES,
    offsetObj
} from "@/app/lib/definations";
import { ToolHook } from "@/app/hooks/useTools";
import { Data, Shape, ShapeType, TextShape } from "@/app/models";
import {
    resizeShape,
    moveShape,
} from "@/app/models/utils";


export type CanvasHook = {
    selectedTool: string;
    setTool: (toolName: string) => void;
    lock: boolean;
    toggleToolLock: () => void;
};

const defaultOffset: offsetObj = { x: 0, y: 0, position: null };

export default function useCanvas(tools: ToolHook) {
    const { selectedTool, resetTool } = tools;

    const elements = React.useRef<Record<string, ShapeType>>({});
    const elementList = React.useRef<string[]>([]);
    const data = React.useRef<Data | null>(null);
    const panOffset = React.useRef({ x: 0, y: 0 });
    const startPanMousePosition = React.useRef({ x: 0, y: 0 });

    const [state, setState] = useState({
        activeElementUuid: "",
        drawing: false,
        action: "none" as ELEMENT_ACTIONS,
        offset: defaultOffset,
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

    const getCursorType = (x: number, y: number) => {
        if (selectedTool === "hand" || state.action === "pan") {
            return "hand";
        }
        if (SUPPORTED_TYPE_ARR.includes(selectedTool)) {
            return "crosshair";
        }
        const activeElement = getActiveElement();
        if (activeElement) {
            return activeElement.cursorForPoint(x, y);
        }
        return "default";
    };

    useEffect(() => {
        draw();
    }, [state, selectedTool]);

    useEffect(() => {
        data.current = new Data("Demo Project");
    }, []);

    const setActiveElement = (ele?: ShapeType) =>
        setState(prev => ({ ...prev, activeElementUuid: ele?.uuid ?? "" }));

    const startDrawing = () =>
        setState(prev => ({ ...prev, drawing: true }));

    const stopDrawing = () =>
        setState(prev => ({ ...prev, drawing: false }));

    const resetOffset = () => 
        setState(prev => ({ ...prev, offset: defaultOffset }));

    const setAction = (action: ELEMENT_ACTIONS) =>
        setState(prev => ({ ...prev, action }));

    const getElementAtPosition = (x: number, y: number) => {
        const elementUuid = elementList.current.find(uuid => {
            const ele = elements.current[uuid];
            return ele.checkNearPoint(x, y) !== null
        });
        return elementUuid ? elements.current[elementUuid] : null;
    }

    const setOffSetForElementResize = (
        element: ShapeType,
        position: POSITION_TYPES,
        x: number,
        y: number,
    ) => {
        // Offset is difference between mouse coords and shape (x1, y1) coords at the position
        // By keeping the offset same during move, we can ensure the shape moves correctly
        const { x1, y1 } = element.getCoords();
        const offsetX = x1 - x;
        const offsetY = y1 - y;
        setState(prev => ({ ...prev, offset: { x: offsetX, y: offsetY, position } }));
    }

    const initCanvas = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const rc = rough.canvas(canvas);
        (globalThis as any).roughCanvas = rc;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (elementList.current.length) draw();
    };

    const drawActiveElement = useCallback(() => {
        if (selectedTool !== "selection") return;
        const roughCanvas = getRoughCanvas();

        const active = getActiveElement();
        if (!active) return;

        active.highlightActiveElement(roughCanvas);
    }, [getActiveElement, selectedTool]);

    const draw = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const roughCanvas = getRoughCanvas();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply pan offset transformation
        ctx.save();
        // console.log('Pan Offset:', panOffset.current);
        ctx.translate(panOffset.current.x, panOffset.current.y);

        elementList.current.forEach(uuid => {
            const ele = elements.current[uuid];
            ele.draw(roughCanvas);
        });

        drawActiveElement();
        ctx.restore();
    };

    const addElement = (type: SUPPORTED_TYPE, x: number, y: number) => {
        let element : ShapeType | null = null;
        if (type === "text") {
            element = new TextShape(x, y);
        } else {
            element = new Shape(type, x, y);
        }
        elements.current[element.uuid] = element;
        elementList.current.unshift(element.uuid);

        setActiveElement(element);
        draw();
    };

    // Convert viewport → canvas coordinates (placeholder for pan/zoom logic)
    const getViewCoords = (event: React.MouseEvent<HTMLCanvasElement>) => ({
        clientX: event.clientX - panOffset.current.x,
        clientY: event.clientY - panOffset.current.y,
    });

    const handleMouseDownSelectionTool = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);

        const clickedElement = getElementAtPosition(clientX, clientY);
        console.log("selected Tool:", selectedTool);
        if (selectedTool === "hand" || !clickedElement) {
            // Start panning if no element clicked
            startPanning(ev.clientX, ev.clientY);
            return;
        }
        setActiveElement(clickedElement);
        const position = clickedElement.checkNearPoint(clientX, clientY);
        if (!position) {
            return;
        }
        startDrawing();
        setOffSetForElementResize(clickedElement, position, clientX, clientY);
        if (position == "inside") {
            setAction("move");
        } else {
            setAction("resize");
        }
    }

    const startPanning = (x: number, y: number) => {
        setActiveElement();
        startPanMousePosition.current = { x, y };
        startDrawing();
        setAction("pan");
    }

    const mouseDown = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);
        if (state.action == "write") {
            return;
        }
        if (SUPPORTED_TYPE_ARR.includes(selectedTool)) {
            if (selectedTool === "text") {
                setAction("write");
            } else {
                startDrawing();
            }
            addElement(selectedTool as SUPPORTED_TYPE, clientX, clientY);
        }
        if (selectedTool === "selection") {
            handleMouseDownSelectionTool(ev);
        }
        if (selectedTool === "hand") {
            startPanning(ev.clientX, ev.clientY);
        }
    };

    const handleActiveElementMouseMove = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);
        const element = getActiveElement();

        const action = state.action;
        if (action === "pan") {
            const deltaX = clientX - startPanMousePosition.current.x;
            const deltaY = clientY - startPanMousePosition.current.y;

            panOffset.current.x += deltaX;
            panOffset.current.y += deltaY;
        }

        if (!element) return;
        if (!state.drawing) return;
        const { position } = state.offset;

        if (action === "resize" && position) {
            resizeShape(element, position, clientX, clientY);
        }
        else if (action === "move") {
            moveShape(element, state.offset, clientX, clientY);
        }
        else {
            // Drawing new shape
            element.update({ x2: clientX, y2: clientY });
        }
    }

    const mouseMove = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);

        handleActiveElementMouseMove(ev);
        draw();

        ev.currentTarget.style.cursor = getCursorType(clientX, clientY);

    };

    const mouseUp = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);

        resetOffset();
        if (state.action === "write") {
            return;
        }
        stopDrawing();
        setAction("none");
        resetTool();
        draw();
        ev.currentTarget.style.cursor = getCursorType(clientX, clientY);
    };

    const handleClick = (ev: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = getViewCoords(ev);
        if (selectedTool == "selection") {
            const clickedElement = elementList.current
                .map(uuid => elements.current[uuid])
                .find(ele => ele.isPointNear(clientX, clientY));
            setActiveElement(clickedElement ?? undefined);
        }
        draw();
    };

    const handleBlur = (ev: React.FocusEvent<HTMLTextAreaElement>) => {
        const element = getActiveElement();
        if (element && element instanceof TextShape) {
            element.updateText(ev.target.value);
            setActiveElement();
            setAction('none');
            resetTool();
            draw();
        }
    }

    return {
        state,
        getActiveElement,
        mouseDown,
        mouseMove,
        mouseUp,
        handleClick,
        handleBlur,
        draw,
    };
}

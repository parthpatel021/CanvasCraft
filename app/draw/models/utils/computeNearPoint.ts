import { RESULT_TYPES } from "@/app/lib/definations";
import { Shape } from "../shape";

const THRESHOLD = 10;

type Point = {
    x: number;
    y: number;
}

const distance = (aPoint: Point, bPoint: Point) => {
    return Math.sqrt(Math.pow(bPoint.x - aPoint.x, 2) + Math.pow(bPoint.y - aPoint.y, 2));
}

const nearPoint = (x: number, y: number, x0: number, y0: number, result: RESULT_TYPES) => {
    const aPoint = { x: x0, y: y0 };
    const bPoint = { x, y };
    return distance(aPoint, bPoint) <= THRESHOLD ? result : null;
};

const isInsideRect = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const top = Math.min(y1, y2);
    const bottom = Math.max(y1, y2);
    return x >= left && x <= right && y >= top && y <= bottom ? "inside" : null;
}

const checOnLine = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    const aPoint = { x: x1, y: y1 };
    const bPoint = { x: x2, y: y2 };
    const cPoint = { x, y };
    const resDistance = distance(aPoint, bPoint) - (distance(aPoint, cPoint) + distance(bPoint, cPoint));
    return Math.abs(resDistance) <= THRESHOLD ? "inside" : null;
}

export const checkLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number
) => {
    return (
        nearPoint(x, y, x1, y1, "start") ||
        nearPoint(x, y, x2, y2, "end") ||
        checOnLine(x, y, x1, y1, x2, y2) ||
        null
    );
}

export const checkRect = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number
) => {
    return (
        nearPoint(x, y, x1, y1, "tl") ||
        nearPoint(x, y, x2, y1, "tr") ||
        nearPoint(x, y, x1, y2, "bl") ||
        nearPoint(x, y, x2, y2, "br") ||
        isInsideRect(x, y, x1, y1, x2, y2) ||
        null
    );
}

const elementCheckers: Record<string, Function> = {
    rectangle: checkRect,
    ellipse: checkRect,
    text: checkRect,
    line: checkLine,
    arrow: checkLine,
};

export const checkShapeNearPoint = (element: Shape, x: number, y: number) => {
    const { x1, y1, x2, y2 } = element.getAbsoluteCoords();
    const checker = elementCheckers[element.type];
    if (checker) {
        return checker(x1, y1, x2, y2, x, y);
    }
    return false;
};

export const cursorForPosition = {
    start: "nwse-resize",
    end: "nwse-resize",
    tl: "nwse-resize",
    br: "nwse-resize",

    tr: "nesw-resize",
    bl: "nesw-resize",

    inside: "move",
};

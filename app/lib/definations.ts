import { ComponentType, SVGProps } from "react";

export type ToolButton = {
    name: string;
    slug: string;
    cursor: string;
    type: "primary" | "secondary";
    filledIcon?: ComponentType<SVGProps<SVGSVGElement>> | null;
    icon?: ComponentType<SVGProps<SVGSVGElement>> | null;
    numShortcut?: number;
};

export type ShapeCoords = Partial<Record<'x1'|'y1'|'x2'|'y2', number>>;

export type SUPPORTED_TYPE = "rectangle" | "ellipse" | "line" | "arrow" | "text";
export const SUPPORTED_TYPE_ARR = ["rectangle", "ellipse", "line", "arrow", "text"]

export type POSITION_TYPES = "inside" | "start" | "end" | "tl" | "tr" | "bl" | "br" ;
export const POSITION_TYPES_ARR: POSITION_TYPES[] = ["inside", "start", "end", "tl", "tr", "bl", "br"];

export type ELEMENT_ACTIONS = "move" | "resize" | "none";
export const ELEMENT_ACTIONS_ARR: ELEMENT_ACTIONS[] = ["move", "resize", "none"];

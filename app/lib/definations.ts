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

export type ELEMENT_ACTIONS = "move" | "resize" | "write" | "none";
export const ELEMENT_ACTIONS_ARR: ELEMENT_ACTIONS[] = ["move", "resize", "write", "none"];

export type offsetObj = { x: number; y: number; position: POSITION_TYPES | null };

export type FONT_FAMILIES_TYPE = "Arial";
export const FONT_FAMILIES_ARR = ["Arial"];

export type SHAPE_ACTION_OPTION_TYPES = "strokeColor" | "fillColor" | "fillType" | "strokeWidth" | "strokeStyle" | "slopiness";
export type ShapeOption = {
    title: string;
    values: any[];
    key: SHAPE_ACTION_OPTION_TYPES;
}

export interface ShapeOptions {
    stroke: string;
    strokeWidth: number;
    bowing: number;
    roughness: number;
    fill: string;
    fillStyle: string;
    strokeStyle: string;
}

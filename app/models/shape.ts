import { checkShapeNearPoint, cursorForPosition } from './utils/computeNearPoint';
import { POSITION_TYPES, ShapeCoords, ShapeOptions, SUPPORTED_TYPE } from "@/app/lib/definations";
import { v4 } from "uuid";
import { generateRoughShapes } from './utils';

const SELECTED_TOOL_PADDING = 6;

let default_opts: ShapeOptions = {
    stroke: '#eee',
    strokeWidth: 2,
    bowing: 0,
    roughness: 0,
    fill: 'transparent',
    fillStyle: 'solid',
    strokeStyle: 'solid',
}

export class Shape {
    type: SUPPORTED_TYPE;
    x1: number; y1: number;
    x2: number; y2: number;
    opts: Record<string, any>;
    uuid: string;

    roughObj: any = []; // rough objects

    constructor(type: SUPPORTED_TYPE, x1: number, y1: number) {
        this.uuid = v4()
        this.type = type;
        this.x1 = x1; this.y1 = y1;
        this.roughObj = [];
        this.opts = { ...default_opts };

        this.x2 = x1; this.y2 = y1;
    }

    _updateCoords(coords: ShapeCoords = {}) {
        if (coords.x1 !== undefined) {
            this.x1 = coords.x1;
        }
        if (coords.y1 !== undefined) {
            this.y1 = coords.y1;
        }
        if (coords.x2 !== undefined) {
            this.x2 = coords.x2;
        }
        if (coords.y2 !== undefined) {
            this.y2 = coords.y2;
        }

    }

    _updateOpts(opts: Partial<Record<string, any>> = {}) {
        this.opts = { ...this.opts, ...opts };
        default_opts = { ...this.opts } as ShapeOptions;
    }

    update(coords: ShapeCoords = {}, opts: Partial<Record<string, any>> = {}) {
        if (Object.keys(coords).length) {
            this._updateCoords(coords);
        }
        if (Object.keys(opts).length) {
            this._updateOpts(opts);
        }
        const updatedShape = this.generateRoughObjs();
        this.roughObj = updatedShape;
    }

    getRoughShapes() {
        if (!this.roughObj.length) {
            this.roughObj = this.generateRoughObjs();
        }
        return this.roughObj;
    }

    generateRoughObjs(): any[] {
        const rc = (globalThis as any).roughCanvas;
        const generator = rc.generator;
        return generateRoughShapes(this, generator);
    }

    draw(roughCanvas: any) {
        const roughShapes = this.getRoughShapes();
        if (!roughShapes.length) {
            console.warn("Unable to draw shape:", this);
            return;
        }
        roughShapes.forEach((shape: any) => roughCanvas.draw(shape));
    }

    highlightActiveElement(roughCanvas: any) {
        const { x1, y1, x2, y2 } = this.getAbsoluteCoords();

        const highlightBox = new Shape("rectangle", x1 - SELECTED_TOOL_PADDING, y1 - SELECTED_TOOL_PADDING);
        highlightBox.opts = { 
            ...highlightBox.opts, 
            stroke: "blue",
            strokeWidth: 2,
            roughness: 0,
            bowing: 0,
            fill: 'transparent',
            fillStyle: 'solid',
            strokeStyle: 'solid',
        }
        highlightBox.update(
            { x2: x2 + SELECTED_TOOL_PADDING, y2: y2 + SELECTED_TOOL_PADDING }
        );
        highlightBox.draw(roughCanvas);
    }

    getCoords() {
        return { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
    }

    getAbsoluteCoords() {
        const x1 = Math.min(this.x1, this.x2);
        const y1 = Math.min(this.y1, this.y2);
        const x2 = Math.max(this.x1, this.x2);
        const y2 = Math.max(this.y1, this.y2);
        return { x1, y1, x2, y2 };
    }

    isPointNear(x: number, y: number, padding = 10): boolean {
        const { x1, y1, x2, y2 } = this.getAbsoluteCoords();
        if (x >= x1 - padding && x <= x2 + padding && y >= y1 - padding && y <= y2 + padding) {
            return true;
        }
        return false;
    }

    checkNearPoint(x: number, y: number): POSITION_TYPES | null {
        return checkShapeNearPoint(this, x, y);
    }

    cursorForPoint(x: number, y: number): string {
        const nearPoint = this.checkNearPoint(x, y);
        return nearPoint ? cursorForPosition[nearPoint] : "default";
    }
}

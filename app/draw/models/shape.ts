import { SUPPORTED_TYPE } from "@/app/lib/definations";
import { v4 } from "uuid";

export class Shape {
    type: SUPPORTED_TYPE;
    x1: number; y1: number;
    x2: number; y2: number;
    opts: Record<string, any>;
    uuid: string;

    roughObj: any = null; // rough object

    constructor(type: SUPPORTED_TYPE, x1: number, y1: number) {
        this.uuid = v4()
        this.type = type;
        this.x1 = x1; this.y1 = y1;
        this.roughObj = null;
        this.opts = { stroke: 'white', strokeWidth: 2, bowing: 0, roughness: 0, fill: 'gray' };

        this.x2 = x1; this.y2 = y1;
    }

    _updateCoords(coords: Partial<Record<'x1'|'y1'|'x2'|'y2', number>> = {}) {
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
        this.opts = {...this.opts, ...opts};
    }

    update(coords: Partial<Record<'x1'|'y1'|'x2'|'y2', number>> = {}, opts: Partial<Record<string, any>> = {}) {
        if (Object.keys(coords).length) {
            this._updateCoords(coords);
        }
        if (Object.keys(opts).length) {
            this._updateOpts(opts);
        }
        // this.getRoughShape();
        const updatedShape = this.generateRoughObj();
        this.roughObj = updatedShape;
    }

    getRoughShape() {
        if (!this.roughObj) {
            this.roughObj = this.generateRoughObj();
        }
        return this.roughObj;
    }

    generateRoughObj(): any {
        const rc = (globalThis as any).roughCanvas;
        const generator = rc.generator;
        if (this.type === "rectangle") {
            return generator.rectangle(this.x1, this.y1, this.x2-this.x1, this.y2-this.y1, this.opts);
        }
        if (this.type === "ellipse") {
            const centerX = (this.x1 + this.x2) / 2;
            const centerY = (this.y1 + this.y2) / 2;
            const widthX = this.x2 - this.x1;
            const widthY = this.y2 - this.y1;
            return generator.ellipse(centerX, centerY, widthX, widthY, this.opts);
        }
        if (this.type === "line" || this.type === "arrow") {
            return generator.line(this.x1, this.y1, this.x2, this.y2, this.opts);
        }
        return null;
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
}

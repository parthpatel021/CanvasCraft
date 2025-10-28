import { SUPPOTED_TYPE } from "@/app/lib/definations";
import { RoughGenerator } from "roughjs/bin/generator";

export class Shape {
    type: SUPPOTED_TYPE;
    x1: number; y1: number;
    x2: number; y2: number;
    opts: object;

    roughObj: object | null; // rough object

    constructor(type: SUPPOTED_TYPE, x1: number, y1: number) {
        this.type = type;
        this.x1 = x1; this.y1 = y1;
        this.roughObj = null;
        this.opts = { stroke: 'white', strokeWidth: 2, bowing: 2, roughness: 2.8, fill: 'blue' };

        this.x2 = 200; this.y2 = 200;
    }

    updateEndPoint(x2: number, y2: number) {
        this.x2 = x2;
        this.y2 = y2;
    }

    getRoughShape(generator: RoughGenerator) {
        if (!this.roughObj) {
            this.roughObj = this.generateRoughObj(generator);
        }
        return this.roughObj;
    }

    generateRoughObj(generator: RoughGenerator) {
        if (this.type === "rectangle") {
            return generator.rectangle(this.x1, this.y1, this.x2, this.y2, this.opts);
        }
        if (this.type === "ellipse") {
            return generator.ellipse(this.x1, this.y1, this.x2, this.y2, this.opts);
        }
        if (this.type === "line") {
            return generator.line(this.x1, this.y1, this.x2, this.y2, this.opts);
        }
        return null;
    }
}

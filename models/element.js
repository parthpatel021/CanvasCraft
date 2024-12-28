import { getPathData } from "@/utils/perfectFreehandFunctions";
import { availableElementTypes, roughShapeGenerator } from "@/utils/roughGenerator";

export class Element {
    constructor(vals) {
        this.id = vals.id;
        this.type = vals.type;
        this.x1 = vals.x1;
        this.y1 = vals.y1;
        this.x2 = vals.x2 || null;
        this.y2 = vals.y2 || null;
        this.strokeWidth = vals.strokeWidth || 2;
        this.strokeColor = vals.strokeColor || "#e1e1e1";
        this.roughness = vals.roughness || 1;

        if (this.type === "draw") {
            this.points = [{ x: this.x1, y: this.y1 }];
        } else if (this.type === "text") {
            this.text = "";
        }

        if (!availableElementTypes.includes(this.type)) {
            console.error("ERROR: Element Type is not available:", this.type);
        }
    }

    get elementType() {
        return this.type;
    }

    get elementsPoints() {
        if (this.elementType === "draw") {
            return { points: this.points };
        }

        const coord = { x1: this.x1, y1: this.y1 };
        if (this.elementType !== "text") {
            coord.x2 = this.x2;
            coord.y2 = this.y2;
        }
        return coord;
    }

    get styleOptions() {
        return {
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth,
            roughness: this.roughness,
        };
    }

    updateElementCoordinates({ x2, y2 }) {
        this.x2 = x2;
        this.y2 = y2;

        if (this.elementType === "draw") {
            this.points.push({ x: x2, y: y2 });
        }
    }

    coordinates() {
        const { x1, y1, x2, y2, points } = this.elementsPoints;
        switch (this.elementType) {
            case "rectangle":
                return [x1, y1, x2 - x1, y2 - y1];
            case "ellipse":
                return [(x1 + x2) / 2, (y1 + y2) / 2, x2 - x1, y2 - y1];
            case "line":
            case "arrow":
                return [x1, y1, x2, y2];
            case "draw":
                return points;
            default:
                return [x1, y1, x2 - x1, y2 - y1];
        }
    }

    generateRoughElement() {
        const roughElements = roughShapeGenerator[this.elementType](this.coordinates());
        roughElements.forEach(roughElement => {
            Object.assign(roughElement.options, this.styleOptions);
        });
        this.roughElements = roughElements;
    }

    drawElement(roughCanvas) {
        if (this.elementType === "draw") {
            const ctx = roughCanvas.ctx;
            const pathData = getPathData(this.coordinates(), { size: 12 });
            ctx.fillStyle = this.styleOptions.stroke;
            ctx.fill(new Path2D(pathData));
            return;
        }

        this.generateRoughElement();
        this.roughElements.forEach(roughElement => roughCanvas.draw(roughElement));
    }
}

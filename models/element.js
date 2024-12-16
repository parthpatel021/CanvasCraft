import {availableElementTypes, roughShapeGenerator} from "@/utils/roughGenerator"

export class Element {
    /**
     * @param {Object} vals
     */
    constructor(vals) {
        this.id = vals.id;
        this.type = vals.type;
        // Points
        this.x1 = vals.x1;
        this.y1 = vals.y1;
        this.x2 = vals.x2 || null;
        this.y2 = vals.y2 || null;
        // Styles
        this.strokeWidth = vals.strokeWidth || 2;
        this.strokeColor = vals.strokeColor || "#e1e1e1";
        this.roughness = vals.roughness || 1;


        if (this.type === "draw") {
            this.points = [{x: this.x1, y: this.y1}];
        } else if (this.type === "text") {
            this.text = "";
        }

        // Validation Checks
        if (!availableElementTypes.includes(this.type)) {
            console.log("ERROR: Element Type is not available :", this.type);
        }
    }

    get elementType() {
        return this.type;
    }

    get elementsPoints() {
        if (this.elementType === "draw") {
            return { points: this.points };
        } 

        const coord = {};
        if (this.elementType !== "text") {
            coord.x2 = this.x2;
            coord.y2 = this.y2; 
        }
        coord.x1 = this.x1;
        coord.y1 = this.y1; 
        return coord;
    }

    get styleOptions() {
        return {
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth,
            roughness: this.roughness,
        };
    }

    coordinates() {
        switch (this.elementType) {
            case "rectangle": {
                const {x1, y1, x2, y2} = this.elementsPoints;
                return [x1, y1, x2-x1, y2-y1];
            }
            case "ellipse": {
                const {x1, y1, x2, y2} = this.elementsPoints;
                const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;
                return [centerX, centerY, x2 - x1, y2 - y1];
            }
            case "line":
            case "arrow": {
                const {x1, y1, x2, y2} = this.elementsPoints;
                return [x1, y1, x2, y2];
            }

            default:
                const {x1, y1, x2, y2} = this.elementsPoints;
                return [x1, y1, x2-x1, y2-y1];

        }
    }

    /**
     * Will draw current element to rough canvas context 'roughCanvas'
     * @param {Object} roughCanvas
     */

    generatRoughElement() {
        let roughElements = roughShapeGenerator[this.elementType](this.coordinates());
        roughElements.forEach(roughElement => {
            Object.assign(roughElement.options, this.styleOptions);
        });
        this.roughElements = roughElements;
    }
    drawElement(roughCanvas) {
        if(!this.roughElement) {
            this.generatRoughElement();
        }
        this.roughElements.forEach(roughElement => roughCanvas.draw(roughElement))
    }
}

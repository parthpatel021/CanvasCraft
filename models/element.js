const availableElementTypes = ["rectangle", "ellipse", "line", "arrow", "draw", "text"];

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

    get coordinates() {
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

    /**
     * Will draw current element to canvas context 'ctx'
     * @param {Object} ctx 
     */
    drawElement(ctx) {
        const coord = this.coordinates;
        const {x1, y1, x2, y2} = coord;

        ctx.rect(x1, y1, x2, y2);
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}

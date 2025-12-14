import { FONT_FAMILIES_TYPE } from './../lib/definations';
import { Shape } from "./shape";

export class TextShape extends Shape {
    text: string;
    fontSize: number;
    fontFamily: FONT_FAMILIES_TYPE;

    constructor(
        x1: number,
        y1: number,
        text: string = "",
        fontSize = 24,
        fontFamily: FONT_FAMILIES_TYPE = "Arial"
    ) {
        super("text", x1, y1);
        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
    }

    updateText(newText: string) {
        this.text = newText;

        // Update dimensions based on text content
        this.y2 = this.y1 + this.fontSize;
        this.x2 = this.x1 + this.text.length * (this.fontSize / 2); // Approximate width
    }

    generateRoughObjs(): any[] {
        // TextShape does not use rough.js for rendering
        return [];
    }

    draw(roughCanvas: any) {
        const ctx = roughCanvas.ctx;
        ctx.save();
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        // ctx.font = "bold 14px verdana, sans-serif";
        // ctx.fillStyle = "#00ff00";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x1, this.y1 + this.fontSize);
    }
}

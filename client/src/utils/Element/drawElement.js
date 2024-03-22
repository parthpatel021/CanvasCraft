import { getPathData } from './../perfectFreehandFunctions';
import rough from 'roughjs/bundled/rough.esm';
const generator = rough.generator();

const drawRectangle = (roughCanvas, element) => {
    const { x1, y1, x2, y2 } = element;
    const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    roughElement.options.stroke = element.strokeColor;
    roughElement.options.strokeWidth = element.strokeWidth;

    roughCanvas.draw(roughElement);
}

const drawEllipse = (roughCanvas, element) => {
    const { x1, y1, x2, y2 } = element;

    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const roughElement = generator.ellipse(centerX, centerY, x2 - x1, y2 - y1);
    roughElement.options.stroke = element.strokeColor;
    roughElement.options.strokeWidth = element.strokeWidth;
    roughElement.options.roughness = element.roughness;

    roughCanvas.draw(roughElement);
}

const drawLine = (roughCanvas, element) => {
    const { x1, y1, x2, y2 } = element;
    const roughElement = generator.line(x1, y1, x2, y2);
    roughElement.options.stroke = element.strokeColor;
    roughElement.options.strokeWidth = element.strokeWidth;

    roughCanvas.draw(roughElement);
}

const getDrawing = (ctx, element) => {
    const pathData = getPathData(element.points, {
        // options
        size: 12,
    });
    ctx.fillStyle = '#eee';
    ctx.fill(new Path2D(pathData));
}

const addText = (ctx, element) => {
    ctx.textBaseline = 'top';
    ctx.font = "24px serif";
    ctx.fillStyle = '#eee';
    ctx.fillText(element.text, element.x1, element.y1);
}

const drawElement = (roughCanvas, ctx, element) => {
    switch (element.type) {
        case 'rectangle':
            drawRectangle(roughCanvas, element);
            break;

        case 'ellipse':
            drawEllipse(roughCanvas, element);
            break;

        case 'line':
            drawLine(roughCanvas, element);
            break;

        case 'draw':
            getDrawing(ctx, element);
            break;

        case 'text':
            addText(ctx, element);
            break;

        default:
            throw new Error(`Type not Recognised: ${element.type}`);
    }
}

export default drawElement;
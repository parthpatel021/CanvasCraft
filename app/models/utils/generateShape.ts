import { Shape } from "../shape";

const getShapeOptions = (element: Shape) => {
    const opts = {...element.opts};
    if (element.opts.strokeStyle && element.opts.strokeStyle !== 'solid') {
        opts['strokeLineDash'] = element.opts.strokeStyle === 'dashed' ? [10, 5] : [2, 6];
    }
    return opts;
}

const rectangleGenerator = (element: Shape, generator: any) => {
    const { x1, y1, x2, y2 } = element.getCoords();
    const width = x2! - x1!;
    const height = y2! - y1!;
    return [
        generator.rectangle(x1!, y1!, width, height, getShapeOptions(element))
    ];
}

const ellipseGenerator = (element: Shape, generator: any) => {
    const { x1, y1, x2, y2 } = element.getCoords();
    const centerX = (x1! + x2!) / 2;
    const centerY = (y1! + y2!) / 2;
    const width = x2! - x1!;
    const height = y2! - y1!;
    return [
        generator.ellipse(centerX, centerY, width, height, getShapeOptions(element))
    ];
}

const lineGenerator = (element: Shape, generator: any) => {
    const { x1, y1, x2, y2 } = element.getCoords();
    return [
        generator.line(x1!, y1!, x2!, y2!, getShapeOptions(element))
    ];
}

const arrowGenerator = (element: Shape, generator: any) => {
    const { x1, y1, x2, y2 } = element.getCoords();

    const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const headlen = Math.min(20, lineLength/4);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    // points for the arrowhead
    const point1X = x2 - headlen * Math.cos(angle - Math.PI / 6);
    const point1Y = y2 - headlen * Math.sin(angle - Math.PI / 6);
    const point2X = x2 - headlen * Math.cos(angle + Math.PI / 6);
    const point2Y = y2 - headlen * Math.sin(angle + Math.PI / 6);

    // Define the path command string for Rough.js (SVG path format)
    const pathData = `M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${point1X} ${point1Y} M ${x2} ${y2} L ${point2X} ${point2Y}`;
    return [generator.path(pathData, getShapeOptions(element))];
}

const generators: Record<string, Function> = {
    rectangle: rectangleGenerator,
    ellipse: ellipseGenerator,
    line: lineGenerator,
    arrow: arrowGenerator,
};

export const generateRoughShapes = (element: Shape, generator: any) => {
    const type = element.type;

    const shapeGenerator = generators[type];
    if (shapeGenerator) {
        return shapeGenerator(element, generator);
    }
    return [];
}

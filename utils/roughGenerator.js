import rough from 'roughjs/bundled/rough.esm';
const generator = rough.generator();

function drawArrow(x1, y1, x2, y2) {
    const mainLine = generator.line(x1, y1, x2, y2);

    let dx = x2 - x1;
    let dy = y2 - y1;
    let angle = Math.atan2(dy, dx);
    let lineLength = Math.sqrt(dx*dx + dy*dy)
    let headlen = lineLength > 60 ? 20: lineLength/3;

    const arrowLine1 = generator.line(
        x2 - headlen * Math.cos(angle - Math.PI / 6),
        y2 - headlen * Math.sin(angle - Math.PI / 6),
        x2, y2);
    const arrowLine2 = generator.line(
        x2 - headlen * Math.cos(angle + Math.PI / 6),
        y2 - headlen * Math.sin(angle + Math.PI / 6),
        x2, y2);

    return [mainLine, arrowLine1, arrowLine2];
}

export const roughShapeGenerator = {
    "rectangle": (params) => [generator.rectangle(...params)],
    "ellipse": (params) => [generator.ellipse(...params)],
    "line": (params) => [generator.line(...params)],
    "arrow": (params) => drawArrow(...params),
    "draw": (params) => [generator.line(...params)],
    "text": (params) => [generator.line(...params)],
}

export const availableElementTypes = ["rectangle", "ellipse", "line", "arrow", "draw", "text"];

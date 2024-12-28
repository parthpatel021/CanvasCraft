import { getStroke } from 'perfect-freehand';

const average = (a, b) => (a + b) / 2;

function _getSvgPathFromStroke(points, closed = true) {
    if (points.length < 4) return ``;

    const [a, b, c] = points;
    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

    for (let i = 2; i < points.length - 1; i++) {
        const [a, b] = [points[i], points[i + 1]];
        result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
    }

    return closed ? result + 'Z' : result;
}

export function getPathData(points, options) {
    const outlinePoints = getStroke(points, { ...options });
    return _getSvgPathFromStroke(outlinePoints);
}
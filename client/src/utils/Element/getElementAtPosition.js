const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}


const onLine = (x1, y1, x2, y2, x, y, offsetLimit = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: x, y: y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));

    return Math.abs(offset) < offsetLimit ? 'inside' : null
}
const isWithinElement = (x, y, element) => {
    const { type, x1, y1, x2, y2 } = element;
    switch (type) {
        case 'rectangle': {
            const topLeft = nearPoint(x, y, x1, y1, 'tl');
            const topRight = nearPoint(x, y, x2, y1, 'tr');
            const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
            const bottomRight = nearPoint(x, y, x2, y2, 'br');
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;

            return topLeft || topRight || bottomLeft || bottomRight || inside;
        }

        case 'ellipse': {
            const topLeft = nearPoint(x, y, x1, y1, 'tl');
            const topRight = nearPoint(x, y, x2, y1, 'tr');
            const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
            const bottomRight = nearPoint(x, y, x2, y2, 'br');
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;

            return topLeft || topRight || bottomLeft || bottomRight || inside;
        }
        case 'line': 
        case 'arrow': 
        {
            const on = onLine(x1, y1, x2, y2, x, y);

            const start = nearPoint(x, y, x1, y1, 'start');
            const end = nearPoint(x, y, x2, y2, 'end');
            return start || end || on;
        }
        case 'draw': {
            const betweenAnyPoint = element.points.some((point, index) => {
                const nextPoint = element.points[index + 1];
                if (!nextPoint) return false;

                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 10) != null;
            });
            return betweenAnyPoint ? 'inside' : null;
        }
        case 'text': {

            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
        }

        default:
            throw new Error(`Type not Recognised: ${type}`);
    }
}


const getElementAtPosition = (x, y, elements) => {
    return elements
        ?.map(element => ({ ...element, position: isWithinElement(x, y, element) }))
        ?.find(element => element.position !== null);
}

export default getElementAtPosition;
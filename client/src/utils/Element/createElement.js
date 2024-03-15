import rough from 'roughjs/bundled/rough.esm';
const generator = rough.generator();

const createRectangle = (x1, y1, x2, y2) => {
    const roughElement = generator.rectangle(x1, y1, x2-x1, y2-y1);
    roughElement.options.stroke = '#eee';
    roughElement.options.strokeWidth = 2;
    return roughElement;
}

const createLine = (x1, y1, x2, y2) => {
    const roughElement = generator.line(x1, y1, x2, y2);
    roughElement.options.stroke = '#eee';
    roughElement.options.strokeWidth = 2;
    return roughElement;
}

const createElement = (id, x1, y1, x2, y2, type) => {
    let roughElement;
    switch (type) {
        case "rectangle":
            roughElement = createRectangle(x1, y1, x2, y2);
            return {id, x1, y1, x2, y2, roughElement, type};
        
        case "line":
            roughElement = createLine(x1, y1, x2, y2);
            return {id, x1, y1, x2, y2, roughElement, type};

        case "draw":
            return {id, type, points:[{x: x1, y: y1}]};

        default:
            throw new Error(`Type not recognised: ${type}`);
    }
    

}

export default createElement; 
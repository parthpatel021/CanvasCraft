const createRectangle = (id, x1, y1, x2, y2) => {
    return {
        type: 'rectangle',
        id, x1, y1, x2, y2,
        strokeWidth: 2,
        strokeColor: '#e1e1e1', 
    };
}

const createEllipse = (id, x1, y1, x2, y2) => {
    return {
        type: 'ellipse',
        id, x1, y1, x2, y2,
        strokeWidth: 2,
        roughness: 0.01,
        strokeColor: '#e1e1e1', 
    };
}

const createLine = (id, x1, y1, x2, y2) => {
    return {
        type: 'line',
        id, x1, y1, x2, y2,
        strokeWidth: 2,
        strokeColor: '#e1e1e1', 
    };
}

const createArrow = (id, x1, y1, x2, y2) => {
    return {
        type: 'arrow',
        id, x1, y1, x2, y2,
        strokeWidth: 2,
        strokeColor: '#e1e1e1', 
    };
}

const createDrawing = (id, x1, y1) => {
    return {
        type: 'draw', 
        id, 
        points:[{x: x1, y: y1}]
    };
}

const createTextElement = (id, x1, y1, x2, y2) => {
    return {
        type: 'text',
        id, x1, y1, x2, y2, 
        text:""
    };
}

const createElement = (id, x1, y1, x2, y2, type) => {
    switch (type) {
        case "rectangle":
            return createRectangle(id, x1, y1, x2, y2);

        case "ellipse":
            return createEllipse(id, x1, y1, x2, y2);
        
        case "line":
            return createLine(id, x1, y1, x2, y2);

        case "arrow":
            return createArrow(id, x1, y1, x2, y2);

        case "draw":
            return createDrawing(id, x1, y1);

        case 'text':
            return createTextElement(id, x1, y1, x2, y2);

        default:
            throw new Error(`Type not recognised: ${type}`);
    }
    

}

export default createElement; 
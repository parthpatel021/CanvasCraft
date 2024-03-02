import { generateElementId } from "../idGenerator"

const createRectangle = (mouse, id) => {
    return {
        id: id,
        type: 'rectangle',
        strokeWidth: 2,
        x: mouse.x,
        y: mouse.y,
        strokeColor: '#e1e1e1',
        width: 1,
        height: 1,
    }
}

const createEllipse = (mouse, id) => {
    return {
        id: id,
        type: 'ellipse',
        strokeWidth: 2,
        x: mouse.x,
        y: mouse.y,
        strokeColor: '#e1e1e1',
        width: 1,
        height: 1,
    }
}

const createArrow = (mouse, id) => {
    return {
        id: id,
        type: 'arrow',
        strokeWidth: 2,
        strokeColor: '#e1e1e1',
        points: [
            {
                x: mouse.x,
                y: mouse.y,
            },
            {
                x: mouse.x,
                y: mouse.y,
            },
        ]
    }
}

const createLine = (mouse, id) => {
    return {
        id: id,
        type: 'line',
        strokeWidth: 2,
        strokeColor: '#e1e1e1',
        points: [
            {
                x: mouse.x,
                y: mouse.y,
            },
            {
                x: mouse.x,
                y: mouse.y,
            },
        ]
    }
}

const createElement = (mouse, selectedTool) => {
    const id = generateElementId();
    switch (selectedTool) {
        case "rectangle":
            return createRectangle(mouse, id);
            
        case "ellipse":
            return createEllipse(mouse, id);

        case "arrow":
            return createArrow(mouse, id);
        
        case "line":
            return createLine(mouse, id);
    
        default:
            console.log('corresponding selectedTool element creation function is not written');
    }
}

export default createElement;
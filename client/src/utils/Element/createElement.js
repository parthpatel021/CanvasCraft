const createRectangle = (mouse) => {
    return {
        type: 'rectangle',
        strokeWidth: 2,
        x: mouse.x,
        y: mouse.y,
        strokeColor: '#e1e1e1',
        width: 1,
        height: 1,
    }
}

const createEllipse = (mouse) => {
    return {
        type: 'ellipse',
        strokeWidth: 2,
        x: mouse.x,
        y: mouse.y,
        strokeColor: '#e1e1e1',
        width: 1,
        height: 1,
    }
}

const createArrow = (mouse) => {
    return{
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

const createLine = (mouse) => {
    return{
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
    switch (selectedTool) {
        case "rectangle":
            return createRectangle(mouse);
            
        case "ellipse":
            return createEllipse(mouse);

        case "arrow":
            return createArrow(mouse);
        
        case "line":
            return createLine(mouse);
    
        default:
            console.log('corresponding selectedTool element creation function is not written');
    }
}

export default createElement;
const updateRectangle = (element, mouse) => {
    
    const x = element.x;
    const y = element.y;

    const updatedElement = {
        ...element,
        width: mouse.x - x,
        height: mouse.y - y
    }

    return updatedElement;
}

const updateLine = (element, mouse) => {
    

    const updatedElement = {
        ...element,
        points: [
            element.points[0],
            {
                x: mouse.x,
                y: mouse.y,
            }
        ]
    }

    return updatedElement;
}

const updateOneElement = (element, mouse) => {
    if (element.type === 'rectangle' || element.type === 'ellipse') 
        return updateRectangle(element, mouse);
    if (element.type === 'arrow' || element.type === 'line') 
        return updateLine(element, mouse);
}

export default updateOneElement;
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

const createNewElement = (id, x1, y1, x2, y2, selectedTool) => {
    let roughElement;
    switch (selectedTool) {
        case "rectangle":
            roughElement = createRectangle(x1, y1, x2, y2);
        break;
        
        case "line":
            roughElement = createLine(x1, y1, x2, y2);
        break;

        default:
            console.log('corresponding selectedTool element creation function is not written');
    }
    

    return {id, x1, y1, x2, y2, roughElement, type:selectedTool};
}

export default createNewElement; 
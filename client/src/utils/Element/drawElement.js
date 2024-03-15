import { getPathData } from './../perfectFreehandFunctions';

const drawElement = (roughCanvas, ctx, element) => {
    switch (element.type) {
        case 'rectangle':
        case 'line':
            roughCanvas.draw(element.roughElement);
            break;

        case 'draw':
            const pathData = getPathData(element.points, {
                // options
                size: 12,
            });
            ctx.fillStyle = '#eee';
            ctx.fill(new Path2D(pathData));

            break;

        default:
            throw new Error(`Type not Recognised: ${element.type}`);
    }
}

export default drawElement;
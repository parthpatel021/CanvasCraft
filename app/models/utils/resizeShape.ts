import { POSITION_TYPES, ShapeCoords } from '@/app/lib/definations';
import { Shape } from './../shape';


const hasRectangleCoords = (ele: Shape) => ["rectangle", "ellipse", "text"].includes(ele.type);
const hasLineCoords = (ele: Shape) => ["line", "arrow"].includes(ele.type);

const resizeRectangle = (currentCords: ShapeCoords, position: POSITION_TYPES, newX: number, newY: number) => {
    const coordsUpdate: ShapeCoords = currentCords;

    if (position === "tl") {
        coordsUpdate.x1 = newX;
        coordsUpdate.y1 = newY;
    } else if (position === "tr") {
        coordsUpdate.x2 = newX;
        coordsUpdate.y1 = newY;
    } else if (position === "bl") {
        coordsUpdate.x1 = newX;
        coordsUpdate.y2 = newY;
    } else if (position === "br") {
        coordsUpdate.x2 = newX;
        coordsUpdate.y2 = newY;
    }
    return coordsUpdate;
}
const resizeLine = (currentCords: ShapeCoords, position: POSITION_TYPES, newX: number, newY: number) => {
    const coordsUpdate: ShapeCoords = currentCords;

    if (position === "start") {
        coordsUpdate.x1 = newX;
        coordsUpdate.y1 = newY;
    } else if (position === "end") {
        coordsUpdate.x2 = newX;
        coordsUpdate.y2 = newY;
    }
    return coordsUpdate;
}

export const resizeShape = (element: Shape, position: POSITION_TYPES, newX: number, newY: number) => {

    let updatedCoords: ShapeCoords = {};
    const currentCords = element.getCoords();

    if (hasRectangleCoords(element)) {
        updatedCoords = resizeRectangle(currentCords, position, newX, newY);
    }
    else if (hasLineCoords(element)) {
        updatedCoords = resizeLine(currentCords, position, newX, newY);
    }

    element.update(updatedCoords);
}

import { offsetObj } from "@/app/lib/definations";
import { Shape } from "../shape";

export const moveShape = (
    element: Shape,
    offset: offsetObj,
    newX: number,
    newY: number
) => {
    const { x: offsetX, y: offsetY } = offset;
    const { x1, y1, x2, y2 } = element.getCoords();

    const newX1 = newX + offsetX;
    const newY1 = newY + offsetY;
    const width = x2! - x1!;
    const height = y2! - y1!;
    element.update({
        x1: newX1,
        y1: newY1,
        x2: newX1 + width,
        y2: newY1 + height
    });
}

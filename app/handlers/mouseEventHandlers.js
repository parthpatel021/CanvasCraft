import { Element } from "@/models/element"

const getMouseCoordinates = event => {
    const clientX = event.clientX;
    const clientY = event.clientY;

    return { clientX, clientY };
}

export function mouseDown(ev, addElements, selectedTool) {
    if (selectedTool === "hand" || selectedTool === "selection") {
        return;
    }
    const {clientX, clientY} = getMouseCoordinates(ev);
    const values = {}

    const coord = {
        x1: clientX,
        y1: clientY,
        x2: 100 + clientX,
        y2: 100 + clientY,
    }
    values.id = 1;
    values.type = selectedTool;
    const styleOptions = {}
    Object.assign(values, {
        ...coord,
        ...styleOptions,
    });

    const ele = new Element(values);
    addElements([ele]);
}

export function mouseMove(ev) {

}

export function mouseUp(ev) {

}

import { Element } from "@/models/element"

const getMouseCoordinates = event => {
    const clientX = event.clientX;
    const clientY = event.clientY;

    return { clientX, clientY };
}

export function mouseDown(ev, addElements, selectedTool, setActiveElement) {
    if (selectedTool === "hand" || selectedTool === "selection") {
        return;
    }
    const {clientX, clientY} = getMouseCoordinates(ev);
    const values = {}

    const coord = {
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
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
    setActiveElement(ele);
}

export function mouseMove(ev, updateScreen, activeElement) {
    const {clientX, clientY} = getMouseCoordinates(ev);
    if(activeElement) {
        activeElement.updateElementCoordinates({
            x2: clientX,
            y2: clientY,
        })
        updateScreen()
    }
}

export function mouseUp(ev, setActiveElement) {
    setActiveElement(null);
}

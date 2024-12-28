import { Element } from "@/models/element";

const getMouseCoordinates = event => ({
    clientX: event.clientX,
    clientY: event.clientY
});

export function mouseDown(ev, addElements, selectedTool, setActiveElement) {
    if (selectedTool === "hand" || selectedTool === "selection") return;

    const { clientX, clientY } = getMouseCoordinates(ev);
    const values = {
        id: 1,
        type: selectedTool,
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY
    };

    const ele = new Element(values);
    addElements([ele]);
    setActiveElement(ele);
}

export function mouseMove(ev, updateScreen, activeElement) {
    if (activeElement) {
        const { clientX, clientY } = getMouseCoordinates(ev);
        activeElement.updateElementCoordinates({ x2: clientX, y2: clientY });
        updateScreen();
    }
}

export function mouseUp(ev, setActiveElement) {
    setActiveElement(null);
}

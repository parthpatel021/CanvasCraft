import { Element } from "@/models/element";

const getMouseCoordinates = (event, stage) => ({
    clientX: (event.clientX - stage.x * stage.scale) / (stage.scale),
    clientY: (event.clientY - stage.y * stage.scale) / (stage.scale),
});

export function mouseDown(ev, addElements, selectedTool, setActiveElement, stage) {
    if (selectedTool === "hand" || selectedTool === "selection") return;

    const { clientX, clientY } = getMouseCoordinates(ev, stage);
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

export function mouseMove(ev, updateScreen, activeElement, stage) {
    if (activeElement) {
        const { clientX, clientY } = getMouseCoordinates(ev, stage);
        activeElement.updateElementCoordinates({ x2: clientX, y2: clientY });
        updateScreen();
    }
}

export function mouseUp(ev, setActiveElement) {
    setActiveElement(null);
}

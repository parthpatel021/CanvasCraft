import { Element } from "@/models/element"

export function mouseDown(ev, addElements) {
    const ele = new Element({id: 1, type: "rectangle", x1: 100, y1: 100, x2: 300, y2: 300});
    addElements([ele]);
}

export function mouseMove(ev) {

}

export function mouseUp(ev) {

}

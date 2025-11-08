import {
    HandRaisedIcon,
    CursorArrowRaysIcon,
    Square2StackIcon,
    CircleStackIcon,
    ArrowRightIcon,
    MinusIcon,
    PencilIcon,
    ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

import { ToolButton } from "./definations";

const toolBarBtns: ToolButton[] = [
    {
        name: "Hand (Panning Tool)",
        slug: "hand",
        cursor: "grab",
        icon: HandRaisedIcon,
        type: "secondary",
    },
    {
        name: "Selection",
        slug: "selection",
        cursor: "default",
        icon: CursorArrowRaysIcon,
        numShortcut: 1,
        type: "secondary",
    },
    {
        name: "Rectangle",
        slug: "rectangle",
        cursor: "crosshair",
        icon: Square2StackIcon,
        numShortcut: 2,
        type: "secondary",
    },
    {
        name: "Ellipse",
        slug: "ellipse",
        cursor: "crosshair",
        icon: CircleStackIcon,
        numShortcut: 3,
        type: "secondary",
    },
    {
        name: "Arrow",
        slug: "arrow",
        cursor: "crosshair",
        icon: ArrowRightIcon,
        numShortcut: 4,
        type: "secondary",
    },
    {
        name: "Line",
        slug: "line",
        cursor: "crosshair",
        icon: MinusIcon,
        numShortcut: 5,
        type: "secondary",
    },
    // Placeholder for future tools (handled separately).
    // Example "Draw" entry — uncomment and implement when ready:
    // {
    //     name: "Draw (coming soon)",
    //     slug: "draw",
    //     cursor: "crosshair",
    //     icon: PencilIcon,
    //     numShortcut: 6,
    //     type: "secondary",
    // },
    {
        name: "Text",
        slug: "text",
        cursor: "text",
        icon: ChatBubbleLeftIcon,
        numShortcut: 7,
        type: "secondary",
    },
];

const drawableCanvasType = ["rectangle", "ellipse", "line", "arrow", "text"]

export { toolBarBtns, drawableCanvasType };

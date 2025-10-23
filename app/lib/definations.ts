import { ComponentType, SVGProps } from "react";

export type ToolButton = {
    name: string;
    slug: string;
    cursor: string;
    type: "primary" | "secondary";
    filledIcon?: ComponentType<SVGProps<SVGSVGElement>> | null;
    icon?: ComponentType<SVGProps<SVGSVGElement>> | null;
    numShortcut?: number;
};

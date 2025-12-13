"use client";

import { ToolButton } from "@/app/lib/definations";

type ToolBtnComp = ToolButton & {
    clickCB: (slug: string) => void;
    active: boolean;
};

export default function ToolBarBtn({
    icon: Icon,
    slug,
    active,
    clickCB,
}: ToolBtnComp) {
    return (
        <button
            onClick={() => clickCB(slug)}
            className={`flex justify-center items-center px-3 py-2 rounded-lg cursor-pointer opacity-80 transition-colors
        ${active ? "bg-[#403E6A]" : "hover:bg-neutral-700"}`}
        >
            {Icon && <Icon className={`w-7 h-5 ${active ? "fill-white" : ""}`} />}
        </button>
    );
}

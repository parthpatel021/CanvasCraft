"use client";

import { Metadata } from "next";
import ToolBar from "./ui/toolbar/toolbar";
import useTools from "./hooks/useTools";

export default function Canvas() {
    const tools = useTools();
    return (
        <div className="h-screen w-full">
            <ToolBar {...tools} />
            <div>Drawing Page</div>
        </div>
    );
}

"use client";

import { ShapeType, TextShape } from "@/app/models";
import { FocusEventHandler, useEffect, useRef } from "react";


type TextAreaInputInterface = {
    onBlur: FocusEventHandler<HTMLTextAreaElement>;
    getElement: () => ShapeType | undefined;
};

export default function TextAreaInput({getElement, onBlur}: TextAreaInputInterface) {
    const element = getElement();
    if (!(element instanceof TextShape)) {
        return <></>;
    }

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
            setTimeout(() => {
                textArea.focus();
                textArea.value = element.text;
            }, 0);
        }
    }, []);
    return (
        <textarea
            ref={textAreaRef}
            onBlur={onBlur}
            className='rounded-md px-1 text-white'
            style={{
                position: "fixed",
                top: element.y1,
                left: element.x1,
                font: "24px arial",
                margin: 0,
                padding: 0,
                border: 0,
                outline: 0,
                overflow: "hidden",
                whiteSpace: "pre",
                background: "transparent",
                zIndex: 2,
            }}
        />
    );
}

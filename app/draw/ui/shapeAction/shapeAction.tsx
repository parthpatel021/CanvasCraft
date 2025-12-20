"use client";

import { ShapeType } from "@/app/models";
import { getAvailableOptionsForShape, SHAPE_KEY_MAPPING } from "@/app/models/utils/shpeOptions";
import { optionComponents } from "./optionComponents";
import { useEffect, useState } from "react";


type ShapeActionInterface = {
    getElement: () => ShapeType | undefined;
    draw: () => void,
};

export default function ShapeAction({getElement, draw}: ShapeActionInterface) {
    const element = getElement();

    if (!element) {
        return <></>;
    }
    const availableOptions = getAvailableOptionsForShape(element);
    const optionObj = Object.fromEntries(availableOptions.map(opt => [opt.key, element.opts[SHAPE_KEY_MAPPING[opt.key]]]))
    const [options, setoptions] = useState({...optionObj});

    const handleChange = (key: string, val: any) => {
        setoptions((prev) => ({...prev, [key]: val}));
        element.update({}, {[SHAPE_KEY_MAPPING[key as keyof typeof SHAPE_KEY_MAPPING]]: val} as any);
        draw();
    }

    return (
        <div className="bg-neutral-800 absolute top-1/2 left-5 -translate-y-1/2 px-2 py-1 rounded-md z-2">
            <div className="flex flex-col justify-between divide-x divide divide-neutral-700 py-2 px-1" style={{width: "12.5rem"}}>
                {availableOptions.map((option) => {
                    const OptionComponent = optionComponents[option.key];
                    if (!OptionComponent) return;
                    return (
                        <OptionComponent 
                            key={option.key}
                            values={option.values}
                            activeValue={options[option.key]}
                            onChange={(val: any) => handleChange(option.key, val)}
                        />
                    );
                })}
            </div>
        </div>
    )
}

"use client";

import { ShapeType } from "@/app/models";
import { getAvailableOptionsForShape } from "@/app/models/utils/shpeOptions";
import { optionComponents } from "./optionComponents";


type ShapeActionInterface = {
    getElement: () => ShapeType | undefined;
};

export default function ShapeAction({getElement}: ShapeActionInterface) {
    const element = getElement();
    // if (!element) {
    //     return <></>;
    // }
    const availableOptions = getAvailableOptionsForShape("rectangle");
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
                            activeValue={option.values[0]}
                        />
                    );
                })}
            </div>
        </div>
    )
}

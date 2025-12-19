"use client";

import Image from "next/image";

type FillColorOptionInterface = {
    values: any[];
    activeValue: string;
};

export default function FillColorOption({values, activeValue}: FillColorOptionInterface) {
    return (
        <div className="pt-2">
            <p className="py-1">
                Fill Color
            </p>
            <div className="flex justify-between items-center">
                {values.map(colorValue => (
                    <div 
                        key={colorValue}
                        className={`w-7 h-7 rounded ${ colorValue==activeValue && "border"}`}
                        style={{
                            backgroundColor: colorValue,
                            backgroundImage: colorValue === "transparent" ? 'url("/images/transparent.png")' : "",
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

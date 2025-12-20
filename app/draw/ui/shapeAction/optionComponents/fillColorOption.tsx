"use client";

import Image from "next/image";

type FillColorOptionInterface = {
    values: any[];
    activeValue: string;
    onChange: (val: string) => void;
};

export default function FillColorOption({values, activeValue, onChange}: FillColorOptionInterface) {
    return (
        <div className="pt-2">
            <p className="py-1">
                Fill Color
            </p>
            <div className="flex justify-between items-center">
                {values.map(colorValue => (
                    <div 
                        key={colorValue}
                        className={`w-7 h-7 hover:cursor-pointer rounded ${ colorValue==activeValue && "border"}`}
                        style={{
                            backgroundColor: colorValue,
                            backgroundImage: colorValue === "transparent" ? 'url("/images/transparent.png")' : "",
                        }}
                        onClick={() => onChange(colorValue)}
                    />
                ))}
            </div>
        </div>
    )
}

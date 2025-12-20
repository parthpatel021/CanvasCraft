"use client";


type StrokeColorOptionInterface = {
    values: any[];
    activeValue: string;
    onChange: (val: string) => void;
};

export default function StrokeColorOption({values, activeValue, onChange}: StrokeColorOptionInterface) {
    return (
        <div>
            <p className="py-1">
                Stroke
            </p>
            <div className="flex justify-between items-center">
                {values.map(colorValue => (
                    <div 
                        key={colorValue}
                        className={`w-7 h-7 hover:cursor-pointer rounded ${ colorValue==activeValue && "border"}`}
                        style={{
                            backgroundColor: colorValue
                        }}
                        onClick={() => onChange(colorValue)}
                    />
                ))}
            </div>
        </div>
    )
}

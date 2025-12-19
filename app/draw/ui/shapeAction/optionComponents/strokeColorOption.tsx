"use client";


type StrokeColorOptionInterface = {
    values: any[];
    activeValue: string;
};

export default function StrokeColorOption({values, activeValue}: StrokeColorOptionInterface) {
    return (
        <div>
            <p className="py-1">
                Stroke
            </p>
            <div className="flex justify-between items-center">
                {values.map(colorValue => (
                    <div 
                        key={colorValue}
                        className={`w-7 h-7 rounded ${ colorValue==activeValue && "border"}`}
                        style={{
                            backgroundColor: colorValue
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

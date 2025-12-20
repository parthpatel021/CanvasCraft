"use client";

type StrokeWidth = 2 | 4 | 6;

type StrokeWidthOptionProps = {
    values: StrokeWidth[];
    activeValue: StrokeWidth;
    onChange: (val: StrokeWidth) => void;
};

function StrokePreview({ width }: { width: StrokeWidth }) {
    return (
        <line
            x1="2" y1="10"
            x2="18" y2="10"
            stroke="#e3e3e880"
            strokeWidth={width}
            strokeLinecap="round"
        />
    );
}

export default function StrokeWidthOption({
    values,
    activeValue,
    onChange,
}: StrokeWidthOptionProps) {
    return (
        <div className="pt-2">
            <p className="py-1 text-sm font-medium">Stroke</p>
            <div className="flex gap-2">
                {values.map((strokeWidth) => (
                    <div
                        key={strokeWidth}
                        onClick={() => onChange(strokeWidth)}
                        className={`w-8 h-8 hover:cursor-pointer rounded cursor-pointer flex items-center justify-center border ${strokeWidth === activeValue ? "border-white" : "border-neutral-700" }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 20 20">
                            <StrokePreview width={strokeWidth} />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}

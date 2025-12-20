"use client";

type StrokeStyle = "solid" | "dashed" | "dotted";

type StrokeStyleOptionProps = {
    values: StrokeStyle[];
    activeValue: StrokeStyle;
    onChange: (val: StrokeStyle) => void;
};

function StrokeStylePreview({ style }: { style: StrokeStyle }) {
    const dashArray =
        style === "dashed"
            ? "4 3"
            : style === "dotted"
            ? "1 3"
            : undefined;

    return (
        <line
            x1="2"
            y1="10"
            x2="22"
            y2="10"
            stroke="#e3e3e880"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={dashArray}
        />
    );
}

export default function StrokeStyleOption({
    values,
    activeValue,
    onChange,
}: StrokeStyleOptionProps) {
    return (
        <div className="pt-2">
            <p className="py-1 text-sm font-medium">Stroke Style</p>

            <div className="flex gap-2">
                {values.map((style) => (
                    <div
                        key={style}
                        onClick={() => onChange(style)}
                        className={`w-8 h-8 hover:cursor-pointer rounded cursor-pointer flex items-center justify-center border ${style === activeValue ? "border-white" : "border-neutral-700"}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 20 20">
                            <StrokeStylePreview style={style} />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}

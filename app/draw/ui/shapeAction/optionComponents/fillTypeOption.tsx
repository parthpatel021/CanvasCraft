type FillTypeOptionProps = {
    values: string[];
    activeValue: string;
    onChange?: (val: string) => void;
};

function FillPreview({ type }: { type: string }) {
    switch (type) {
        case "solid":
            return <rect width="20" height="20" fill="#e3e3e880" />;
        case "dots":
            return (
                <>
                    <defs>
                        <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                            <circle cx="3" cy="3" r="1" fill="#e3e3e880" />
                        </pattern>
                    </defs>
                    <rect width="20" height="20" fill="url(#dots)" />
                </>
            );
        case "cross-hatch":
            return (
                <>
                    <defs>
                        <pattern id="cross" width="6" height="6" patternUnits="userSpaceOnUse">
                            <path d="M0 0 L6 6 M6 0 L0 6" stroke="#e3e3e880" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="20" height="20" fill="url(#cross)" />
                </>
            );
        case "zigzag":
            return <path d="M0 14 L4 6 L8 14 L12 6 L16 14 L20 6" stroke="#e3e3e880" strokeWidth="1.5" fill="none" />;
    }
}

export default function FillTypeOption({
    values,
    activeValue,
    onChange,
}: FillTypeOptionProps) {
    return (
        <div className="pt-2">
            <p className="py-1 text-sm font-medium">Fill Type</p>
            <div className="flex gap-2">
                {values.map((fillType) => (
                    <div
                        key={fillType}
                        onClick={() => onChange?.(fillType)}
                        className={`w-7 h-7 rounded cursor-pointer flex items-center justify-center border ${fillType === activeValue ? "border-white" : "border-neutral-700"}`}
                    >
                        <svg width="28" height="28" viewBox="0 0 20 20">
                            <FillPreview type={fillType} />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}

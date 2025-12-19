import { SHAPE_ACTION_OPTION_TYPES, ShapeOption, SUPPORTED_TYPE } from "@/app/lib/definations";

const STROKE_COLORS = ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00",];
const FILL_COLORS = ["transparent", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99",];
const FILL_TYPES = ["solid", "zigzag", "cross-hatch", "dots"];
const STROKE_WIDTHS = [2, 4, 6,];
const STROKE_STYLES = ["solid", "dashed", "dotted"];
const SLOPINESS = [0, 0.1, 0.2];

export const hasFillColor = (shapeType: SUPPORTED_TYPE) => [
    "rectangle",
    "ellipse"
].includes(shapeType);

export const hasFillType = (shapeType: SUPPORTED_TYPE) => [
    "rectangle",
    "ellipse"
].includes(shapeType);

export const hasStrokeWidth = (shapeType: SUPPORTED_TYPE) => [
    "rectangle",
    "ellipse",
    "line",
    "arrow"
].includes(shapeType);

export const hasStrokeStyle = (shapeType: SUPPORTED_TYPE) => [
    "rectangle",
    "ellipse",
    "line",
    "arrow"
].includes(shapeType);

export const hasSlopiness = (shapeType: SUPPORTED_TYPE) => [
    "rectangle",
    "ellipse",
    "line",
    "arrow"
].includes(shapeType);


export const OPTION_VALUES: Record<SHAPE_ACTION_OPTION_TYPES, any[]> = {
    strokeColor: STROKE_COLORS,
    fillColor: FILL_COLORS,
    fillType: FILL_TYPES,
    strokeWidth: STROKE_WIDTHS,
    strokeStyle: STROKE_STYLES,
    slopiness: SLOPINESS,
};

export const DEFAULT_SHAPE_OPTIONS: Record<SHAPE_ACTION_OPTION_TYPES, any> = {
    strokeColor: STROKE_COLORS[0],
    fillColor: FILL_COLORS[0],
    fillType: FILL_TYPES[0],
    strokeWidth: STROKE_WIDTHS[0],
    strokeStyle: STROKE_STYLES[0],
    slopiness: SLOPINESS[0],
};

export const AVAILABLE_SHAPE_OPTIONS: Record<SHAPE_ACTION_OPTION_TYPES, string> = {
    strokeColor: 'Stroke',
    fillColor: 'Fill',
    fillType: 'Fill Type',
    strokeWidth: 'Stroke Width',
    strokeStyle: 'Stroke Style',
    slopiness: 'Slopiness',
    // roundness: 'Roundness',
    // opacity: 'Opacity',
};

export const shapeAvailabilityCheckers: Record<SHAPE_ACTION_OPTION_TYPES, Function> = {
    strokeColor: () => true,
    fillColor: hasFillColor,
    fillType: hasFillType,
    strokeWidth: hasStrokeWidth,
    strokeStyle: hasStrokeStyle,
    slopiness: hasSlopiness,
}

export const AVAILABLE_SHAPE_OPTIONS_KEYS: SHAPE_ACTION_OPTION_TYPES[] = Object.keys(AVAILABLE_SHAPE_OPTIONS) as SHAPE_ACTION_OPTION_TYPES[];

export const getAvailableOptionsForShape = (shapeType: SUPPORTED_TYPE) => {
    const availableOptions: ShapeOption[] = [];
    for (const key of AVAILABLE_SHAPE_OPTIONS_KEYS) {
        if (shapeAvailabilityCheckers[key]?.(shapeType)) {
            availableOptions.push({
                title: AVAILABLE_SHAPE_OPTIONS[key],
                values: OPTION_VALUES[key],
                key: key,
            });
        }
    }
    return availableOptions;
}

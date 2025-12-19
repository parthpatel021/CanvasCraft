import { SHAPE_ACTION_OPTION_TYPES } from "@/app/lib/definations";
import StrokeColorOption from "./strokeColorOption";
import FillColorOption from "./fillColorOption";
import FillTypeOption from "./fillTypeOption";
import StrokeWidthOption from "./strokeWidthOption";
import StrokeStyleOption from "./strokeStyleOption";

const optionComponents: Record<SHAPE_ACTION_OPTION_TYPES, React.ComponentType<any> | null> = {
    strokeColor: StrokeColorOption,
    fillColor: FillColorOption,
    fillType: FillTypeOption,
    strokeWidth: StrokeWidthOption,
    strokeStyle: StrokeStyleOption,
    slopiness: null,
}

export {
    optionComponents,
}

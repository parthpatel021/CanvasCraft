// Material-UI icons
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import BackHandIcon from '@mui/icons-material/BackHand';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ModeIcon from '@mui/icons-material/Mode';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockIcon from '@mui/icons-material/Lock';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

// React icons
import { BsCursor, BsCursorFill } from "react-icons/bs";

export const toolbarData = [
    {
        name: 'Hand (Panning Tool)',
        slug: 'hand',
        cursor: 'grab',
        filledIcon: <BackHandIcon sx={{ fontSize: 18 }} />,
        icon: <BackHandOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
        name: 'Selection',
        slug: 'selection',
        cursor: 'default',
        filledIcon: <div className='w-[18px] h-[18px]'> <BsCursorFill /> </div>,
        icon: <div className='w-[18px] h-[18px]'> <BsCursor /> </div>,
        numShortcut: 1,
    },
    {
        name: 'Rectangle',
        slug: 'rectangle',
        cursor: 'crosshair',
        filledIcon: <SquareRoundedIcon sx={{ fontSize: 18 }} />,
        icon: <CropSquareRoundedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 2,
    },
    {
        name: 'Ellipse',
        slug: 'ellipse',
        cursor: 'crosshair',
        filledIcon: <CircleIcon sx={{ fontSize: 18 }} />,
        icon: <CircleOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 3,
    },
    {
        name: 'Arrow',
        slug: 'arrow',
        cursor: 'crosshair',
        filledIcon: <TrendingFlatIcon sx={{ fontSize: 18 }} />,
        icon: <TrendingFlatIcon sx={{ fontSize: 18 }} />,
        numShortcut: 4,
    },
    {
        name: 'Line',
        slug: 'line',
        cursor: 'crosshair',
        filledIcon: <HorizontalRuleIcon sx={{ fontSize: 18 }} />,
        icon: <HorizontalRuleIcon sx={{ fontSize: 18 }} />,
        numShortcut: 5,
    },
    {
        name: 'Draw',
        slug: 'draw',
        cursor: 'crosshair',
        filledIcon: <ModeIcon sx={{ fontSize: 18 }} />,
        icon: <ModeEditOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 6,
    },
    {
        name: 'Text',
        slug: 'text',
        cursor: 'text',
        filledIcon: <TextFieldsIcon sx={{ fontSize: 18 }} />,
        icon: <TextFieldsIcon sx={{ fontSize: 18 }} />,
        numShortcut: 7,
    },
];

export const lockIconData = {
    name: 'Keep selected tool active after drawing',
    filledIcon: <LockIcon sx={{ fontSize: 18 }} />,
    icon: <LockOpenOutlinedIcon sx={{ fontSize: 18 }} />,
};

export const getPannelIconsData = (scale) => ({
    zoomIn: {
        name: 'Zoom In',
        slug: 'zoomIn',
        cursor: 'cursor-pointer',
        filledIcon: <AddIcon sx={{ fontSize: 18 }} />,
        icon: <AddIcon sx={{ fontSize: 18 }} />,
    },
    zoomOut: {
        name: 'Zoom Out',
        slug: 'zoomOut',
        cursor: 'cursor-pointer',
        filledIcon: <RemoveIcon sx={{ fontSize: 18 }} />,
        icon: <RemoveIcon sx={{ fontSize: 18 }} />,
    },
    zoomReset: {
        name: 'Reset Zoom',
        slug: 'resetZoom',
        cursor: 'cursor-pointer',
        filledIcon: <RemoveIcon sx={{ fontSize: 18 }} />,
        icon: <>
            <div className='text-sm peer'>
                {Math.round(scale*100) + '%'}
            </div>
        </>,

    }
});

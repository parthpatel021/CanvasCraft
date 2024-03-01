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
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockIcon from '@mui/icons-material/Lock';

const toolbarData = [
    {
        name: 'Hand (Panning Tool)',
        slug: 'hand',
        cursor: 'cursor-grab',
        filledIcon: <BackHandIcon sx={{ fontSize: 18 }} />,
        icon: <BackHandOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 1,
    },
    {
        name: 'Rectangle',
        slug: 'rectangle',
        cursor: 'cursor-crosshair',
        filledIcon: <SquareRoundedIcon sx={{ fontSize: 18 }} />,
        icon: <CropSquareRoundedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 2,
    },
    {
        name: 'Ellipse',
        slug: 'ellipse',
        cursor: 'cursor-crosshair',
        filledIcon: <CircleIcon sx={{ fontSize: 18 }} />,
        icon: <CircleOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 3,
    },
    {
        name: 'Arrow',
        slug: 'arrow',
        cursor: 'cursor-crosshair',
        filledIcon: <TrendingFlatIcon sx={{ fontSize: 18 }}  />,
       icon: <TrendingFlatIcon sx={{ fontSize: 18 }} />,
        numShortcut: 4,
    },
    {
        name: 'Line',
        slug: 'line',
        cursor: 'cursor-crosshair',
        filledIcon: <HorizontalRuleIcon sx={{ fontSize: 18 }} />,
        icon: <HorizontalRuleIcon sx={{ fontSize: 18 }} />,
        numShortcut: 5,
    },
    {
        name: 'Draw',
        slug: 'draw',
        cursor: 'cursor-crosshair',
        filledIcon: <ModeIcon sx={{ fontSize: 18 }} />,
        icon: <ModeEditOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 6,
    },
    {
        name: 'Text',
        slug: 'text',
        cursor: 'cursor-text',
        filledIcon: <TextFieldsIcon sx={{ fontSize: 18 }} />,
        icon: <TextFieldsIcon sx={{ fontSize: 18 }} />,
        numShortcut: 7,
    },
    {
        name: 'Insert Image',
        slug: 'image',
        cursor: 'cursor-default',
        filledIcon: <InsertPhotoIcon sx={{ fontSize: 18 }} />,
        icon: <InsertPhotoOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 8,
    },
    {
        name: 'Eraser',
        slug: 'eraser',
        cursor: 'cursor-default',
        filledIcon: <AutoFixHighIcon sx={{ fontSize: 18 }} />,
        icon: <AutoFixHighOutlinedIcon sx={{ fontSize: 18 }} />,
        numShortcut: 9,
    },
]

export default toolbarData;

export const lockIconData = {
    name: 'Keep selected tool active after drawing',
    filledIcon: <LockIcon sx={{ fontSize: 18 }} />,
    icon: <LockOpenOutlinedIcon sx={{ fontSize: 18 }} />,
}
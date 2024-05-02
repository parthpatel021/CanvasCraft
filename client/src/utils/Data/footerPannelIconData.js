import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

export const FooterHoverButtonIcon = ({icon, name, size}) => {
    return <>
        <div className='text-sm peer'>
            {icon}
        </div>
        <div className='absolute hidden bg-black top-[-50px] left-[-10px] text-[0.75rem] py-2 rounded-md justify-center align-center peer-hover:flex w-[4.5rem] '>
            {name}
        </div>
    </>
}

const pannelIconsData = {
    zoomIn: {
        name: 'Zoom In',
        slug: 'zoomIn',
        cursor: 'cursor-pointer',
        icon: <AddIcon sx={{ fontSize: 18 }} />,
    },
    zoomOut: {
        name: 'Zoom Out',
        slug: 'zoomOut',
        cursor: 'cursor-pointer',
        icon: <RemoveIcon sx={{ fontSize: 18 }} />,
    },
    undo: {
        name: 'Undo',
        slug: 'undo',
        cursor: 'cursor-pointer',
        icon: <FooterHoverButtonIcon icon={<UndoIcon sx={{ fontSize: 18 }} />} name='Undo'/>
    },
    redo: {
        name: 'Redo',
        slug: 'redo',
        cursor: 'cursor-pointer',
        icon: <FooterHoverButtonIcon icon={<RedoIcon sx={{ fontSize: 18 }} />} name='Redo'/>
    },
    help: {
        name: 'Help',
        slug: 'help',
        cursor: 'cursor-pointer',
        icon: <HelpOutlineOutlinedIcon icon={<RedoIcon sx={{ fontSize: 10 }} />} name='Redo'/>
    },
}

export default pannelIconsData;
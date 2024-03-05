import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ToolButton from './ToolButton';

const DrawFooter = ({ handleCanvasScale, scale }) => {
    const pannelIconsData = {
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
                <div className='absolute hidden bg-black top-[-50px] left-[-10px] text-[0.75rem] w-[5rem] px-2 py-2 rounded-md peer-hover:block'>
                    Reset Zoom
                </div>
            </>,
    
        }
    }

    const handlezoom = (increment) => {
        if(increment === undefined){
            handleCanvasScale(100);
        }
        else if(increment === true){
            handleCanvasScale(Math.round(scale*100+10));
        } else {
            if(scale > 0.1)
                handleCanvasScale(Math.round(scale*100-10));
        }
    }
        
    return (
        <footer className='absolute text-white bottom-4 w-full px-4 flex justify-between'>
            <div className='flex'>
                <div className='bg-[#232329] rounded-lg flex items-center h-10'>

                    <ToolButton
                        {...pannelIconsData.zoomOut}
                        active={false}
                        handleClick={() => handlezoom(false)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomReset}
                        active={false}
                        handleClick={() => handlezoom(undefined)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomIn}
                        active={false}
                        handleClick={() => handlezoom(true)}
                    />
                </div>
            </div>
            <div>

            </div>
        </footer>
    )
}

export default DrawFooter
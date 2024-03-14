import React from 'react';
import ToolButton from './ToolButton';
import pannelIconsData from '../../utils/footerPannelIconData';

const DrawFooter = ({ undo, redo }) => {

    

    return (
        <footer className='absolute text-white bottom-4 w-full px-4 flex justify-between items-start cursor-default pointer-events-none'>
            <div className='flex gap-4'>
                
                <div className='bg-[#232329] rounded-lg flex items-center h-10'>
                    <ToolButton
                        {...pannelIconsData.undo}
                        active={false}
                        handleClick={undo}
                    />
                    <ToolButton
                        {...pannelIconsData.redo}
                        active={false}
                        handleClick={redo}
                    />
                </div>
            </div>

        </footer>
    )
}

export default DrawFooter
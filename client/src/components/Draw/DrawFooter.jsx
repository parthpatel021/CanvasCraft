import React from 'react';
import ToolButton from './ToolButton';
import pannelIconsData, { FooterHoverButtonIcon } from '../../utils/footerPannelIconData';

const DrawFooter = ({ scale, onZoom, undo, redo }) => {
    const zoomResetIcon = <FooterHoverButtonIcon icon={new Intl.NumberFormat("en-GB", {style: 'percent'}).format(scale)}  name='Reset Zoom'/>;

                        
    const zoomReset = {
        name: 'Reset Zoom',
        slug: 'resetZoom',
        cursor: 'cursor-pointer',
        icon: zoomResetIcon
    }

    return (
        <footer className='absolute text-white bottom-4 w-full px-4 flex justify-between items-start cursor-default pointer-events-none'>
            <div className='flex gap-4'>
                
                <div className='bg-[#232329] rounded-lg flex items-center h-10'>
                    <ToolButton
                        {...pannelIconsData.zoomOut}
                        active={false}
                        handleClick={() => onZoom(-0.1)}
                    />
                    <ToolButton
                        {...zoomReset}
                        active={false}
                        handleClick={() => onZoom(null)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomIn}
                        active={false}
                        handleClick={() => onZoom(0.1)}
                    />
                </div>
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
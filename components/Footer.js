import React from 'react';
import { ToolButton } from '@/components/ToolBar';
import { getPannelIconsData } from '@/utils/toolbarData';

export const DrawFooter = ({ handleCanvasScale, scale }) => {
    const pannelIconsData = getPannelIconsData(scale);
    /**
     * factor should only contains zero value to reset zoom
     * @param {Number} factor
     */
    const handlezoom = (factor) => {
        const currentScale = scale*100;
        handleCanvasScale( factor ? Math.round(currentScale + factor) : 100);
    }

    return (
        <footer className='absolute text-white bottom-4 w-full px-4 flex justify-between'>
            <div className='flex'>
                <div className='bg-[#232329] rounded-lg flex items-center h-10'>

                    <ToolButton
                        {...pannelIconsData.zoomOut}
                        active={false}
                        handleClick={() => handlezoom(-10)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomReset}
                        active={false}
                        handleClick={() => handlezoom(0)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomIn}
                        active={false}
                        handleClick={() => handlezoom(10)}
                    />
                </div>
            </div>
            <div>

            </div>
        </footer>
    )
}

import React from 'react';
import { ToolButton } from '@/components/ToolBar';
import { getPannelIconsData } from '@/utils/toolbarData';

export const DrawFooter = ({ handleCanvasScale, scale }) => {
    const pannelIconsData = getPannelIconsData(scale);

    return (
        <footer className='absolute text-white bottom-4 w-full px-4 flex justify-between'>
            <div className='flex'>
                <div className='bg-[#232329] rounded-lg flex items-center h-10'>

                    <ToolButton
                        {...pannelIconsData.zoomOut}
                        active={false}
                        handleClick={() => handleCanvasScale(-0.1)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomReset}
                        active={false}
                        handleClick={() => handleCanvasScale(false)}
                    />
                    <ToolButton
                        {...pannelIconsData.zoomIn}
                        active={false}
                        handleClick={() => handleCanvasScale(0.1)}
                    />
                </div>
            </div>
            <div>

            </div>
        </footer>
    )
}

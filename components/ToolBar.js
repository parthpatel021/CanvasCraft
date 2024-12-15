import React from 'react'
import { toolbarData, lockIconData } from '@/utils/toolbarData';

export function ToolButton({ name, icon, filledIcon, numShortcut, active, handleClick}) {
  return (
    <div 
      className={`flex justify-center items-center w-9 px-6 py-2 relative rounded-lg cursor-pointer ${active ? 'bg-[#403E6A] hover:' : 'hover:bg-neutral-700'} opacity-80 pointer-events-auto`}
      onClick={() => handleClick()}
    >
        {active === true ? filledIcon : icon}
        {numShortcut && 
          <p className='text-[0.7rem] absolute bottom-1 right-2 opacity-60'>
            {numShortcut}
          </p>
        }
    </div>
  )
}

export function ToolBar({tool, setTool}) {
  return (
    <div className='dark:bg-[#232329] dark:text-white absolute top-5  px-2 py-1 rounded-md z-2'>
      <div className='flex justify-between items-center divide-x divide divide-neutral-700'>
        <div className='pr-1'>
          <ToolButton 
            {...lockIconData}
            active={tool.toolLock}
            handleClick={() => setTool((prev) => ({...prev, toolLock: !prev.toolLock}))}
          />
        </div>

        <div className='flex justify-center items-center gap-1 pl-1'>
          {toolbarData.map((d) => 
            <ToolButton 
              key={d.name} 
              {...d} 
              active={d.slug === tool.selectedTool} 
              handleClick={() =>  setTool((prev) => ({...prev, selectedTool: d.slug, cursor: d.cursor}))}
            />
          )}

        </div>

      </div>
    </div>
  )
}

export default ToolBar
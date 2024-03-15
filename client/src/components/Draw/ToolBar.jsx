import React from 'react'
import ToolButton from './ToolButton'
import toolbarData, { lockIconData } from '../../utils/toolbarData';
import { useTool } from '../../hooks/useTool';

const ToolBar = () => {
  const {tool, setTool} = useTool();
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
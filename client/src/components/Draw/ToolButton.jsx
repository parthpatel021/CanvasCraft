import React from 'react'
const ToolButton = ({ name, icon, filledIcon, numShortcut, active, handleClick}) => {
  return (
    <div 
      className={`flex justify-center items-center w-9 px-6 py-2 relative rounded-lg  hover:cursor-pointer ${active ? 'bg-[#403E6A] hover:' : 'hover:bg-neutral-700'} opacity-80`}
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

export default ToolButton
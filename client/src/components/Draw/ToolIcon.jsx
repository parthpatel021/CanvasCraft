import React from 'react'
const ToolIcon = ({ name, icon, filledIcon, numShortcut, active, setSelection}) => {
  return (
    <div 
      className={`flex justify-center items-center w-9 px-6 py-2 relative rounded-lg  hover:cursor-pointer ${active ? 'bg-[#403E6A] hover:' : 'hover:bg-neutral-700'} opacity-80`}
      onClick={() => setSelection()}
    >
        {active === true ? filledIcon : icon}
        <p className='text-[0.7rem] absolute bottom-1 right-2 opacity-60'>{numShortcut ? numShortcut : null}</p>
    </div>
  )
}

export default ToolIcon
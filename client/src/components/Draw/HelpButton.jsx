import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch';

const HelpButton = ({name, url}) => {
  return (
    <div className='bg-[#313038] rounded-lg'>
        <div className='bg-white bg-opacity-0 hover:bg-opacity-10 rounded-lg'>
            <a 
                href={url}
                target="_blank" 
                rel="noreferrer"
                className='text-[#E3E3E8] text-[12px] font-semibold flex justify-center items-center py-2 px-3' 
            >
                {name}
                &nbsp;&nbsp;&nbsp;
                <LaunchIcon  sx={{ fontSize: 14 }} />
            </a>
        </div>
    </div>
  )
}

export default HelpButton
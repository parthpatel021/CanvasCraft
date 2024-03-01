import React, { useEffect, useRef, useState } from 'react'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StopIcon from '@mui/icons-material/Stop';

const SessionFrontCard = ({ openSession }) => {
    return (
        <>
            <h1 className='text-[#a8a5ff] flex w-full items-center justify-center font-bold text-2xl'>
                Live collaboration
            </h1>
            <div className='text-white text-sm leading-normal text-center'>
                <p className='mb-4'>
                    Invite people to collaborate on your drawing.
                </p>
                Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.
            </div>
            <div className='flex items-center justify-center '>
                <button
                    onClick={() => openSession()}
                    className='bg-[#a8a5ff] min-h-[3rem] py-1 px-6 rounded-lg border-[1px] border-transparent cursor-pointer hover:bg-[#bbb8ff] text-black'
                >
                    <div className='flex items-center justify-center gap-3'>
                        <div>
                            <PlayArrowOutlinedIcon sx={{ fontSize: 26 }} />
                        </div>
                        Start session
                    </div>
                </button>
            </div>
        </>

    )
}

const SessionBackCard = ({ closeSession }) => {
    return (
        <>
            <h3 className=' font-semibold text-xl'>
                Live collaboration
            </h3>
            <div className=''>
                <div className='font-semibold'>
                    Your Name
                </div>
                <div className='rounded-xl border-[1px] border-white/50 hover:border-[#a8a5ff] px-4 my-1 flex items-center h-[3rem] bg-transparent '>
                    <input
                        type="text"
                        placeholder='Your Name'
                        // value={'Serene Dolphin'}
                        className='w-full bg-transparent outline-none focus:outline-none text-[1rem]'
                    />
                </div>
            </div>
            <div className=''>
                <div className='font-semibold'>
                    Link
                </div>
                <div className='flex justify-between items-center gap-3'>
                    <div className='rounded-xl border-[1px] border-white/30 px-4 my-1 flex items-center h-[3rem] bg-[#a8a5ff] bg-opacity-5 w-full cursor-text'>
                        <input
                            type="text"
                            placeholder='Your Name'
                            value={'https://excalidraw.com/#room=7a7ea1a69a728466bdb6,2XZbHpnfycvOgg_LLzxUIw'}
                            className='w-full bg-transparent outline-none focus:outline-none text-[1rem] '
                            disabled={true}
                        />
                    </div>
                    <button
                        // onClick={() => openSession()}
                        className='bg-[#a8a5ff] min-h-[3rem] py-1 px-6 rounded-lg border-[1px] border-transparent cursor-pointer hover:bg-[#bbb8ff] text-black h-12 w-[12rem]'
                    >
                        <div className='flex items-center justify-center gap-3 text-sm font-semibold'>
                            <div>
                                <ContentCopyIcon sx={{ fontSize: 20 }} />
                            </div>
                            Copy link
                        </div>
                    </button>
                </div>
            </div>

            <div className='text-[.75rem] px-3 border-t-2'>
                <p className='py-2'>🔒 Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.</p>
                <p>Stopping the session will disconnect you from the room, but you'll be able to continue working with the scene, locally. Note that this won't affect other people, and they'll still be able to collaborate on their version.</p>
            </div>

            <div className='flex justify-center'>
                <button className='bg-transperent min-h-[3rem] py-1 px-4 rounded-lg border-[1px] border-[#ffa8a5] hover:border-[#ac2b29] transition cursor-pointer text-[#ffa8a5] hover:text-[#ac2b29] h-12  flex justify-center items-center gap-3'>
                    <div>
                        <StopIcon sx={{ fontSize: 26 }} />
                    </div>
                    Stop Session
                </button>
            </div>
        </>
    )
}

const Session = ({ closeSessionCard }) => {
    const cardRef = useRef(null);
    const [liveSession, setLiveSession] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (cardRef.current && !cardRef.current.contains(e.target)) {
                closeSessionCard();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [closeSessionCard]);
    
    return (
        <div className='absolute bg-neutral-900 bg-opacity-10 w-full h-screen flex justify-center items-center'>
            <div
                ref={cardRef}
                className='bg-[#232329] flex flex-col gap-8 p-10 relative w-[38rem] rounded-lg border-[1px] border-neutral-600 transition text-white'
            >
                {!liveSession ?
                    <SessionFrontCard openSession={() => setLiveSession(true)} />
                    :
                    <SessionBackCard closeSession={() => setLiveSession(false)} />
                }

                <button className='text-neutral-300 hover:opacity-50 flex absolute top-5 right-5'
                    onClick={() => closeSessionCard()}
                >
                    <CloseOutlinedIcon />
                </button>
            </div>
        </div>
    )
}

export default Session
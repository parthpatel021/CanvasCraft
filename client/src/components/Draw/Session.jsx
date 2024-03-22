import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StopIcon from '@mui/icons-material/Stop';
import CheckIcon from '@mui/icons-material/Check';
import { generateSessionId } from '../../utils/idGenerator';

const SessionFrontCard = ({ openSession }) => {
    const navigate = useNavigate();

    const startSession = () => {
        const sessionId = generateSessionId();

        navigate(`/?room=${sessionId}`);
    }
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
                    onClick={startSession}
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

const SessionBackCard = ({ sessionId }) => {
    const [isCopyClicked, setIsCopyClicked] = useState(false);
    const navigate = useNavigate();
    const handleCopyClick = () => {
        navigator.clipboard.writeText(`https://canvascraft.onrender.com/?room=${sessionId}`);
        setIsCopyClicked(true);

        setTimeout(() => {
            setIsCopyClicked(false);
        },5000)
    }
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
                <div className='flex justify-between items-center gap-3'>
                    <div className='w-full'>
                        <div className='font-semibold'>
                            Link
                        </div>
                        <div className='rounded-xl border-[1px] border-white/30 px-4 my-1 flex items-center h-[3rem] bg-[#a8a5ff] bg-opacity-5 w-full'>
                            <input
                                type="text"
                                placeholder='Your Name'
                                value={`https://canvascraft.onrender.com/?room=${sessionId}`}
                                className='w-full bg-transparent outline-none focus:outline-none text-[1rem] cursor-text'
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={`flex justify-end transition duration-500 ${isCopyClicked ? 'opacity-100' : 'opacity-0'}`}>
                            <div className='bg-[#cafccc] flex items-center justify-center font-semibold px-2 rounded-lg mb-1 text-[#268039] text-[0.75rem]'>
                                <CheckIcon sx={{ fontSize: 16 }} />
                                copied
                            </div>
                        </div>
                        <button
                            onClick={handleCopyClick}
                            className='bg-[#a8a5ff] min-h-[3rem] py-1 px-6 rounded-lg border-[1px] border-transparent cursor-pointer hover:bg-[#bbb8ff] text-black h-12 w-[9rem]'
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
            </div>

            <div className='text-[.75rem] px-3 border-t-2'>
                <p className='py-2'>🔒 Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.</p>
                <p>Stopping the session will disconnect you from the room, but you'll be able to continue working with the scene, locally. Note that this won't affect other people, and they'll still be able to collaborate on their version.</p>
            </div>

            <div className='flex justify-center'>
                <button
                    onClick={() => navigate('/')}
                    className='bg-transperent min-h-[3rem] py-1 px-4 rounded-lg border-[1px] border-[#ffa8a5] hover:border-[#ac2b29] transition cursor-pointer text-[#ffa8a5] hover:text-[#ac2b29] h-12  flex justify-center items-center gap-3'
                >
                    <div>
                        <StopIcon sx={{ fontSize: 26 }} />
                    </div>
                    Stop Session
                </button>
            </div>
        </>
    )
}

const Session = ({ closeSessionCard, sessionId }) => {
    const cardRef = useRef(null);

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
                {sessionId ?
                    <SessionBackCard sessionId={sessionId} />
                    :
                    <SessionFrontCard />
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
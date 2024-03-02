import React, { useEffect, useRef, useState } from 'react'
import ToolBar from './../components/Draw/ToolBar';
import createElement from '../utils/Element/createElement';
import drawElement from '../utils/Element/drawElement';
import { useTool } from '../hooks/useTool';
import Session from '../components/Draw/Session';
import updateOneElement from '../utils/Element/updateElement';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Draw = () => {
    const { tool } = useTool();
    const canvasRef = useRef(null);
    const [mouse, setMouse] = useState({
        x: undefined,
        y: undefined,
        isClicked: false,
        currentElementIdx: -1
    });
    const [elements, setElements] = useState([]);
    const [sessionCard, setSessionCard] = useState(false);
    
    const location = useLocation();
    const [sessionId,setSessionId] = useState(undefined);

    useEffect(() => {
        const { room } =  queryString.parse(location.search); 
        setSessionId(room);

    },[setSessionId, location.search])

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMouse((prev) => {
                return { ...prev, x: event.x, y: event.y }
            })
        }

        const handleMouseDown = () => {
            if (tool.selectedTool !== 'hand') {
                const newElement = createElement(mouse, tool.selectedTool);

                const elementIdx = elements.length;
                setElements(prev => [...prev, newElement]);

                setMouse((prev) => ({ ...prev, isClicked: true, currentElementIdx: elementIdx }))
            }
        }

        const handleMouseUp = () => {
            setMouse((prev) => {
                return { ...prev, isClicked: false }
            })
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        }

    }, [elements.length,  mouse])

    

    useEffect(() => {
        const updateElement = () => {
            const updatedElements = [...elements];
            updatedElements[mouse.currentElementIdx] = updateOneElement(elements[mouse.currentElementIdx], mouse)
            
            return updatedElements;
        }

        if (mouse.isClicked === true) {
            let updatedElements = updateElement();
            setElements((prev) => [...updatedElements])
        }
    }, [mouse])

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        elements.forEach(element => drawElement(element, ctx))
    }, [elements]);


    return (
        <div className={`h-screen dark:bg-neutral-900 bg-white flex justify-center items-center ${tool.cursor}`}>
            <ToolBar />
            <button 
                className='bg-[#a8a5ff] min-h-[2.25rem] px-3 rounded-lg border-[1px] border-transparent cursor-pointer hover:bg-[#bbb8ff] absolute top-4 right-4 text-sm'
                onClick={() => setSessionCard(true)}
            >
                Share
            </button>
            {sessionCard ? <Session closeSessionCard={() => setSessionCard(false)} sessionId={sessionId} /> : null}
            
            <canvas ref={canvasRef}>Drawing Canvas</canvas>
        </div>
    )
}

export default Draw
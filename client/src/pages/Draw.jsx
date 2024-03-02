import React, { useEffect, useRef, useState } from 'react'
import ToolBar from './../components/Draw/ToolBar';
import createElement from '../utils/Element/createElement';
import drawElement from '../utils/Element/drawElement';
import { useTool } from '../hooks/useTool';
import Session from '../components/Draw/Session';
import updateOneElement from '../utils/Element/updateElement';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { io } from 'socket.io-client';

const Draw = () => {
    const { tool } = useTool();
    const canvasRef = useRef(null);
    const [mouse, setMouse] = useState({
        x: undefined,
        y: undefined,
        isClicked: false,
        currentElementId: -1
    });
    const [elements, setElements] = useState([]);
    const [sessionCard, setSessionCard] = useState(false);

    const location = useLocation();
    const [sessionId, setSessionId] = useState(undefined);
    const [socket, setSocket] = useState(undefined);

    useEffect(() => {
        const { room } = queryString.parse(location.search);
        setSessionId(room);

        setSocket(io(process.env.REACT_APP_API));

    }, [setSessionId, location.search])

    useEffect(() => {

        if (socket && sessionId) {
            socket.emit('join', sessionId);

            socket.on('createElement', element => {
                setElements((prev) => [...prev, element]);
            })

            socket.on('updateElement', element => {
                setElements((prev) => {
                    prev.map(e => {
                        if (e.id === element.id)
                            return element;
                        else return e;
                    });
                })
            })
        }
    }, [sessionId, socket])

    const handleMouseMove = (event) => {
        setMouse((prev) => {
            return { ...prev, x: event.clientX, y: event.clientY }
        })
    }

    const handleMouseDown = () => {
        if (tool.selectedTool !== 'hand') {
            const newElement = createElement(mouse, tool.selectedTool);

            setElements(prev => [...prev, newElement]);

            setMouse((prev) => ({ ...prev, isClicked: true, currentElementId: newElement.id }))
        }
    }

    const handleMouseUp = () => {
        setMouse((prev) => {
            return { ...prev, isClicked: false }
        })
    }

    useEffect(() => {
        const updateElement = () => {
            const updatedElements = elements.map(e => e.id === mouse.currentElementId ? updateOneElement(e, mouse) : e);

            return updatedElements;
        }

        if (mouse.isClicked === true) {
            let updatedElements = updateElement();
            setElements((prev) => [...updatedElements])
        }

    }, [mouse.isClicked, mouse, elements])

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');


        sessionId && socket && socket.emit('elements', elements, sessionId);

        elements.forEach(element => drawElement(element, ctx))
    }, [elements, sessionId, socket]);



    return (
        <div className={`h-screen dark:bg-neutral-900 bg-white flex justify-center items-center ${tool.cursor}`}>
            <ToolBar />
            <button
                className={`${sessionId ? 'bg-[#0fb884]' : 'bg-[#a8a5ff] hover:bg-[#bbb8ff]'} min-h-[2.25rem] px-3 rounded-lg border-[1px] border-transparent cursor-pointer  absolute top-4 right-4 text-sm`}
                onClick={() => setSessionCard(true)}
            >
                Share
            </button>
            {sessionCard ? <Session closeSessionCard={() => setSessionCard(false)} sessionId={sessionId} /> : null}

            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                ref={canvasRef}>Drawing Canvas</canvas>
        </div>
    )
}

export default Draw